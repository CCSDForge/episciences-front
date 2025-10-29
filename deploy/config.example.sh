#!/bin/bash

# Episciences Front Deployment Configuration
#
# This is an example configuration file. To use it:
# 1. Copy this file to config.sh: cp config.example.sh config.sh
# 2. Edit config.sh with your actual values
# 3. config.sh is excluded from git (contains server-specific settings)

# =============================================================================
# ENVIRONMENT PATHS
# =============================================================================

# Production environment path
PROD_PATH="/sites/episciences-front"

# Preproduction environment path
PREPROD_PATH="/sites/episciences-front-preprod"

# =============================================================================
# BUILD CONFIGURATION
# =============================================================================

# User and group for building (git, npm, make)
# Using 'git' provides minimal permissions for security
BUILD_USER="git"
BUILD_GROUP="git"

# User and group for deployed files (web server)
# Files will be owned by this user after deployment
DEPLOY_USER="www-data"
DEPLOY_GROUP="www-data"

# =============================================================================
# VERSION MANAGEMENT
# =============================================================================

# Number of versions to keep per journal
# Older versions will be automatically deleted during deployment
# Recommended: 5-10 depending on available disk space
KEEP_VERSIONS=7

# =============================================================================
# GIT CONFIGURATION
# =============================================================================

# Default git branch to deploy from when not specified
DEFAULT_BRANCH="main"

# =============================================================================
# JOURNAL CLASSIFICATION
# =============================================================================

# Journals that should go to preproduction despite not having -preprod suffix
# Format: array of journal codes
# Example: epijinfo (no -preprod suffix) should be deployed to preprod
PREPROD_EXCEPTIONS=("epijinfo")

# =============================================================================
# OPTIONAL: RSYNC OPTIONS
# =============================================================================

# Options for rsync when copying files (if used)
# Default: archive mode, verbose, compress, show progress
# RSYNC_OPTS="-avz --progress"

# =============================================================================
# OPTIONAL: NOTIFICATIONS
# =============================================================================

# Email to notify on deployment completion (leave empty to disable)
# NOTIFICATION_EMAIL=""

# Slack webhook URL for deployment notifications (leave empty to disable)
# SLACK_WEBHOOK_URL=""

# =============================================================================
# NOTES
# =============================================================================
#
# User Separation (Security):
# - BUILD_USER (git): Executes git, npm, and make operations
#   → Minimal permissions, cannot write to web directories
# - DEPLOY_USER (www-data): Owns the deployed files
#   → Web server serves files with this user
# - Root: Orchestrates the process and changes file ownership
#
# Journal Classification Logic:
# - Journals with "-preprod" suffix → PREPROD environment
# - Journals in PREPROD_EXCEPTIONS array → PREPROD environment
# - All other journals → PROD environment
#
# Examples:
#   dmtcs           → PROD (no suffix, not in exceptions)
#   dmtcs-preprod   → PREPROD (has -preprod suffix)
#   epijinfo        → PREPROD (in PREPROD_EXCEPTIONS)
#   elpub           → PROD (no suffix, not in exceptions)
#   elpub-preprod   → PREPROD (has -preprod suffix)
#
