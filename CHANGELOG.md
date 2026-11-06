# Changelog: SLIIT Courseweb Cleaner

All notable changes to the **SLIIT Courseweb Cleaner** project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [7.3.0] - 2026-11-05

### Added
- **Hide Submissions Toggle ([#4](https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues/4)):** Added a dedicated **Hide Submissions** toggle in both the Side Panel Drawer and Toolbar Popup to temporarily hide assignment submission dropboxes (`.modtype_assign`, Turnitin links, and submission portals) while preserving assignment specification PDFs, marking rubrics, and lecture materials.
- **Live Filter Counter Badge & Peek Mode:** Added a real-time counter badge (`#sf-badge-count`) on the floating settings trigger and a live status bar (`.sf-status-banner`) inside the Side Panel with a 1-click **Peek Hidden** button (`#sf-peek-btn`) that temporarily reveals hidden activities with a dashed gold outline.
- **Canonical Campus Alias Dictionary:** Added full alias mapping (`CAMPUS_ALIASES`) so regional center spelling variations (`Mathara`, `Kurunegale`, `Northern`, `Nothern`, `Northern Uni`, `NU Group`, `NU Dataset`, `Colombo`, `Kandy Center`) resolve to the student's canonical campus profile instead of being treated as foreign centers.
- **Curtin Campus Profile & Northern Uni Labeling:** Added `Curtin` to the Target Campus selector in the Side Panel and Toolbar Popup and updated `Jaffna` to `Jaffna / Northern Uni`.
- **Multi-Batch & Universal Group Code Parser:** Added support for compound batch ranges (`Batch 1 and 2`, `Batch 2, 3, WE`, `Batch 02 + Weekend Batch`), multi-cohort titles (`Weekend Batch / Center Repeats & Northern Uni`), and universal academic group codes across all years (`Y1`–`Y4`), semesters (`S1`–`S2`), and faculties (`IT`, `SE`, `CS`, `DS`, `CSNE`, `ISE`, `IM`, `CY`, `BM`, `EN`).
- **Moodle 4.5 Subpage Support:** Extended course page detection to support `/course/section.php` dedicated section views alongside `/course/view.php`.

### Fixed
- **Regional Center Cross-Section State Bleed:** Fixed a critical bug where `activeCampus` and `activeBatch` leaked across `.section` boundaries when an activity description contained an `<h1>`–`<h5>` heading, which previously caused Topic 1 and Topic 2 lecture slides and tutorials to be hidden for Kandy, Matara, Kurunegala, Jaffna, and Metro students.
- **Malabe Numbered Batch Self-Blocking:** Removed the overly broad `\bbatch\s*\d+\b` block rule from `malabeBlockRegexes` that previously hid Malabe students' own `Batch 1`, `Batch 2`, and `Batch 3` notices and assignment links when the word `Malabe` was omitted.
- **Moodle 4.5 Screen-Reader Notice Prefix & Blank Cards:** Stripped Moodle 4.5 `.sr-only` `"Select activity Notice"` prefixes during text extraction (`getCleanActivityText`), cached extracted text on `dataset.sfCleanText` so `display: none` never corrupts subsequent `MutationObserver` passes, and restricted inner element hiding to multi-item lists so visible activities never render as empty card shells.
- **Instantaneous Live Configuration Updates:** Fixed `hasSeenWelcome` state persistence when saving via the Side Panel or Toolbar Popup and enabled zero-reload live re-filtering on toggle and dropdown changes.

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
