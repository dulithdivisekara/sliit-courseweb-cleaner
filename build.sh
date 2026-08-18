#!/bin/bash

# ==============================================================================
# Build Pipeline: SLIIT Courseweb Cleaner
# Description: Compiles the monorepo into Userscript and Browser Extension formats.
# ==============================================================================

# Define terminal color codes for structured logging
INFO_FORMAT='\033[1;34m[INFO]\033[0m'
SUCCESS_FORMAT='\033[1;32m[SUCCESS]\033[0m'

echo -e "${INFO_FORMAT} Initiating build sequence for SLIIT Courseweb Cleaner..."

# Ensure the distribution directory exists
mkdir -p dist

# ------------------------------------------------------------------------------
# Phase 1: Compile Tampermonkey Userscript
# ------------------------------------------------------------------------------
echo -e "${INFO_FORMAT} Assembling Userscript context..."
cat src/userscript-main.js src/shared-core.js > dist/sliit-courseweb-cleaner.user.js
echo -e "${SUCCESS_FORMAT} Userscript successfully generated in /dist directory."

# ------------------------------------------------------------------------------
# Phase 2: Synchronize Browser Extension Source
# ------------------------------------------------------------------------------
echo -e "${INFO_FORMAT} Synchronizing shared core logic to extension workspace..."
cp src/shared-core.js extension/shared-core.js
cp src/extension-main.js extension/extension-main.js
cp src/shared-styles.css extension/styles.css
echo -e "${SUCCESS_FORMAT} Extension workspace synchronization complete."

# ------------------------------------------------------------------------------
# Phase 3: Package Extension for Web Stores
# ------------------------------------------------------------------------------
echo -e "${INFO_FORMAT} Packaging extension into deployable ZIP archive..."

# Remove previous build archive to prevent stale data
rm -f dist/sliit-courseweb-cleaner-extension.zip

# Navigate to extension directory, zip contents quietly, and return to root
cd extension || exit
zip -qr ../dist/sliit-courseweb-cleaner-extension.zip ./*
cd ..

echo -e "${SUCCESS_FORMAT} Deployment archive securely packaged at: dist/sliit-courseweb-cleaner-extension.zip"

# ==============================================================================
echo -e "${SUCCESS_FORMAT} Build pipeline executed successfully. Artifacts are ready for deployment."