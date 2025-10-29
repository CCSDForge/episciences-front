#!/bin/bash

# Episciences Front Rollback Script
# This script rolls back a journal to a previous version

set -euo pipefail

# =============================================================================
# CONFIGURATION
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.sh"

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
LIST_ONLY=false
ALREADY_SWITCHED=false

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
    esac
}

show_help() {
    cat << EOF
Episciences Front Rollback Script

USAGE:
    sudo ./rollback.sh [ENV] [JOURNAL] [OPTIONS]

ARGUMENTS:
    ENV                 Environment (prod or preprod)
    JOURNAL             Journal code to rollback (e.g., dmtcs, elpub)

OPTIONS:
    --list              List available versions without rolling back
    -h, --help          Show this help message

EXAMPLES:
    # Rollback a production journal
    sudo ./rollback.sh prod dmtcs

    # Rollback a preproduction journal
    sudo ./rollback.sh preprod elpub-preprod

    # List available versions
    sudo ./rollback.sh prod dmtcs --list

HOW IT WORKS:
    1. Shows the currently active version
    2. Lists all available previous versions
    3. Asks you to select a version to rollback to
    4. Changes the symbolic link (instant rollback)
    5. Verifies the rollback was successful

NOTES:
    - Must be run as root (will switch to www-data)
    - Rollback is instant (just changes a symbolic link)
    - No files are deleted during rollback
    - You can rollback to any version that still exists

EOF
}

error_exit() {
    log ERROR "$1"
    exit 1
}

check_root() {
    if [ "$EUID" -ne 0 ] && [ "$ALREADY_SWITCHED" != "true" ]; then
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

switch_to_www_data() {
    if [ "$(whoami)" != "$BUILD_USER" ] && [ "$ALREADY_SWITCHED" != "true" ]; then
        log INFO "Switching to user: $BUILD_USER"
        export ALREADY_SWITCHED=true
        exec sudo -u "$BUILD_USER" bash "$0" "$@"
    fi
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

    # Second argument should be journal
    if [ $# -eq 0 ]; then
        error_exit "Please specify a journal"
    fi

    case "$1" in
        -*)
            error_exit "Please specify a journal before options"
            ;;
        *)
            JOURNAL="$1"
            shift
            ;;
    esac

    # Parse remaining options
    while [ $# -gt 0 ]; do
        case "$1" in
            --list)
                LIST_ONLY=true
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

get_current_version() {
    local target_path=$(get_target_path)
    local dist_link="$target_path/dist/$JOURNAL"

    if [ ! -L "$dist_link" ]; then
        echo "NONE"
        return
    fi

    # Get the target of the symlink and extract the version
    local link_target=$(readlink "$dist_link")
    local version=$(basename "$link_target")
    echo "$version"
}

list_available_versions() {
    local target_path=$(get_target_path)
    local versions_dir="$target_path/dist-versions/$JOURNAL"

    if [ ! -d "$versions_dir" ]; then
        echo "ERROR: No versions found"
        return 1
    fi

    # List versions sorted by date (newest first)
    ls -1t "$versions_dir" 2>/dev/null || echo "ERROR: No versions found"
}

display_versions() {
    local current_version=$(get_current_version)
    local versions=($(list_available_versions))

    if [ "${versions[0]}" == "ERROR:" ]; then
        log ERROR "No versions found for journal: $JOURNAL"
        log INFO "Versions directory should be at: $(get_target_path)/dist-versions/$JOURNAL"
        return 1
    fi

    echo ""
    log INFO "Available versions for $JOURNAL ($ENVIRONMENT):"
    echo ""

    local index=1
    for version in "${versions[@]}"; do
        if [ "$version" == "$current_version" ]; then
            echo -e "  ${GREEN}[$index]${NC} $version ${YELLOW}(current)${NC}"
        else
            echo "  [$index] $version"
        fi
        ((index++))
    done

    echo ""
    return 0
}

perform_rollback() {
    local target_path=$(get_target_path)
    local current_version=$(get_current_version)
    local versions=($(list_available_versions))

    if [ "${versions[0]}" == "ERROR:" ]; then
        error_exit "No versions found for journal: $JOURNAL"
    fi

    # Display versions
    if ! display_versions; then
        exit 1
    fi

    # Ask user to select version
    echo -n "Select version number to rollback to (or 'q' to quit): "
    read -r selection

    if [ "$selection" == "q" ] || [ "$selection" == "Q" ]; then
        log INFO "Rollback cancelled"
        exit 0
    fi

    # Validate selection
    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt "${#versions[@]}" ]; then
        error_exit "Invalid selection: $selection"
    fi

    # Get selected version (adjust for 0-based array)
    local selected_version="${versions[$((selection - 1))]}"

    # Check if already on this version
    if [ "$selected_version" == "$current_version" ]; then
        log WARN "Already on version: $selected_version"
        log INFO "No rollback needed"
        exit 0
    fi

    # Confirm rollback
    echo ""
    log WARN "About to rollback:"
    log INFO "  Journal: $JOURNAL"
    log INFO "  Environment: $ENVIRONMENT"
    log INFO "  From version: $current_version"
    log INFO "  To version: $selected_version"
    echo ""
    echo -n "Are you sure? (yes/no): "
    read -r confirmation

    if [ "$confirmation" != "yes" ]; then
        log INFO "Rollback cancelled"
        exit 0
    fi

    # Perform rollback
    log INFO "Performing rollback..."

    local dist_link="$target_path/dist/$JOURNAL"
    local new_target="../dist-versions/$JOURNAL/$selected_version"

    # Update symbolic link
    if ! ln -sfn "$new_target" "$dist_link"; then
        error_exit "Failed to update symbolic link"
    fi

    # Verify rollback
    local new_current=$(get_current_version)
    if [ "$new_current" != "$selected_version" ]; then
        error_exit "Rollback verification failed. Current version: $new_current"
    fi

    echo ""
    log SUCCESS "Rollback completed successfully!"
    log INFO "Journal $JOURNAL is now at version: $selected_version"
    echo ""
}

# =============================================================================
# MAIN FUNCTION
# =============================================================================

main() {
    log INFO "=========================================="
    log INFO "Episciences Front Rollback"
    log INFO "=========================================="

    # Check prerequisites
    check_root "$@"
    load_config
    parse_arguments "$@"

    # Switch to build user
    switch_to_www_data "$@"

    log INFO "Environment: $ENVIRONMENT"
    log INFO "Journal: $JOURNAL"

    # Validate target path exists
    local target_path=$(get_target_path)
    if [ ! -d "$target_path" ]; then
        error_exit "Target path does not exist: $target_path"
    fi

    # Check if journal exists
    local versions_dir="$target_path/dist-versions/$JOURNAL"
    if [ ! -d "$versions_dir" ]; then
        error_exit "Journal not found: $JOURNAL

Versions directory does not exist: $versions_dir

Available journals:
$(ls -1 "$target_path/dist-versions/" 2>/dev/null || echo "None")"
    fi

    # List only or perform rollback
    if [ "$LIST_ONLY" = true ]; then
        display_versions
    else
        perform_rollback
    fi
}

# Run main function with all arguments
main "$@"
