# Project Roadmap

This document outlines the planned features and long-term vision for the SLIIT Courseweb Module Cleaner.

## Phase 1: Core Functionality (Completed)
- [x] Basic text-matching filter for specific batches.
- [x] Protection for shared materials and general notices.
- [x] Code refactored to use a centralized configuration object.

## Phase 2: User Experience (Completed)
- [x] Injection of a floating settings button into the Moodle DOM.
- [x] Interactive configuration modal (Campus, Batch Type, Group ID).
- [x] Persistent local storage using Tampermonkey API (`GM_setValue`).

## Phase 3: Advanced Features (Planned)
- [ ] **"Peek" Toggle:** A quick-access switch in the Moodle navigation bar to temporarily disable the filter without opening the Tampermonkey dashboard.
- [ ] **Dynamic DOM Observer:** Upgrade the script to use `MutationObserver` so it instantly filters content loaded dynamically via AJAX (without relying on `setTimeout`).
- [ ] **Custom Blocklist:** Allow users to add custom keywords to block specific lecturers' irrelevant announcements.

## Phase 4: Extension Migration (Long-Term)
- [ ] Package the script into a standalone `manifest.json` Chrome/Edge Extension.
- [ ] Publish to the Chrome Web Store for installation without Tampermonkey.