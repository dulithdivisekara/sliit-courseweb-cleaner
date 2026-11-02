# Changelog: SLIIT Courseweb Cleaner

All notable changes to the **SLIIT Courseweb Cleaner** project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [7.2.0] - 2026-11-02

### Added
- **Zero-Latency Anti-Flash Preloader:** Upgraded content scripts to execute at `document_start` with synchronous `localStorage` caching (`setAntiFlashTheme`), eliminating white flash-of-unstyled-content (FOUC) during page transitions in dark mode (contributed by [@kavinduUdhara](https://github.com/kavinduUdhara) in [#3](https://github.com/dulithdivisekara/sliit-courseweb-cleaner/pull/3), resolving [#2](https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues/2)).
- **Interactive Side-Panel Drawer UI:** Transformed in-page configuration from a center modal into an animated slide-in drawer anchored to the right viewport, featuring dedicated close controls and backdrop dismissal.
- **CourseWeb Logo Screen Blending:** Configured DarkReader image filter overrides to invert the SLIIT CourseWeb header logo with `mix-blend-mode: screen`, ensuring clean presentation against dark headers.

### Changed
- **Ergonomic Trigger Relocation:** Re-anchored the floating settings trigger button to `bottom: 60px; right: 0` (immediately above Moodle's native back-to-top button) with a pill-shaped border radius, permanently resolving overlay collisions with the right-hand Moodle block drawer.
- **Enhanced Dark Theme Notice Contrast:** Added explicit high-contrast overrides (`#f7b924` background with `#141517` foreground) for yellow-highlighted notice containers, guaranteeing full readability for red text and urgent announcements under dark theme.
- **CourseWeb CSP Compliance:** Added guard routines in DarkReader bundle to disable inline proxy script injection, preventing Content Security Policy violations on CourseWeb domains.

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
