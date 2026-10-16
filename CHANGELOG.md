# Changelog: SLIIT Courseweb Cleaner

All notable changes to the **SLIIT Courseweb Cleaner** project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [7.1.0] - 2026-10-16

### Added
- **Dynamic Dark Theme:** Integrated the open-source Dark Reader dynamic engine to provide an eye-friendly, high-contrast dark theme across all SLIIT Courseweb pages (`/my/`, `/my/courses.php`, `/course/view.php`, and subpages).
- **Modern Toolbar Action Popup:** Introduced an interactive extension popup accessible right from the browser toolbar, enabling quick profile adjustments, theme toggling, and ghost mode switching on the fly.
- **Dedicated Firefox AMO Package:** Created dedicated Firefox build target (`dist/sliit-courseweb-cleaner-firefox.zip`) utilizing `manifest.firefox.json` with Gecko ID configuration and compatibility down to Firefox 109.0.
- **Dual MV3 Compatibility:** Optimized service worker registration for both Chromium-based browsers (`service_worker`) and Mozilla Firefox (`scripts`).
- **Official Documentation Website:** Deployed the official web landing page at [sliit-courseweb-cleaner-web.pages.dev](https://sliit-courseweb-cleaner-web.pages.dev/).
- **MCP Server Ecosystem Link:** Embedded reference and link to Kesaru Hasun's [SLIIT Courseweb MCP Server](https://github.com/kesaruhasun/mcp-sliit-courseweb).

### Changed
- Refactored `build.sh` pipeline into 4 distinct phases: Userscript compilation, Extension sync, Chromium packaging, and Firefox AMO staging.
- Replaced direct dynamic HTML injection with sanitized `DOMParser` routines for Firefox AMO compliance.
- Upgraded popup Save action to provide clear visual "Applied!" feedback before dismissing.

---

## [7.0.0] - 2026-09-01

### Added
- **Dynamic DOM Observer:** Migrated DOM checking from polling timers to native `MutationObserver` with `requestAnimationFrame` debouncing for instantaneous reaction to Moodle dynamic content.
- **Ghost Mode ("Peek" Mode):** Added toggle to dim unassigned modules (25% opacity, grayscale, subtle shrink) instead of completely removing them.
- **Double-Lock Defense:** Safeguard logic ensuring filters never execute prematurely before the user finishes initial campus/batch setup.
- **Partner Program Isolation:** Built-in heuristics separating international degree programs (Deakin, Curtin) from local batch modules.
- **Remote Community Rules:** Background synchronization via `chrome.alarms` to fetch updated regex rules from GitHub (`rules.json`).

---

## [6.12.0] - 2026-08-15

### Added
- Standalone Manifest V3 browser extension structure alongside the original Tampermonkey script.
- Group ID filtering for targeting individual subgroups (e.g., `0301`).
- Custom comma-separated Whitelist and Blacklist support.

---

## [6.0.0] - 2026-07-20

### Added
- Interactive configuration modal injected into Moodle DOM.
- Floating yellow settings trigger button anchored to the right side of course pages.
- Persistent configuration storage via `GM_setValue` and `GM_getValue`.
- Notice protector logic safeguarding alerts, rescheduled labs, and general notices.
