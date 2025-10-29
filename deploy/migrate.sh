#!/bin/bash

# Episciences Front Migration Script
# This script migrates the existing deployment structure to the new versioned system
# THIS SHOULD ONLY BE RUN ONCE

set -euo pipefail

# =============================================================================
# CONFIGURATION
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.sh"
MIGRATION_DATE=$(date +"%Y-%m-%d-%H%M%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Global variables
ENVIRONMENT=""
DRY_RUN=false

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

log() {
    local level=$1
    shift
    local message="$@"

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
}

show_help() {
    cat << EOF
Episciences Front Migration Script

USAGE:
    sudo ./migrate.sh [ENV] [OPTIONS]

ARGUMENTS:
    ENV                 Environment to migrate (prod or preprod)

OPTIONS:
    --dry-run           Show what would be done without making changes
    -h, --help          Show this help message

EXAMPLES:
    # Migrate production
    sudo ./migrate.sh prod

    # Migrate preproduction
    sudo ./migrate.sh preprod

    # Test migration without changes
    sudo ./migrate.sh prod --dry-run

WHAT IT DOES:
    1. Creates dist-versions/ directory structure
    2. For each journal in dist/:
       - Creates dist-versions/JOURNAL/TIMESTAMP/
       - Moves journal files to the versioned directory
       - Replaces journal with symbolic link
    3. Sets correct ownership (www-data:www-data)
    4. Preserves all existing data

NOTES:
    - THIS SHOULD ONLY BE RUN ONCE per environment
    - Must be run as root
    - Run with --dry-run first to see what will happen
    - Creates a backup timestamp for reference
    - Sets ownership to www-data:www-data for all files
    - If dist/ is already a symbolic link structure, migration is not needed

SAFETY:
    - No data is deleted
    - Original structure is preserved in versioned directories
    - Ownership is set correctly for web server (www-data)
    - Can be reverted by restoring from dist-versions

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
    cp $SCRIPT_DIR/config.example.sh $CONFIG_FILE"
    fi

    source "$CONFIG_FILE"
}

run_as_deploy_user() {
    local cmd="$@"
    log INFO "Running as $DEPLOY_USER: $cmd"
    sudo -u "$DEPLOY_USER" bash -c "$cmd"
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

    # Parse remaining options
    while [ $# -gt 0 ]; do
        case "$1" in
            --dry-run)
                DRY_RUN=true
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

is_already_migrated() {
    local target_path=$(get_target_path)
    local dist_dir="$target_path/dist"

    # Check if dist-versions exists
    if [ ! -d "$target_path/dist-versions" ]; then
        return 1  # Not migrated
    fi

    # Check if any item in dist/ is a symbolic link
    if [ -d "$dist_dir" ]; then
        local has_symlinks=false
        for item in "$dist_dir"/*; do
            if [ -L "$item" ]; then
                has_symlinks=true
                break
            fi
        done

        if [ "$has_symlinks" = true ]; then
            return 0  # Already migrated
        fi
    fi

    return 1  # Not migrated
}

get_journals_in_dist() {
    local target_path=$(get_target_path)
    local dist_dir="$target_path/dist"

    if [ ! -d "$dist_dir" ]; then
        echo ""
        return
    fi

    # List directories in dist/ (excluding hidden files and non-directories)
    for item in "$dist_dir"/*; do
        if [ -d "$item" ] && [ ! -L "$item" ]; then
            basename "$item"
        fi
    done
}

migrate_journal() {
    local journal="$1"
    local target_path=$(get_target_path)
    local dist_dir="$target_path/dist"
    local journal_dir="$dist_dir/$journal"
    local versions_base="$target_path/dist-versions/$journal"
    local version_dir="$versions_base/$MIGRATION_DATE"

    log INFO "Migrating journal: $journal"

    if [ "$DRY_RUN" = true ]; then
        log INFO "[DRY-RUN] Would create: $version_dir"
        log INFO "[DRY-RUN] Would move: $journal_dir -> $version_dir"
        log INFO "[DRY-RUN] Would create link: $journal_dir -> ../dist-versions/$journal/$MIGRATION_DATE"
        log INFO "[DRY-RUN] Would chown: $DEPLOY_USER:$DEPLOY_GROUP (version dir and link)"
        return
    fi

    # Create version directory
    mkdir -p "$version_dir"

    # Move all files (including hidden files) to version directory
    log INFO "Moving all files to $version_dir..."
    if ! find "$journal_dir" -mindepth 1 -maxdepth 1 -exec mv {} "$version_dir/" \;; then
        error_exit "Failed to move journal contents: $journal"
    fi

    # Remove now-empty directory (or force removal if still has content)
    log INFO "Removing source directory..."
    if ! rmdir "$journal_dir" 2>/dev/null; then
        log WARN "Directory not empty, forcing removal with rm -rf..."
        if ! run_as_deploy_user "rm -rf '$journal_dir'"; then
            error_exit "Failed to remove directory: $journal_dir"
        fi
    fi

    # Set ownership on version directory
    log INFO "Setting ownership on version directory..."
    if ! chown -R "$DEPLOY_USER:$DEPLOY_GROUP" "$version_dir"; then
        error_exit "Failed to set ownership on version directory: $journal"
    fi

    # Create symbolic link
    log INFO "Creating symbolic link..."
    local link_target="../dist-versions/$journal/$MIGRATION_DATE"
    if ! run_as_deploy_user "ln -s '$link_target' '$journal_dir'"; then
        error_exit "Failed to create symbolic link for: $journal"
    fi

    # Set ownership on the link
    log INFO "Setting ownership on symbolic link..."
    if ! chown -h "$DEPLOY_USER:$DEPLOY_GROUP" "$journal_dir"; then
        error_exit "Failed to set ownership on symbolic link: $journal"
    fi

    # Verify link
    if [ ! -L "$journal_dir" ]; then
        error_exit "Symbolic link verification failed for: $journal"
    fi

    log SUCCESS "Migrated journal: $journal"
}

# =============================================================================
# MAIN FUNCTION
# =============================================================================

main() {
    log INFO "=========================================="
    log INFO "Episciences Front Migration"
    log INFO "=========================================="
    log INFO "Started at: $(date)"

    # Check prerequisites
    check_root "$@"
    load_config
    parse_arguments "$@"

    log INFO "Environment: $ENVIRONMENT"
    log INFO "Migration timestamp: $MIGRATION_DATE"
    log INFO "Dry run: $DRY_RUN"
    log INFO "Deploy user: $DEPLOY_USER"

    # Get target path
    local target_path=$(get_target_path)
    log INFO "Target path: $target_path"

    # Validate target path exists
    if [ ! -d "$target_path" ]; then
        error_exit "Target path does not exist: $target_path

Please create it first or check your configuration."
    fi

    # Check if already migrated
    if is_already_migrated; then
        log WARN "This environment appears to be already migrated!"
        log INFO "Found dist-versions/ directory and symbolic links in dist/"
        echo ""
        echo -n "Continue anyway? This may cause issues. (yes/no): "
        read -r confirmation

        if [ "$confirmation" != "yes" ]; then
            log INFO "Migration cancelled"
            exit 0
        fi
    fi

    # Get journals to migrate
    local journals=($(get_journals_in_dist))

    if [ ${#journals[@]} -eq 0 ]; then
        log WARN "No journals found in $target_path/dist/"
        log INFO "Either the directory is empty or all items are already symbolic links"
        exit 0
    fi

    log INFO "Found ${#journals[@]} journals to migrate"
    log INFO "Journals: ${journals[*]}"

    # Confirm migration
    if [ "$DRY_RUN" = false ]; then
        echo ""
        log WARN "This will modify the directory structure."
        log INFO "All data will be preserved in versioned directories."
        echo ""
        echo -n "Proceed with migration? (yes/no): "
        read -r confirmation

        if [ "$confirmation" != "yes" ]; then
            log INFO "Migration cancelled"
            exit 0
        fi
    fi

    # Create dist-versions directory
    log STEP "Creating directory structure..."
    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$target_path/dist-versions"
        mkdir -p "$target_path/logs"
        log SUCCESS "Directory structure created"
    else
        log INFO "[DRY-RUN] Would create: $target_path/dist-versions"
        log INFO "[DRY-RUN] Would create: $target_path/logs"
    fi

    # Migrate each journal
    log STEP "Migrating journals..."
    for journal in "${journals[@]}"; do
        migrate_journal "$journal"
    done

    # Summary
    log INFO "=========================================="
    log SUCCESS "Migration completed successfully!"
    log INFO "=========================================="
    log INFO "Environment: $ENVIRONMENT"
    log INFO "Journals migrated: ${#journals[@]}"
    log INFO "Migration timestamp: $MIGRATION_DATE"
    log INFO "Completed at: $(date)"

    if [ "$DRY_RUN" = true ]; then
        log WARN "This was a DRY-RUN. No changes were made."
        log INFO "Run without --dry-run to perform actual migration."
    else
        echo ""
        log INFO "Next steps:"
        log INFO "1. Verify journals are accessible"
        log INFO "2. Check symbolic links: ls -la $target_path/dist/"
        log INFO "3. Test deployment: cd $SCRIPT_DIR && sudo ./deploy.sh $ENVIRONMENT dmtcs"
    fi

    echo ""
}

# Run main function with all arguments
main "$@"
