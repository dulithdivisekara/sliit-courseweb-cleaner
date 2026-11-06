# Architectural Roadmap

This document outlines completed milestones, current developments, and future architectural enhancements for the SLIIT Courseweb Cleaner ecosystem.

<p align="center">
  <a href="README.md">README</a> &bull;
  <a href="CONTRIBUTING.md">Contributing</a> &bull;
  <a href="CODE_OF_CONDUCT.md">Code of Conduct</a> &bull;
  <a href="SECURITY.md">Security Policy</a> &bull;
  <a href="SUPPORT.md">Support</a> &bull;
  <a href="LICENSE">License</a>
</p>

---

## Phase 1: Core Filtering Foundations (v1.0 - v4.0)

- [x] Basic text-matching regex filters for campus and batch classification.
- [x] Notice Protector: Safeguards for general notices, rescheduled lab announcements, and critical alerts.
- [x] Centralized configuration architecture and fallback regex rules.

---

## Phase 2: User Experience and Customization (v5.0 - v6.0)

- [x] Floating settings trigger button anchored directly inside Moodle course pages.
- [x] Interactive configuration modal (Campus selection, Weekday/Weekend classification, Group ID).
- [x] Persistent local configuration storage via userscript APIs (`GM_setValue`, `GM_getValue`).
- [x] Custom Whitelist and Blacklist keywords for granular student control.

---

## Phase 3: Modern Architecture and Observer Engine (v6.12 - v7.0)

- [x] Dynamic DOM Observer: High-performance `MutationObserver` with `requestAnimationFrame` debouncing to support Moodle AJAX updates.
- [x] Ghost Mode (Peek Mode): Option to dim unassigned modules (25% opacity, grayscale) rather than hiding them completely.
- [x] Double-Lock Defense: Initialization gate ensuring no accidental filtering occurs before first-time setup is confirmed.
- [x] Partner Program Isolation: Distinguishes international degree streams (such as Deakin and Curtin) from local batches.
- [x] Remote Community Rules: Periodic background syncing of `rules.json` from GitHub via `chrome.alarms`.

---

## Phase 4: Multi-Store Extension Deployment (v7.1.0)

- [x] Standalone Manifest V3 extension architecture for Chromium and Gecko engines.
- [x] Dynamic Dark Theme: Integrated Dark Reader engine across all Courseweb routes (`/my/`, `/my/courses.php`, `/course/view.php`).
- [x] Modern Toolbar Action Popup: Quick-access popup in browser toolbar with live cross-tab profile syncing.
- [x] Official Store Publishing:
  - Chrome Web Store
  - Microsoft Edge Add-ons
  - Mozilla Firefox Add-ons (AMO)
- [x] Automated multi-store packaging pipeline (`build.sh` & GitHub Actions).
- [x] Launch of official website at `sliit-courseweb-cleaner-web.pages.dev`.

---

## Phase 5: UI Refinement and Anti-Flash Engine (v7.2.0)

- [x] Zero-Latency Anti-Flash Preloader: Content scripts running at `document_start` with synchronous `localStorage` theme state caching (`setAntiFlashTheme`).
- [x] High-Contrast Notice Highlights: Custom color styling for yellow alert containers ensuring readability under dark theme.
- [x] Side-Panel Drawer UI: Smooth right-aligned slide-in drawer with backdrop controls.
- [x] Ergonomic Trigger Placement: Re-anchored floating trigger button to `bottom: 60px; right: 0`, preventing collision with Moodle's block drawer.
- [x] CourseWeb Logo Screen Blending: Clean logo inversion with `mix-blend-mode: screen`.
- [x] CSP Compliance: DarkReader inline proxy script guard for Content Security Policy conformance.

---

## Phase 6: Granular Controls and Section Scoping (v7.3.0)

- [x] Hide Submissions Toggle: 1-click toggle to temporarily suppress assignment submission dropboxes while keeping lecture notes and marking rubrics visible.
- [x] Live Filter Counter Badge: Real-time counter badge on floating trigger and live status banner inside side panel with Peek Hidden button.
- [x] Section-Scoped Filtering Engine: Isolates section context strictly within `.section` containers, preventing cross-section state bleeding for regional campuses.
- [x] Canonical Campus Alias Dictionary: Resolves regional spelling variants (`Mathara`, `Kurunegale`, `Northern Uni`, `Colombo`) to canonical campus profiles.
- [x] Multi-Batch and Universal Group Code Parser: Parses compound batch ranges (`Batch 1 and 2`, `Batch 02 + Weekend Batch`) and universal group codes (`Y1`-`Y4`, `S1`-`S2`).

---

## Phase 7: Ecosystem and Future Roadmap (Planned)

### v7.4.0 (Upcoming)
- [ ] One-Click Pattern Reporter: In-modal quick button allowing students to submit newly changed Moodle module titles directly to GitHub Issues for fast community rule updates.
- [ ] Regional Campus Presets: Faculty-specific keyword presets for Metro, Kandy, Kurunegala, Matara, and Jaffna centers.
- [ ] Mobile Browser Optimization: Enhanced UI testing for Firefox Android and Kiwi Browser users on mobile devices.

### v8.0.0 (Long-Term Vision)
- [ ] SLIIT Courseweb MCP Integration: Bridge between browser extension and [SLIIT Courseweb MCP Server](https://github.com/kesaruhasun/mcp-sliit-courseweb), enabling LLMs and agentic workflows to consume cleaned course structures.
- [ ] Assignment Deadline Tracker: Visual badge on module cards highlighting upcoming submission deadlines.
- [ ] Exam and Quiz Alert Highlights: Highlighting active quiz links and exam time slots matching the user's specific group ID.
