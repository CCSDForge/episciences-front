# Directory configurations
LOGO_SRC_DIR := external-assets/logos
LOGO_TEMP_DIR := tmp/logos
JOURNAL_LIST_FILE := external-assets/journals.txt
ENV_FILE_PREFIX := external-assets/.env.local.

# Default logo configurations
DEFAULT_BIG_LOGO := default-big.svg
DEFAULT_SMALL_LOGO := default-small.svg

# Read journals from the journal list file
JOURNALS := $(shell cat $(JOURNAL_LIST_FILE) 2>/dev/null)

.PHONY: all clean list $(JOURNALS)

# Default target
all: $(JOURNALS)

# List available journals
list:
	@if [ -f $(JOURNAL_LIST_FILE) ]; then \
		echo "Available journals:"; \
		cat $(JOURNAL_LIST_FILE); \
	else \
		echo "No journals found. Check $(JOURNAL_LIST_FILE)"; \
	fi

# Clean build artifacts
clean:
	@rm -rf dist
	@rm -rf $(LOGO_TEMP_DIR)
#	@rm -f .env.local

# Per-journal build
$(JOURNALS):
	@if ! grep -q "^$@$$" $(JOURNAL_LIST_FILE) 2>/dev/null; then \
		echo "Error: Journal '$@' does not exist. Use 'make list' to see available journals."; \
		exit 1; \
	fi
	@echo "Building website for journal: $@"
	# Ensure public logos directory exists
	@mkdir -p $(LOGO_TEMP_DIR) public/logos

	# Copy the environment file for the journal
	@if [ ! -f $(ENV_FILE_PREFIX)$@ ]; then \
		echo "Error: Environment file '$(ENV_FILE_PREFIX)$@' not found for journal '$@'."; \
		exit 1; \
	fi
	@cp $(ENV_FILE_PREFIX)$@ .env.local.backup
	@cp $(ENV_FILE_PREFIX)$@ .env.local
	# Build the website with Vite
	@VITE_JOURNAL_RVCODE=$@ npx vite build
	# Clean up temporary logo files
	@rm -rf $(LOGO_TEMP_DIR) public/logos