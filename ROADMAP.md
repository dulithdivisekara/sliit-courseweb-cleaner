# Project Roadmap: SLIIT Courseweb Cleaner

This document tracks completed milestones and outlines the planned features and long-term vision for the **SLIIT Courseweb Cleaner** ecosystem.

---

## ✅ Phase 1: Core Functionality (Completed - v1.0 to v4.0)
- [x] Basic text-matching regex filters for campus and batch classification.
- [x] Notice Protector: Safeguards for general notices, rescheduled lab announcements, and critical alerts.
- [x] Centralized configuration architecture and fallback regex rules.

---

## ✅ Phase 2: User Experience & Customization (Completed - v5.0 to v6.0)
- [x] Floating yellow settings trigger button anchored directly inside Moodle course pages.
- [x] Interactive configuration modal (Campus selection, Weekday/Weekend classification, Group ID).
- [x] Persistent local configuration storage via userscript APIs (`GM_setValue`, `GM_getValue`).
- [x] Custom Whitelist and Blacklist keywords for granular student control.

---

## ✅ Phase 3: Modern Architecture & Observer Engine (Completed - v6.12 to v7.0)
- [x] **Dynamic DOM Observer:** Upgraded to high-performance `MutationObserver` with `requestAnimationFrame` debouncing to seamlessly support Moodle AJAX updates.
- [x] **Ghost Mode ("Peek" Mode):** Allows students to dim unassigned modules (25% opacity, grayscale) rather than hiding them completely.
- [x] **Double-Lock Defense:** Strict initialization gate ensuring no accidental filtering occurs before first-time setup is confirmed.
- [x] **Partner Program Isolation:** Distinguishes international degree streams (such as Deakin and Curtin) from local batches.
- [x] **Remote Community Rules:** Periodic background syncing of `rules.json` from GitHub via `chrome.alarms`.

---

## ✅ Phase 4: Multi-Store Extension Deployment (Completed - v7.1.0)
- [x] Standalone Manifest V3 extension architecture for Chromium and Gecko engines.
- [x] **Dynamic Dark Theme:** Integrated with open-source Dark Reader engine across all Courseweb routes (`/my/`, `/my/courses.php`, `/course/view.php`).
- [x] **Modern Toolbar Action Popup:** Quick-access popup in browser toolbar with live cross-tab profile syncing and "Apply Setup" feedback.
- [x] **Official Store Publishing:**
  - [Chrome Web Store](https://chromewebstore.google.com/detail/sliit-courseweb-cleaner/lnoadlfhebmkhmbfmehdgoffjllgadjm)
  - [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/sliit-courseweb-cleaner/gmlodfhgiopjgamoijjffcmgfenkkkhe)
  - [Mozilla Firefox Add-ons (AMO)](https://addons.mozilla.org/en-US/firefox/addon/sliit-courseweb-cleaner/)
- [x] Dedicated CI/CD automated multi-store packaging pipeline (`build.sh` & GitHub Actions).
- [x] Launch of official website at [sliit-courseweb-cleaner-web.pages.dev](https://sliit-courseweb-cleaner-web.pages.dev/).

---

## ✅ Phase 5: UI/UX Refinement & Anti-Flash Engine (Completed - v7.2.0)
- [x] **Zero-Latency Anti-Flash Preloader:** Upgraded content scripts to run at `document_start` with synchronous `localStorage` theme state caching, eradicating white flashes on navigation (closes #2).
- [x] **High-Contrast Notice Highlights:** Custom color styling for yellow alert containers ensuring red text and critical notices maintain crisp contrast in dark mode.
- [x] **Side-Panel Drawer UI:** Re-architected in-page modal into a smooth right-aligned slide-in drawer with backdrop controls.
- [x] **Ergonomic Trigger Placement:** Re-anchored floating trigger button to bottom-right (`bottom: 60px; right: 0`), preventing overlap with CourseWeb's block drawer.
- [x] **CourseWeb Logo Screen Blending:** Clean logo inversion with `mix-blend-mode: screen` under dark theme.
- [x] **CSP Compliance:** DarkReader inline proxy script guard to adhere to CourseWeb Content Security Policy.

---

## 🚀 Phase 6: Ecosystem & Future Enhancements (Planned)

### v7.2.0 (Upcoming)
- [ ] **One-Click Pattern Reporter:** In-modal quick button allowing students to submit newly changed Moodle module titles directly to GitHub Issues for fast community rule updates.
- [ ] **Regional Campus Presets:** Faculty-specific keyword presets for Metro, Kandy, Kurunegala, Matara, and Jaffna centers.
- [ ] **Mobile Browser Optimization:** Polished UI testing for Firefox Android and Kiwi Browser users on mobile devices.

### v8.0.0 (Long-Term Vision)
- [ ] **SLIIT Courseweb MCP Integration:** Deep-link bridge between the browser extension and the [SLIIT Courseweb MCP Server](https://github.com/kesaruhasun/mcp-sliit-courseweb), allowing AI assistants to read cleaned course contexts.
- [ ] **Assignment Deadline Tracker:** Visual badge on module cards highlighting upcoming submission deadlines.
- [ ] **Exam & Quiz Alert Highlights:** Highlighting active quiz links and exam time slots matching the user's specific group ID.