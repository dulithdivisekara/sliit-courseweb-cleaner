#!/bin/bash

# ==============================================================================
# Build Pipeline: SLIIT Courseweb Cleaner
# Description: Compiles the monorepo into Userscript and Browser Extension formats.
# Targets:
#   1. dist/sliit-courseweb-cleaner-extension.zip (Chrome Web Store & Microsoft Edge)
#   2. dist/sliit-courseweb-cleaner-firefox.zip   (Mozilla Firefox Add-ons AMO)
#   3. dist/sliit-courseweb-cleaner.user.js      (Tampermonkey / Violentmonkey)
# ==============================================================================

set -e # Exit immediately on error

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
cp src/darkreader.js extension/darkreader.js
cp src/popup.html extension/popup.html
cp src/popup.css extension/popup.css
cp src/popup.js extension/popup.js
echo -e "${SUCCESS_FORMAT} Extension workspace synchronization complete."

# ------------------------------------------------------------------------------
# Phase 3: Package Extension for Chrome & Edge (Standard Chromium MV3)
# ------------------------------------------------------------------------------
echo -e "${INFO_FORMAT} Packaging Chromium (Chrome & Edge) deployable ZIP archive..."

rm -f dist/sliit-courseweb-cleaner-extension.zip
ROOT_DIR=$(pwd)
cd extension
zip -qr "${ROOT_DIR}/dist/sliit-courseweb-cleaner-extension.zip" ./* -x "manifest.firefox.json"
cd "${ROOT_DIR}"

echo -e "${SUCCESS_FORMAT} Chromium archive securely packaged at: dist/sliit-courseweb-cleaner-extension.zip"

# ------------------------------------------------------------------------------
# Phase 4: Package Extension for Mozilla Firefox AMO (Isolated Staging)
# ------------------------------------------------------------------------------
echo -e "${INFO_FORMAT} Packaging Firefox deployable ZIP archive..."

rm -f dist/sliit-courseweb-cleaner-firefox.zip
TMP_FIREFOX_DIR=$(mktemp -d)
cp -r extension/* "${TMP_FIREFOX_DIR}/"
cp extension/manifest.firefox.json "${TMP_FIREFOX_DIR}/manifest.json"
rm -f "${TMP_FIREFOX_DIR}/manifest.firefox.json"

cd "${TMP_FIREFOX_DIR}"
zip -qr "${ROOT_DIR}/dist/sliit-courseweb-cleaner-firefox.zip" ./*
cd "${ROOT_DIR}"
rm -rf "${TMP_FIREFOX_DIR}"

echo -e "${SUCCESS_FORMAT} Firefox archive securely packaged at: dist/sliit-courseweb-cleaner-firefox.zip"

# ==============================================================================
echo -e "${SUCCESS_FORMAT} Build pipeline executed successfully. All artifacts are ready for deployment."