# Episciences Front Deployment System

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Initial Setup](#initial-setup)
5. [Deployment Guide](#deployment-guide)
6. [Rollback Procedures](#rollback-procedures)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Usage](#advanced-usage)
9. [Maintenance](#maintenance)

## Overview

This deployment system provides an automated, reliable way to build and deploy Episciences journals. It supports:

- **Per-journal deployments**: Deploy a single journal without affecting others
- **Version control**: Keep multiple versions with instant rollback capability
- **Branch/tag deployments**: Deploy from any git branch or tag
- **Dual environment**: Separate production and preproduction environments
- **Zero-downtime**: Atomic deployments using symbolic links

## Architecture

### Directory Structure

The deployment system uses a centralized builder that deploys to separate production and preproduction directories:

```
/sites/
├── episciences-front-builder/     # Centralized builder (git repo)
│   ├── .git/                      # Repository with all source code
│   ├── deploy/                    # Deployment scripts
│   │   ├── README.md              # This documentation
│   │   ├── config.sh              # Configuration (NOT in git)
│   │   ├── config.example.sh      # Configuration template (in git)
│   │   ├── deploy.sh              # Main deployment script
│   │   ├── rollback.sh            # Rollback script
│   │   └── logs/                  # Deployment logs
│   ├── package.json
│   ├── Makefile
│   ├── src/
│   └── dist/                      # Build output (temporary)
│
├── episciences-front/             # PRODUCTION environment
│   ├── dist/                      # Active journals (symbolic links)
│   │   ├── dc -> ../dist-versions/dc/2025-10-29-143022/
│   │   ├── dmtcs -> ../dist-versions/dmtcs/2025-10-29-143022/
│   │   ├── elpub -> ../dist-versions/elpub/2025-10-28-120000/
│   │   └── ...
│   ├── dist-versions/             # Version history by journal
│   │   ├── dc/
│   │   │   ├── 2025-10-28-120000/
│   │   │   ├── 2025-10-29-143022/
│   │   │   └── ...
│   │   ├── dmtcs/
│   │   │   ├── 2025-10-28-120000/
│   │   │   └── ...
│   │   └── ...
│   └── logs/                      # Deployment logs for production
│
└── episciences-front-preprod/     # PREPRODUCTION environment
    ├── dist/
    │   ├── dmtcs-preprod -> ../dist-versions/dmtcs-preprod/2025-10-29-120000/
    │   ├── epijinfo -> ../dist-versions/epijinfo/2025-10-29-120000/
    │   └── ...
    ├── dist-versions/
    └── logs/
```

### Symbolic Link Strategy

Each journal uses its own symbolic link, enabling:

- **Independent deployments**: Deploy one journal without touching others
- **Instant rollback**: Change the symlink to point to a previous version
- **Version history**: Keep N previous versions per journal
- **Zero downtime**: Atomic symlink changes ensure no service interruption

Example:

```bash
# Current deployment
dist/dmtcs -> ../dist-versions/dmtcs/2025-10-29-143022/

# After rollback
dist/dmtcs -> ../dist-versions/dmtcs/2025-10-28-120000/
```

### Journal Classification

Journals are automatically classified into environments based on naming:

- **Production journals**: No suffix (e.g., `dmtcs`, `elpub`, `dc`)
- **Preproduction journals**: `-preprod` suffix (e.g., `dmtcs-preprod`, `elpub-preprod`)
- **Exceptions**: `epijinfo` (no suffix but goes to preproduction)

Classification is configured in `config.sh`:

```bash
PREPROD_EXCEPTIONS=("epijinfo")
```

### Build Process

The build uses a secure two-user approach:

**Build Phase** (executed as `git`):

1. **Git operations**: Fetch, checkout branch/tag, pull updates
2. **Dependencies**: Install npm packages
3. **Build**: Run Makefile to build journals (Vite + TypeScript)

**Deploy Phase** (executed as `root`, files owned by `www-data`): 4. **Deploy**: Copy built files to versioned directories 5. **Set ownership**: Change all files to `www-data:www-data` 6. **Activate**: Update symbolic links (owned by `www-data`) 7. **Cleanup**: Remove old versions (keeping N most recent)

This separation ensures:

- **Security**: Build process runs with minimal permissions (`git`)
- **Isolation**: Build user cannot modify deployed files
- **Correctness**: Web server (`www-data`) owns all served files

## Prerequisites

### Required Software

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**: For repository operations
- **GNU Make**: For build orchestration

### Permissions

- **Root access**: Scripts must be run with `sudo`
- **git user** (for building): Must have:
  - Home directory with bash shell
  - nvm installed with Node.js 18+
  - Read access to repository
  - Write access to build output (dist/)
- **www-data user** (for serving): Must have:
  - Read access to deployed files (set automatically)
- **Git configuration**: Should be configured for `git` user

### Disk Space

Each journal build is approximately 10-50 MB. With 37 journals and 7 versions kept:

- Estimated space needed: ~15 GB per environment
- Monitor disk usage regularly

## Initial Setup

### Step 1: Clone the Builder Repository

```bash
cd /sites/
git clone <repository-url> episciences-front-builder
cd episciences-front-builder
```

### Step 2: Configure Deployment

```bash
cd deploy/
cp config.example.sh config.sh
nano config.sh  # Edit if needed (defaults should work)
```

Configuration options:

```bash
PROD_PATH="/sites/episciences-front"              # Production directory
PREPROD_PATH="/sites/episciences-front-preprod"   # Preproduction directory
BUILD_USER="www-data"                             # User for building
BUILD_GROUP="www-data"                            # Group ownership
KEEP_VERSIONS=7                                   # Versions to keep per journal
DEFAULT_BRANCH="main"                             # Default git branch
PREPROD_EXCEPTIONS=("epijinfo")                   # Journals for preprod despite no suffix
```

### Step 3: Install Node.js for git user

The build process runs as `git` user, so Node.js should be installed in its home directory using nvm:

```bash
# Ensure git user has a home directory and shell
sudo usermod -s /bin/bash git
sudo mkhomedir_helper git  # Or: sudo mkdir -p /home/git && sudo chown git:git /home/git

# Switch to git user
sudo -u git bash

# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version
npm --version

# Exit git user shell
exit

# Verify git user can access Node.js
sudo -u git bash -c "source ~/.nvm/nvm.sh && node --version"
```

### Step 4: Verify Installation

```bash
# Check symbolic links
ls -la /sites/episciences-front/dist/

# Should show something like:
# dmtcs -> ../dist-versions/dmtcs/2025-10-28-000000/
# elpub -> ../dist-versions/elpub/2025-10-28-000000/

# Test deployment (dry-run)
sudo ./deploy.sh prod dmtcs --dry-run

# If successful, you're ready to deploy!
```

## Deployment Guide

### Deploying All Journals

Deploy all journals for an environment:

```bash
cd /sites/episciences-front-builder/deploy/

# Deploy all production journals
sudo ./deploy.sh prod --all

# Deploy all preproduction journals
sudo ./deploy.sh preprod --all
```

This will:

1. Build all journals from the current branch (default: `main`)
2. Create versioned directories with timestamp
3. Update symbolic links
4. Clean up old versions

**Duration**: Approximately 10-15 minutes for all 37 journals.

### Deploying a Single Journal

Deploy only one specific journal:

```bash
# Deploy a production journal
sudo ./deploy.sh prod dmtcs

# Deploy a preproduction journal
sudo ./deploy.sh preprod elpub-preprod

# Deploy the exception journal (epijinfo)
sudo ./deploy.sh preprod epijinfo
```

**Duration**: Approximately 1-2 minutes per journal.

### Deploying from Branches

Deploy from a specific git branch:

```bash
# Deploy from development branch
sudo ./deploy.sh prod dmtcs --branch dev
sudo ./deploy.sh prod dmtcs -b dev

# Deploy all journals from a feature branch
sudo ./deploy.sh preprod --all --branch feature/new-design
```

Use cases:

- Testing new features in preproduction
- Hotfix deployments from hotfix branches
- Beta releases

### Deploying from Tags

Deploy from a specific git tag (recommended for releases):

```bash
# Deploy from a version tag
sudo ./deploy.sh prod dmtcs --tag v2.5.0
sudo ./deploy.sh prod dmtcs -t v2.5.0

# Deploy all journals from a release tag
sudo ./deploy.sh prod --all --tag v3.0.0
```

Use cases:

- Production releases
- Rollback to known good version
- Consistent versioning across journals

### Dry-Run Mode

Test deployment without actually deploying:

```bash
# Simulate deployment
sudo ./deploy.sh prod dmtcs --dry-run

# Simulate with branch
sudo ./deploy.sh prod --all --branch dev --dry-run
```

This will:

- Show what would be done
- Validate configuration
- Check permissions
- Not modify any files

### Progressive Deployment Strategy

Best practice for updates:

```bash
# 1. Deploy to preproduction first
sudo ./deploy.sh preprod --all

# 2. Test thoroughly in preproduction
# - Check functionality
# - Verify all journals load
# - Test critical features

# 3. If tests pass, deploy to production
sudo ./deploy.sh prod --all

# 4. Monitor production
# - Check logs
# - Verify no errors
# - Be ready to rollback if needed
```

### Getting Help

```bash
# Display help for any script
sudo ./deploy.sh -h
sudo ./deploy.sh --help

sudo ./rollback.sh -h
```

## Rollback Procedures

### Quick Rollback

Instantly revert a journal to its previous version:

```bash
cd /sites/episciences-front-builder/deploy/

# Rollback a production journal
sudo ./rollback.sh prod dmtcs

# Rollback a preproduction journal
sudo ./rollback.sh preprod elpub-preprod
```

The script will:

1. Display the currently active version
2. List available previous versions
3. Ask you to confirm the rollback
4. Switch the symbolic link
5. Verify the rollback

**Duration**: Instant (< 5 seconds).

### Listing Available Versions

See what versions are available for rollback:

```bash
# List versions for a specific journal
sudo ./rollback.sh prod dmtcs --list

# Output example:
# Available versions for dmtcs (prod):
#   * 2025-10-29-143022 (current)
#     2025-10-29-120000
#     2025-10-28-180000
#     2025-10-28-120000
```

### Rollback to Specific Version

If the interactive rollback isn't available, manually change the symlink:

```bash
# Switch to www-data
sudo -u www-data bash

# Change symlink
cd /sites/episciences-front/dist/
ln -sfn ../dist-versions/dmtcs/2025-10-28-120000 dmtcs

# Verify
ls -la dmtcs
```

### Emergency Rollback All Journals

If a deployment causes widespread issues:

```bash
# You'll need to rollback each journal individually
# Consider writing a script or doing it manually

for journal in dmtcs elpub dc jips jsedi mbj ops slovo societes-plurielles transformations; do
  sudo ./rollback.sh prod $journal
done
```

## Troubleshooting

### Common Issues

#### Permission Denied

**Symptom**: `Permission denied` errors during build or deployment

**Solutions**:

```bash
# Check if running as root
whoami  # Should show 'root'

# If not root, use sudo
sudo ./deploy.sh prod dmtcs

# Check www-data can write
sudo -u www-data bash -c "touch /sites/episciences-front/test && rm /sites/episciences-front/test"

# Fix ownership if needed
sudo chown -R www-data:www-data /sites/episciences-front/
sudo chown -R www-data:www-data /sites/episciences-front-preprod/
```

#### Build Failures

**Symptom**: Errors during `npm install` or `make` commands

**Solutions**:

```bash
# Check Node.js is accessible for git (build user)
sudo -u git bash -c "source ~/.nvm/nvm.sh && node --version"
sudo -u git bash -c "source ~/.nvm/nvm.sh && npm --version"

# If not found, install nvm and Node.js for git user (see Step 3)

# If nvm is not loading, ensure it's in git user's profile
sudo -u git bash -c "echo 'source ~/.nvm/nvm.sh' >> ~/.bashrc"

# Clear npm cache
cd /sites/episciences-front-builder/
sudo -u git bash -c "source ~/.nvm/nvm.sh && npm cache clean --force"

# Remove node_modules and try again
sudo -u git bash -c "source ~/.nvm/nvm.sh && rm -rf node_modules package-lock.json"
sudo ./deploy.sh prod dmtcs
```

#### Symlink Issues

**Symptom**: Broken symbolic links or 404 errors when accessing journals

**Solutions**:

```bash
# Check symlinks
ls -la /sites/episciences-front/dist/

# Find broken links
find /sites/episciences-front/dist/ -type l ! -exec test -e {} \; -print

# Fix manually
cd /sites/episciences-front/dist/
sudo -u www-data ln -sfn ../dist-versions/dmtcs/2025-10-29-143022 dmtcs
```

#### Disk Space Full

**Symptom**: `No space left on device` errors

**Solutions**:

```bash
# Check disk usage
df -h /sites/

# Check deployment directory sizes
du -sh /sites/episciences-front/dist-versions/*

# Clean old versions (reduce KEEP_VERSIONS in config.sh)
nano /sites/episciences-front-builder/deploy/config.sh
# Change KEEP_VERSIONS to 3 or 5

# Redeploy to trigger cleanup
sudo ./deploy.sh prod dmtcs

# Or manually remove old versions
cd /sites/episciences-front/dist-versions/dmtcs/
ls -lt  # List by date
sudo rm -rf 2025-09-*  # Remove very old versions
```

#### Git Issues

**Symptom**: `Git pull failed` or `Uncommitted changes` errors

**Solutions**:

```bash
cd /sites/episciences-front-builder/

# Check git status
sudo -u git git status

# Reset to clean state
sudo -u git git reset --hard
sudo -u git git clean -fd

# Update git config for git user if needed
sudo -u git git config --global user.name "Git Build User"
sudo -u git git config --global user.email "git@episciences.org"
```

### Log File Locations

Deployment logs are saved in multiple locations:

**Builder logs** (local to builder):

```bash
/sites/episciences-front-builder/deploy/logs/deploy-YYYY-MM-DD-HHMMSS.log
```

**Environment logs** (in prod/preprod directories):

```bash
/sites/episciences-front/logs/deploy-YYYY-MM-DD-HHMMSS.log
/sites/episciences-front-preprod/logs/deploy-YYYY-MM-DD-HHMMSS.log
```

**View recent logs**:

```bash
# Latest deployment log
ls -lt /sites/episciences-front-builder/deploy/logs/ | head -1

# View log
cat /sites/episciences-front-builder/deploy/logs/deploy-2025-10-29-143022.log

# Search for errors
grep -i error /sites/episciences-front-builder/deploy/logs/deploy-*.log
```

### Debugging Tips

**Enable verbose mode** (if implemented):

```bash
sudo ./deploy.sh prod dmtcs --verbose
```

**Run commands manually**:

```bash
# Become git (build user)
sudo -u git bash

# Load nvm
source ~/.nvm/nvm.sh

# Navigate to builder
cd /sites/episciences-front-builder/

# Test git operations
git fetch --all
git checkout main
git pull

# Test build
npm install
make dmtcs

# Check output
ls -la dist/dmtcs/

# Exit git user
exit

# Note: Deployed files are owned by www-data, but built by git
```

**Check Apache/Nginx logs** (if journals don't load):

```bash
# Apache logs
tail -f /var/log/apache2/error.log
tail -f /var/log/apache2/access.log

# Check journal URL
curl -I https://dmtcs.episciences.org/
```

## Advanced Usage

### Custom Branch Deployments

Deploy feature branches for testing:

```bash
# Developer workflow
git push origin feature/new-stats-page

# Deploy to preprod for testing
sudo ./deploy.sh preprod --all --branch feature/new-stats-page

# After testing, merge to main and deploy to prod
git checkout main
git merge feature/new-stats-page
git push

sudo ./deploy.sh prod --all
```

### Deploying Multiple Specific Journals

While the script doesn't support multiple journals in one command, you can script it:

```bash
# Deploy multiple journals sequentially
for journal in dmtcs elpub dc; do
  echo "Deploying $journal..."
  sudo ./deploy.sh prod $journal
done
```

### Scheduled Deployments

Use cron for scheduled deployments:

```bash
# Edit root's crontab
sudo crontab -e

# Add nightly deployment from main branch
0 2 * * * cd /sites/episciences-front-builder/deploy && ./deploy.sh prod --all >> /var/log/episciences-deploy.log 2>&1
```

### Deployment Notifications

Add email notifications on completion:

```bash
# In deploy.sh, at the end:
echo "Deployment completed" | mail -s "Episciences Deployment" admin@episciences.org
```

Or integrate with Slack:

```bash
# Send Slack notification
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Deployment completed for dmtcs"}' \
  YOUR_SLACK_WEBHOOK_URL
```

## Maintenance

### Cleaning Old Versions

The deployment script automatically removes old versions, keeping only the N most recent (configured by `KEEP_VERSIONS`).

To manually clean:

```bash
# Check versions count
ls /sites/episciences-front/dist-versions/dmtcs/ | wc -l

# Remove specific old version
sudo rm -rf /sites/episciences-front/dist-versions/dmtcs/2025-08-15-120000/
```

### Monitoring Disk Usage

Regularly monitor disk space:

```bash
# Overall disk usage
df -h /sites/

# Size by journal
du -sh /sites/episciences-front/dist-versions/*/ | sort -h

# Largest journal versions
du -sh /sites/episciences-front/dist-versions/*/* | sort -h | tail -20
```

### Log Rotation

Deployment logs can accumulate. Set up log rotation:

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/episciences-deploy

# Add:
/sites/episciences-front-builder/deploy/logs/*.log {
    weekly
    rotate 12
    compress
    delaycompress
    missingok
    notifempty
}

/sites/episciences-front/logs/*.log {
    weekly
    rotate 12
    compress
    delaycompress
    missingok
    notifempty
}

/sites/episciences-front-preprod/logs/*.log {
    weekly
    rotate 12
    compress
    delaycompress
    missingok
    notifempty
}
```

### Backup Strategy

While the versioned deployment provides built-in rollback, consider additional backups:

```bash
# Backup current state
tar -czf episciences-front-backup-$(date +%Y%m%d).tar.gz \
  /sites/episciences-front/dist/ \
  /sites/episciences-front/dist-versions/

# Automated weekly backup
sudo crontab -e
# Add:
0 1 * * 0 tar -czf /backups/episciences-$(date +\%Y\%m\%d).tar.gz /sites/episciences-front/
```

### Updating the Builder Repository

Keep the builder up to date:

```bash
cd /sites/episciences-front-builder/
sudo -u www-data git fetch --all
sudo -u www-data git pull origin main

# If deployment scripts were updated
cd deploy/
sudo ./deploy.sh -h  # Verify new features
```

### Health Checks

Verify deployment health:

```bash
# Check all symlinks are valid
find /sites/episciences-front/dist/ -type l ! -exec test -e {} \; -print

# Should return nothing (no broken links)

# Check journal accessibility
for journal in dmtcs elpub dc; do
  curl -s -o /dev/null -w "%{http_code} $journal\n" https://$journal.episciences.org/
done
```

### Disaster Recovery

In case of catastrophic failure:

1. **Rollback all journals** to last known good version
2. **Check logs** to identify the issue
3. **Fix the problem** in the repository
4. **Test in preprod** before redeploying to prod
5. **Document the incident** for future reference

---

## Questions or Issues?

If you encounter problems not covered in this documentation:

1. Check the logs in `deploy/logs/`
2. Review the [Troubleshooting](#troubleshooting) section
3. Verify prerequisites and permissions
4. Contact the development team

**Last updated**: 2025-10-29
