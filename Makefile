# Per-journal build
$(JOURNALS):
	@if ! grep -q "^$@" $(JOURNAL_LIST_FILE) 2>/dev/null; then \
		echo "Error: Journal '$@' does not exist. Use 'make list' to see available journals."; \
		exit 1; \
	fi
	@echo "Building website for journal: $@"
	# Ensure public logos directory exists
	@mkdir -p $(LOGO_TEMP_DIR) public/logos
	# Copy big logo (use default if not found)
	@cp $(LOGO_SRC_DIR)/logo-$@-big.svg public/logos/logo-big.svg 2>/dev/null || \
		cp $(LOGO_SRC_DIR)/$(DEFAULT_BIG_LOGO) public/logos/logo-big.svg
	# Copy small logo (use default if not found)
	@cp $(LOGO_SRC_DIR)/logo-$@-small.svg public/logos/logo-small.svg 2>/dev/null || \
		cp $(LOGO_SRC_DIR)/$(DEFAULT_SMALL_LOGO) public/logos/logo-small.svg
	# Copy the environment file for the journal
	@if [ ! -f $(ENV_FILE_PREFIX)$@ ]; then \
		echo "Error: Environment file '.env.local.$@' not found for journal '$@'."; \
		exit 1; \
	fi
	@cp $(ENV_FILE_PREFIX)$@ .env.local
	# Build the website with Vite
	@VITE_JOURNAL_RVCODE=$@ npx vite build
	# Clean up temporary logo files
	@rm -rf $(LOGO_TEMP_DIR)
