#!/bin/bash

# Episciences Front Deployment Script
# This script builds and deploys Episciences journals to production or preproduction

set -euo pipefail  # Exit on error, undefined variables, and pipe failures

# =============================================================================
# CONFIGURATION
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.sh"
LOG_DIR="$SCRIPT_DIR/logs"
TIMESTAMP=$(date +"%Y-%m-%d-%H%M%S")
LOG_FILE="$LOG_DIR/deploy-$TIMESTAMP.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Global variables
ENVIRONMENT=""
JOURNAL=""
GIT_BRANCH=""
GIT_TAG=""
DRY_RUN=false
DEPLOY_ALL=false

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")

    # Console output with colors
    case $level in
        INFO)
            echo -e "${CYAN}[INFO]${NC} $message"
            ;;
        SUCCESS)
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
        WARN)
            echo -e "${YELLOW}[WARN]${NC} $message"
            ;;
        ERROR)
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        STEP)
            echo -e "${BLUE}[STEP]${NC} $message"
            ;;
    esac

    # File output without colors
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

show_help() {
    cat << EOF
Episciences Front Deployment Script

USAGE:
    sudo ./deploy.sh [ENV] [JOURNAL|--all] [OPTIONS]

ARGUMENTS:
    ENV                 Environment to deploy to
                        - prod      Production environment
                        - preprod   Preproduction environment

    JOURNAL             Journal code to deploy (e.g., dmtcs, elpub, dmtcs-preprod)
                        Or use --all to deploy all journals

OPTIONS:
    -b, --branch BRANCH Deploy from specific git branch (default: main)
    -t, --tag TAG       Deploy from specific git tag
    --all               Deploy all journals for the environment
    --dry-run           Simulate deployment without making changes
    -h, --help          Show this help message

EXAMPLES:
    # Deploy a single journal to production
    sudo ./deploy.sh prod dmtcs

    # Deploy all production journals
    sudo ./deploy.sh prod --all

    # Deploy from a specific branch
    sudo ./deploy.sh preprod elpub-preprod --branch dev

    # Deploy from a tag
    sudo ./deploy.sh prod --all --tag v2.5.0

    # Test deployment without changes
    sudo ./deploy.sh prod dmtcs --dry-run

JOURNAL CLASSIFICATION:
    - Journals with "-preprod" suffix → preprod environment
    - Journals in PREPROD_EXCEPTIONS (see config.sh) → preprod environment
    - All other journals → prod environment

NOTES:
    - Must be run as root
    - Build operations (git, npm, make) run as: git
    - Deployed files are owned by: www-data
    - Configuration is read from: $CONFIG_FILE
    - Logs are saved to: $LOG_DIR/

EOF
}

error_exit() {
    log ERROR "$1"
    exit 1
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        error_exit "This script must be run as root. Use: sudo $0 $@"
    fi
}

load_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        error_exit "Configuration file not found: $CONFIG_FILE

Please create it from the example:
    cp $SCRIPT_DIR/config.example.sh $CONFIG_FILE
    nano $CONFIG_FILE"
    fi

    source "$CONFIG_FILE"
    log INFO "Configuration loaded from $CONFIG_FILE"
}

run_as_build_user() {
    local cmd="$@"
    log INFO "Running as $BUILD_USER: $cmd"
    # Load nvm if available (for git user with nvm installation)
    sudo -u "$BUILD_USER" bash -c "
        if [ -s ~/.nvm/nvm.sh ]; then
            source ~/.nvm/nvm.sh
        fi
        cd '$PROJECT_ROOT' && $cmd
    "
}

parse_arguments() {
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi

    # First argument should be environment or -h/--help
    case "${1:-}" in
        -h|--help)
            show_help
            exit 0
            ;;
        prod|preprod)
            ENVIRONMENT="$1"
            shift
            ;;
        *)
            error_exit "Invalid environment: ${1:-}. Use 'prod' or 'preprod'"
            ;;
    esac

    # Second argument should be journal or --all
    if [ $# -eq 0 ]; then
        error_exit "Please specify a journal or --all"
    fi

    case "$1" in
        --all)
            DEPLOY_ALL=true
            shift
            ;;
        -*)
            error_exit "Please specify a journal or --all before options"
            ;;
        *)
            JOURNAL="$1"
            shift
            ;;
    esac

    # Parse remaining options
    while [ $# -gt 0 ]; do
        case "$1" in
            -b|--branch)
                GIT_BRANCH="$2"
                shift 2
                ;;
            -t|--tag)
                GIT_TAG="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --all)
                if [ -n "$JOURNAL" ]; then
                    error_exit "--all cannot be used with a specific journal"
                fi
                DEPLOY_ALL=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                error_exit "Unknown option: $1"
                ;;
        esac
    done

    # Validate branch and tag are not both specified
    if [ -n "$GIT_BRANCH" ] && [ -n "$GIT_TAG" ]; then
        error_exit "Cannot specify both --branch and --tag"
    fi

    # Set default branch if neither branch nor tag specified
    if [ -z "$GIT_BRANCH" ] && [ -z "$GIT_TAG" ]; then
        GIT_BRANCH="${DEFAULT_BRANCH:-main}"
    fi
}

get_target_path() {
    case "$ENVIRONMENT" in
        prod)
            echo "$PROD_PATH"
            ;;
        preprod)
            echo "$PREPROD_PATH"
            ;;
    esac
}

is_preprod_journal() {
    local journal="$1"

    # Check if journal has -preprod suffix
    if [[ "$journal" == *-preprod ]]; then
        return 0
    fi

    # Check if journal is in exceptions list
    for exception in "${PREPROD_EXCEPTIONS[@]}"; do
        if [ "$journal" == "$exception" ]; then
            return 0
        fi
    done

    return 1
}

get_journals_for_environment() {
    local env="$1"
    cd "$PROJECT_ROOT"

    # Get all journals from external-assets/journals.txt
    if [ ! -f "external-assets/journals.txt" ]; then
        error_exit "Journal list not found: external-assets/journals.txt"
    fi

    local all_journals=()
    while IFS= read -r journal; do
        # Skip empty lines and comments
        [[ -z "$journal" || "$journal" == \#* ]] && continue
        all_journals+=("$journal")
    done < "external-assets/journals.txt"

    # Filter journals based on environment
    local filtered_journals=()
    for journal in "${all_journals[@]}"; do
        if [ "$env" == "preprod" ]; then
            if is_preprod_journal "$journal"; then
                filtered_journals+=("$journal")
            fi
        else
            if ! is_preprod_journal "$journal"; then
                filtered_journals+=("$journal")
            fi
        fi
    done

    echo "${filtered_journals[@]}"
}

# =============================================================================
# GIT OPERATIONS
# =============================================================================

git_operations() {
    log STEP "Performing git operations..."

    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY-RUN] Would run git operations as $BUILD_USER"
        return
    fi

    # Fetch all branches and tags
    log INFO "Fetching from remote..."
    if ! run_as_build_user "git fetch --all --tags"; then
        error_exit "Git fetch failed"
    fi

    # Checkout appropriate ref
    if [ -n "$GIT_TAG" ]; then
        log INFO "Checking out tag: $GIT_TAG"
        if ! run_as_build_user "git checkout tags/$GIT_TAG"; then
            error_exit "Failed to checkout tag: $GIT_TAG"
        fi
    else
        log INFO "Checking out branch: $GIT_BRANCH"
        if ! run_as_build_user "git checkout $GIT_BRANCH"; then
            error_exit "Failed to checkout branch: $GIT_BRANCH"
        fi

        log INFO "Pulling latest changes..."
        if ! run_as_build_user "git pull origin $GIT_BRANCH"; then
            error_exit "Git pull failed"
        fi
    fi

    # Get current commit SHA for logging
    local commit_sha=$(cd "$PROJECT_ROOT" && git rev-parse HEAD)
    local commit_message=$(cd "$PROJECT_ROOT" && git log -1 --pretty=%B)
    log SUCCESS "Git checkout complete"
    log INFO "Commit: $commit_sha"
    log INFO "Message: $commit_message"
}

# =============================================================================
# BUILD OPERATIONS
# =============================================================================

install_dependencies() {
    log STEP "Installing dependencies..."

    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY-RUN] Would run: npm install as $BUILD_USER"
        return
    fi

    log INFO "Running npm install..."
    if ! run_as_build_user "npm install"; then
        error_exit "npm install failed"
    fi

    log SUCCESS "Dependencies installed"
}

build_journals() {
    local journals=("$@")

    log STEP "Building journals..."

    for journal in "${journals[@]}"; do
        log INFO "Building journal: $journal"

        if [ "$DRY_RUN" = true ]; then
            log INFO "[DRY-RUN] Would run: make $journal as $BUILD_USER"
            continue
        fi

        if ! run_as_build_user "make $journal"; then
            error_exit "Build failed for journal: $journal"
        fi

        # Verify build output exists
        if [ ! -d "$PROJECT_ROOT/dist/$journal" ]; then
            error_exit "Build output not found: $PROJECT_ROOT/dist/$journal"
        fi

        log SUCCESS "Built journal: $journal"
    done

    log SUCCESS "All journals built successfully"
}

# =============================================================================
# DEPLOYMENT OPERATIONS
# =============================================================================

deploy_journal() {
    local journal="$1"
    local target_path=$(get_target_path)
    local version_dir="$target_path/dist-versions/$journal/$TIMESTAMP"
    local dist_link="$target_path/dist/$journal"

    log INFO "Deploying journal: $journal to $ENVIRONMENT"

    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY-RUN] Would create: $version_dir"
        log INFO "[DRY-RUN] Would copy: dist/$journal/ -> $version_dir/"
        log INFO "[DRY-RUN] Would chown: $DEPLOY_USER:$DEPLOY_GROUP $version_dir/"
        log INFO "[DRY-RUN] Would update link: $dist_link -> ../dist-versions/$journal/$TIMESTAMP"
        log INFO "[DRY-RUN] Would chown link: $DEPLOY_USER:$DEPLOY_GROUP $dist_link"
        return
    fi

    # Create version directory
    mkdir -p "$version_dir"

    # Copy built files
    log INFO "Copying files to $version_dir..."
    if ! cp -r "$PROJECT_ROOT/dist/$journal/"* "$version_dir/"; then
        error_exit "Failed to copy files for journal: $journal"
    fi

    # Set ownership to deploy user
    log INFO "Setting ownership to $DEPLOY_USER:$DEPLOY_GROUP..."
    if ! chown -R "$DEPLOY_USER:$DEPLOY_GROUP" "$version_dir"; then
        error_exit "Failed to set ownership for journal: $journal"
    fi

    # Update symbolic link
    log INFO "Updating symbolic link..."
    ln -sfn "../dist-versions/$journal/$TIMESTAMP" "$dist_link"

    # Set ownership on the link itself
    if ! chown -h "$DEPLOY_USER:$DEPLOY_GROUP" "$dist_link"; then
        error_exit "Failed to set ownership on symbolic link for journal: $journal"
    fi

    # Verify link
    if [ ! -L "$dist_link" ]; then
        error_exit "Failed to create symbolic link for journal: $journal"
    fi

    log SUCCESS "Deployed journal: $journal"

    # Cleanup old versions
    cleanup_old_versions "$journal" "$target_path"
}

cleanup_old_versions() {
    local journal="$1"
    local target_path="$2"
    local versions_dir="$target_path/dist-versions/$journal"

    if [ ! -d "$versions_dir" ]; then
        return
    fi

    log INFO "Cleaning up old versions for $journal (keeping $KEEP_VERSIONS most recent)..."

    if [ "$DRY_RUN" = true ]; then
        local version_count=$(ls -1 "$versions_dir" | wc -l)
        if [ "$version_count" -gt "$KEEP_VERSIONS" ]; then
            log INFO "[DRY-RUN] Would remove $((version_count - KEEP_VERSIONS)) old version(s)"
        fi
        return
    fi

    # List versions sorted by modification time (oldest first)
    local versions=($(ls -1t "$versions_dir" | tail -n +$((KEEP_VERSIONS + 1))))

    for version in "${versions[@]}"; do
        log INFO "Removing old version: $version"
        rm -rf "$versions_dir/$version"
    done

    if [ ${#versions[@]} -gt 0 ]; then
        log SUCCESS "Removed ${#versions[@]} old version(s)"
    fi
}

copy_deployment_log() {
    local target_path=$(get_target_path)
    local target_log_dir="$target_path/logs"

    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY-RUN] Would copy log to $target_log_dir/"
        return
    fi

    mkdir -p "$target_log_dir"
    cp "$LOG_FILE" "$target_log_dir/"
    log INFO "Deployment log copied to $target_log_dir/deploy-$TIMESTAMP.log"
}

# =============================================================================
# MAIN FUNCTION
# =============================================================================

main() {
    # Create log directory
    mkdir -p "$LOG_DIR"

    log INFO "=========================================="
    log INFO "Episciences Front Deployment"
    log INFO "=========================================="
    log INFO "Started at: $(date)"
    log INFO "Script: $0"
    log INFO "Arguments: $@"

    # Check prerequisites
    check_root "$@"
    load_config
    parse_arguments "$@"

    # Log deployment parameters
    log INFO "Environment: $ENVIRONMENT"
    if [ "$DEPLOY_ALL" = true ]; then
        log INFO "Deploying: ALL journals"
    else
        log INFO "Deploying: $JOURNAL"
    fi
    if [ -n "$GIT_BRANCH" ]; then
        log INFO "Git branch: $GIT_BRANCH"
    fi
    if [ -n "$GIT_TAG" ]; then
        log INFO "Git tag: $GIT_TAG"
    fi
    log INFO "Dry run: $DRY_RUN"
    log INFO "Target path: $(get_target_path)"
    log INFO "Build user: $BUILD_USER"
    log INFO "Deploy user: $DEPLOY_USER"

    # Determine which journals to deploy
    local journals_to_deploy=()
    if [ "$DEPLOY_ALL" = true ]; then
        journals_to_deploy=($(get_journals_for_environment "$ENVIRONMENT"))
        log INFO "Found ${#journals_to_deploy[@]} journals to deploy"
    else
        journals_to_deploy=("$JOURNAL")
    fi

    # Validate target path exists
    local target_path=$(get_target_path)
    if [ ! -d "$target_path" ] && [ "$DRY_RUN" = false ]; then
        error_exit "Target path does not exist: $target_path

Please run the migration script first:
    sudo ./migrate.sh $ENVIRONMENT"
    fi

    # Execute deployment steps
    git_operations
    install_dependencies
    build_journals "${journals_to_deploy[@]}"

    # Deploy each journal
    log STEP "Deploying journals to $ENVIRONMENT..."
    for journal in "${journals_to_deploy[@]}"; do
        deploy_journal "$journal"
    done

    # Copy log to target directory
    copy_deployment_log

    # Summary
    log INFO "=========================================="
    log SUCCESS "Deployment completed successfully!"
    log INFO "=========================================="
    log INFO "Environment: $ENVIRONMENT"
    log INFO "Journals deployed: ${#journals_to_deploy[@]}"
    log INFO "Timestamp: $TIMESTAMP"
    log INFO "Log file: $LOG_FILE"
    log INFO "Completed at: $(date)"

    if [ "$DRY_RUN" = true ]; then
        log WARN "This was a DRY-RUN. No changes were made."
    fi
}

# Run main function with all arguments
main "$@"
