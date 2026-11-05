<p align="center">
  <a href="https://sliit-courseweb-cleaner-web.pages.dev/" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/dulithdivisekara/sliit-courseweb-cleaner/main/assets/logo.png" width="96" alt="SLIIT Courseweb Module Cleaner Logo" />
  </a>
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/sliit-courseweb-cleaner/lnoadlfhebmkhmbfmehdgoffjllgadjm"><img src="https://img.shields.io/chrome-web-store/v/lnoadlfhebmkhmbfmehdgoffjllgadjm?style=flat-square&color=0f3b5f&label=Chrome%20Web%20Store" alt="Chrome Web Store"></a>
  <a href="https://microsoftedge.microsoft.com/addons/detail/sliit-courseweb-cleaner/gmlodfhgiopjgamoijjffcmgfenkkkhe"><img src="https://img.shields.io/badge/Edge%20Add--ons-v7.3.0-0078d7?style=flat-square" alt="Edge Add-ons"></a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/sliit-courseweb-cleaner/"><img src="https://img.shields.io/amo/v/sliit-courseweb-cleaner?style=flat-square&color=ff7139&label=Firefox%20Add-ons" alt="Firefox Add-ons"></a>
  <a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner/raw/refs/heads/main/dist/sliit-courseweb-cleaner.user.js"><img src="https://img.shields.io/badge/Userscript-v7.3.0-2c3e50?style=flat-square" alt="Userscript"></a>
  <a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"></a>
</p>

**SLIIT Courseweb Module Cleaner** is a context-aware browser extension and userscript engineered to eliminate visual noise across the SLIIT Moodle learning management system (`courseweb.sliit.lk`). It combines a deterministic 6-stage campus, batch, and faculty sub-group filtering engine with a zero-flash dark theme preloader, real-time filter inspection controls, and automated background rule synchronization.

<p align="center">
  <img src="https://raw.githubusercontent.com/dulithdivisekara/sliit-courseweb-cleaner/main/assets/sliit-courseweb-cleaner-social-preview.png" width="100%" alt="SLIIT Courseweb Module Cleaner Overview" style="border-radius: 8px; margin: 12px 0;" />
</p>

---

## Official Store Distribution

Install verified, signed packages directly from your browser's official extension repository:

<p align="center">
  <a href="https://chromewebstore.google.com/detail/sliit-courseweb-cleaner/lnoadlfhebmkhmbfmehdgoffjllgadjm" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/dulithdivisekara/sliit-courseweb-cleaner/main/assets/badge-chrome.png" height="50" alt="Available in the Chrome Web Store" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://microsoftedge.microsoft.com/addons/detail/sliit-courseweb-cleaner/gmlodfhgiopjgamoijjffcmgfenkkkhe" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/dulithdivisekara/sliit-courseweb-cleaner/main/assets/badge-edge.png" height="50" alt="Get it from Microsoft Edge" />
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://addons.mozilla.org/en-US/firefox/addon/sliit-courseweb-cleaner/" target="_blank" rel="noopener noreferrer">
    <img src="https://raw.githubusercontent.com/dulithdivisekara/sliit-courseweb-cleaner/main/assets/badge-firefox.png" height="50" alt="Get the Add-on for Firefox" />
  </a>
</p>

---

## Documentation Navigator

| Wiki Page | Technical Scope | Target Audience |
| :--- | :--- | :--- |
| **[[Getting Started|Getting-Started]]** | Browser compatibility matrix, 1-click store installation, userscript deployment, and first-run onboarding workflow. | All students and new users |
| **[[User Guide and Configuration|User-Guide-and-Configuration]]** | Complete guide to the Slide-In Side Panel, Toolbar Popup, Campus/Batch/Group formats, Ghost Mode, Hide Submissions, and Peek Hidden. | Students configuring profiles |
| **[[Heuristic Filtering Engine|Heuristic-Filtering-Engine]]** | Deep architectural breakdown of the 6-stage DOM evaluation pipeline, regex parsers, campus alias normalization, and faculty group rules. | Contributors and power users |
| **[[Architecture and Dark Theme|Architecture-and-Dark-Theme]]** | Multi-target build pipeline, zero-flash `0ms` Dark Reader preloader, Moodle Lambda2/Boost skeleton suppression, and storage sync. | Extension developers |
| **[[Community Rules and Development|Community-Rules-and-Development]]** | Remote `rules.json` schema, 24-hour background sync lifecycle, local build compilation (`build.sh`), and automated test suites. | Open-source maintainers |
| **[[Troubleshooting and FAQ|Troubleshooting-and-FAQ]]** | Diagnostic decision tree, solutions for missing regional activities, userscript permissions, Service Worker inspection, and FAQs. | Users resolving edge cases |

---

## System Overview

SLIIT Courseweb course pages aggregate hundreds of activity blocks, submission dropboxes, Teams/Zoom meeting links, and notices across 8 campus centers and multiple academic schedules into a single scrolling feed. SLIIT Courseweb Module Cleaner intercepts and evaluates the DOM in real time:

```mermaid
graph LR
    A[Courseweb DOM & AJAX Tiles] --> B[Zero-Latency Config Cache]
    B --> C[6-Stage Heuristic Engine]
    C --> D[Universal Resource & Notice Guard]
    C --> E[Campus, Batch & Sub-Group Filter]
    E --> F[DOM Suppression / Ghost Mode]
    E --> G[Live Filter Counter & Peek Mode]
    B --> H[0ms Anti-Flash Dark Theme]
```

### Key Technical Capabilities

- **Multi-Campus & Partner Isolation**: Native support for **Malabe**, **Metro (Colombo)**, **Kandy**, **Kurunegala**, **Matara**, **Jaffna / Northern Uni**, **Curtin University**, and **Deakin University**, complete with automatic typo and alias resolution (`Mathara`, `Kurunegale`, `Northern Uni`, `NU`, `Colombo`).
- **Cross-Faculty Cohort Precision**: Engineered and verified across 34 live Courseweb modules spanning the **Faculty of Computing** (`IT`, `SE`, `CS`, `DS`, `CSNE`, `ISE`, `IM`, `CY`), **SLIIT Business School** (`BM1011`-`BM1046` compound `Batch 02 Group 04` formats), and **Faculty of Engineering** (`EN`).
- **Universal Notice & Core Material Protection**: Automatically preserves exam announcements, reschedule alerts, module outlines, lecture slides, tutorial sheets, and marking rubrics while stripping Moodle 4.5 screen-reader prefixes (`Select activity Notice`) to prevent false-positive leaks.
- **Zero-Flash Dark Theme Engine**: Synchronously caches theme state in `localStorage` at `document_start` (`0ms`), suppressing Moodle skeleton placeholders and white icon flashes before the first browser paint.
- **Interactive Filter Auditing**: Provides a live filtered-item counter badge, a 1-click **Peek Hidden** inspection mode (outlining hidden activities in dashed gold), **Ghost Mode** (`opacity: 0.25`), and a **Hide Submissions** toggle.

---

## Supported Faculties & Academic Programs

| Faculty / Program | Supported Course Formats | Supported Group & Batch Naming Conventions |
| :--- | :--- | :--- |
| **Faculty of Computing** | `format_topics`, `format_tiles`, `format_weeks` | `Batch 1`, `01.02`, `2.2`, `Y2.S1.WD.IT.01.02`, `SE`, `CS`, `DS`, `CY` |
| **SLIIT Business School** | `format_topics`, `format_tiles` | `Batch 01`, `Batch 02 Group 04`, `B2 G3`, `Monday Batch_`, `Weekend Batch` |
| **Regional Centers (Kandy, Matara, Kurunegala, Northern Uni, Metro)** | All Moodle 4.x layouts | Center-tagged sections, weekday-only center cohorts, `NU Group 1`, `Kandy Center` |
| **International Partner Programs** | `format_topics`, `format_tiles` | `Curtin`, `Deakin` program streams and isolated partner resources |

---

## Related Ecosystem Projects

- **[Main Source Repository](https://github.com/dulithdivisekara/sliit-courseweb-cleaner)**: Canonical codebase, issue tracker, and release artifacts.
- **[Official Web Portal](https://sliit-courseweb-cleaner-web.pages.dev/)**: Landing page and interactive installation guide.
- **[SLIIT Courseweb MCP Server](https://github.com/kesaruhasun/mcp-sliit-courseweb)**: Model Context Protocol server enabling AI coding assistants (Google Antigravity, Claude Code, Cursor) to query Courseweb modules, deadlines, and lecture materials directly.
