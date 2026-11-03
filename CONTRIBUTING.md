# Contributing to SLIIT Courseweb Cleaner

Thank you for your interest in contributing to SLIIT Courseweb Cleaner. This project is an open-source, student-maintained utility released under the MIT License. Contributions from all SLIIT campuses (Malabe, Metro, Kandy, Kurunegala, Matara, Jaffna) and partner academic programs (Curtin, Deakin) are encouraged.

This document outlines the architecture, development workflow, coding standards, and submission guidelines required to maintain high engineering quality across all supported browsers and runtimes.

<p align="center">
  <a href="#core-engineering-principles">Principles</a> &bull;
  <a href="#how-you-can-contribute">Contribution Areas</a> &bull;
  <a href="#local-development-setup">Environment Setup</a> &bull;
  <a href="#project-architecture">Architecture</a> &bull;
  <a href="#build-pipeline">Build Pipeline</a> &bull;
  <a href="#updating-filtering-rules">Rule Contributions</a> &bull;
  <a href="#coding-standards">Coding Standards</a> &bull;
  <a href="#git-workflow--commits">Git & Commits</a> &bull;
  <a href="#pull-request-protocol">Pull Requests</a> &bull;
  <a href="#security-disclosures">Security</a> &bull;
  <a href="#contributors">Contributors</a>
</p>

---

## Core Engineering Principles

All contributions must adhere to the following core tenets:

1. **Privacy-First and Zero Telemetry**:
   The extension operates strictly on the client side. We do not collect, store, or transmit student identifiers, session tokens, academic results, or browsing habits. The only permitted network request is an anonymous GET request to fetch updated filtering heuristics (`rules.json`) from GitHub.

2. **Non-Destructive DOM Filtering**:
   Never remove DOM nodes permanently from the document tree. Use style-based suppression (`display: none`) or Ghost Mode muting (`opacity: 0.25`). The system incorporates a Double-Lock Defense check to ensure no content is hidden until the student has explicitly configured and applied their academic profile.

3. **Protection of Critical CourseWeb Elements**:
   Never hide elements matching protected keywords (`notice`, `rescheduled`, `announcement`, `general`, `exam`) or functional Moodle UI controls (`.groupselector`, `.singleselect`, navigation drawers, breadcrumbs, search inputs, and submission buttons).

4. **Strict CSP and Script Compliance**:
   CourseWeb implements Content Security Policies (CSP). Never introduce `eval()`, `new Function()`, inline `<script>` tags, or remote code execution. All bundled dependencies (such as Dark Reader) must run locally without dynamic script evaluation.

---

## How You Can Contribute

Contributions fall into several distinct areas:

| Area | Scope | Key Files |
| :--- | :--- | :--- |
| **Filtering Rules** | Adding new campus identifiers, batch formats, or protected tokens. | `rules.json` |
| **Core Filtering Engine** | Modifying regex matching, DOM traversal, or Double-Lock defense. | `src/shared-core.js` |
| **Extension Runtime** | Enhancing background service workers, alarms, or storage sync. | `src/extension-main.js`, `extension/service-worker.js` |
| **Userscript Runtime** | Tampermonkey/Violentmonkey compatibility, GM_* storage mappings. | `src/userscript-main.js` |
| **UI & Ergonomics** | Refined CSS styling, side-panel drawer interactions, accessibility. | `src/shared-styles.css`, `src/popup.*` |
| **Dark Theme Tuning** | Contrast improvements for notices, tables, or specialized Moodle blocks. | `src/shared-styles.css`, `src/darkreader.js` |
| **Documentation** | Installation guides, store copy, developer specifications. | `README.md`, `CONTRIBUTING.md`, `site/` |

---

## Local Development Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher.
- **npm**: Version 9.0.0 or higher.
- **Git**: Modern Git client.
- **Bash / POSIX Shell**: Required for executing `./build.sh` (Linux, macOS, WSL on Windows).
- **Web Browser**: Google Chrome, Microsoft Edge, Brave, or Mozilla Firefox.

### 1. Clone the Repository

```bash
git clone https://github.com/dulithdivisekara/sliit-courseweb-cleaner.git
cd sliit-courseweb-cleaner
```

### 2. Install Development Dependencies

The repository has zero production dependencies. Dev dependencies are utilized exclusively for linting, syntax checking, and local testing:

```bash
npm install
```

### 3. Load the Unpacked Extension in Your Browser

#### Chromium (Google Chrome, Microsoft Edge, Brave, Opera)
1. Open your browser and navigate to `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode** using the toggle in the upper right corner.
3. Click **Load unpacked**.
4. Select the `extension/` directory from this repository.
5. Navigate to [SLIIT Courseweb](https://courseweb.sliit.lk/) to test your modifications.

#### Mozilla Firefox
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select `extension/manifest.firefox.json` from this repository.
4. Open [SLIIT Courseweb](https://courseweb.sliit.lk/) to test your changes.

#### Userscript Testing (Tampermonkey / Violentmonkey)
1. Ensure developer mode and local file access are enabled in your userscript manager.
2. Install the compiled script from `dist/sliit-courseweb-cleaner.user.js` or copy the contents of `dist/` directly into a new userscript editor.
3. Consult [USERSCRIPT_INSTALL.md](USERSCRIPT_INSTALL.md) for detailed browser settings.

---

## Project Architecture

The monorepo uses a shared-source architecture to target Chromium extensions (MV3), Firefox extensions (MV3), and Userscript managers from a single canonical source tree.

```text
.
├── src/                                  # Canonical source code (Edit here)
│   ├── shared-core.js                    # Core filtering heuristics and regex logic
│   ├── shared-styles.css                 # Content script styles, side-panel drawer, and themes
│   ├── extension-main.js                 # Browser extension content script entry point
│   ├── userscript-main.js                # Userscript wrapper and initialization
│   ├── popup.html / popup.js / popup.css # Extension toolbar action popup
│   └── darkreader.js                     # Standalone Dark Reader engine
├── extension/                            # Staging directory for browser extensions
│   ├── manifest.json                     # Chromium Manifest V3 definition
│   ├── manifest.firefox.json             # Firefox WebExtension definition
│   ├── service-worker.js                 # Background worker with 24-hour sync alarm
│   └── [compiled assets]                 # Mirrored from src/ during build
├── dist/                                 # Production packages generated by build.sh
│   ├── sliit-courseweb-cleaner-extension.zip # Chrome and Edge package
│   ├── sliit-courseweb-cleaner-firefox.zip   # Firefox AMO package
│   └── sliit-courseweb-cleaner.user.js       # Assembled Tampermonkey userscript
├── assets/                               # Logos, store badges, and documentation assets
├── site/                                 # Public landing page and privacy policy
├── rules.json                            # Remote filtering heuristics and pattern dictionary
├── build.sh                              # Monorepo build and packaging script
└── package.json                          # Scripts and syntax checking configurations
```

> [!IMPORTANT]
> Always make your code modifications inside the `src/` directory. Files in `extension/` (such as `styles.css` and `shared-core.js`) and `dist/` are generated artifacts overwritten whenever `./build.sh` is executed.

---

## Build Pipeline

The project includes an automated build pipeline defined in `build.sh`.

Run the build script after making changes in `src/`:

```bash
chmod +x build.sh
./build.sh
```

### Build Execution Phases

1. **Phase 1: Compile Tampermonkey Userscript**
   Concatenates `src/userscript-main.js` with `src/shared-core.js` into `dist/sliit-courseweb-cleaner.user.js`.
2. **Phase 2: Synchronize Browser Extension Workspace**
   Copies canonical source files from `src/` into the `extension/` directory with proper target filenames.
3. **Phase 3: Package Chromium Archive**
   Packages `extension/` into `dist/sliit-courseweb-cleaner-extension.zip` while excluding Firefox-specific manifests.
4. **Phase 4: Package Firefox AMO Archive**
   Stages an isolated Firefox build directory, swaps `manifest.firefox.json` into `manifest.json`, and generates `dist/sliit-courseweb-cleaner-firefox.zip`.

---

## Updating Filtering Rules

If your campus center, academic cohort, or semester introduces new naming conventions on Courseweb, you can contribute updates to `rules.json` without modifying core extension logic.

### Structure of `rules.json`

```json
{
  "version": 2,
  "lastUpdated": "2026-11-03",
  "campuses": [
    "malabe",
    "kandy",
    "kurunegala",
    "metro",
    "matara",
    "jaffna",
    "deakin",
    "curtin"
  ],
  "batchPatterns": {
    "weekday": ["wd", "weekday"],
    "weekend": ["we", "weekend"]
  },
  "ignoreKeywords": [
    "notice",
    "rescheduled",
    "announcement",
    "general"
  ],
  "malabeBlockRegexes": [
    "\\\\bbatch\\\\s*\\\\d+\\\\b",
    "\\\\by2s1\\\\.b\\\\d+",
    "\\\\by2s1\\\\.lab_\\\\w+"
  ]
}
```

### Rule Contribution Standards

1. **Lowercase Keys**: All keywords in `campuses` and `batchPatterns` must be lowercase. The matching engine automatically converts DOM text to lowercase before evaluation.
2. **Double-Escaped Regex**: Regex pattern strings within `rules.json` must be double-escaped (e.g., `\\\\b` instead of `\\b`) to ensure valid JSON parsing.
3. **Avoid Overly Broad Patterns**: Do not add short, generic substrings (e.g., `it`, `se`, `cs`) that could match legitimate course titles and cause false positives.
4. **Test Before Committing**: Validate your regex against actual course titles in browser developer tools:
   ```javascript
   const regex = new RegExp("\\bbatch\\s*\\d+\\b", "i");
   console.log(regex.test("Lab 02 Submission - Malabe Weekday Batch 03")); // true
   ```

---

## Coding Standards

### JavaScript Style

- Use clean, modern vanilla JavaScript (ES6+).
- Do not add external runtime libraries or frameworks.
- Preserve existing comments and docstrings.
- Use explicit naming for functions and variables (`isProtectedActivity`, `evaluateVisibility`).
- Avoid global variable pollution. Encapsulate functionality inside scopes or modules.
- Ensure all loops and DOM observers prevent layout thrashing and handle dynamic Moodle mutations cleanly.

### CSS and Design

- Content script styles must be prefixed (e.g., `sf-side-panel`, `sf-config-trigger`, `sf-drawer`) to prevent collision with Moodle native stylesheets or third-party themes.
- Ensure high contrast in both light and dark themes. Verify text contrast against WCAG AA standards (minimum 4.5:1 for normal text).
- Responsive: The slide-in drawer must adapt gracefully to mobile and tablet screen widths (max width `360px`, full width on mobile viewports under `480px`).

### Syntax Validation

Before committing, run the automated syntax check:

```bash
npm test
```

This validates all JavaScript files (`src/shared-core.js`, `src/extension-main.js`, `src/userscript-main.js`, `src/popup.js`, `extension/service-worker.js`, and `dist/sliit-courseweb-cleaner.user.js`) using Node's internal syntax checker.

---

## Git Workflow & Commits

### Branch Naming Conventions

Create a topic branch from `main`:

```bash
git checkout -b <type>/<description>
```

Examples:
- `feature/side-panel-keyboard-shortcuts`
- `fix/metro-batch-regex`
- `rules/kandy-semester-patterns`
- `docs/update-firefox-guide`

### Conventional Commits

We follow the Conventional Commits specification. Prefix your commit messages with an appropriate type:

| Type | Purpose | Example |
| :--- | :--- | :--- |
| `feat` | New functionality or user-facing feature | `feat: add keyboard shortcut to toggle side panel drawer` |
| `fix` | Bug fix or false-positive regex correction | `fix: prevent hiding course announcements containing date tokens` |
| `rules` | Changes to `rules.json` heuristics | `rules: add northern campus alias and semester 2 batch patterns` |
| `style` | CSS modifications, theme tuning, or visual adjustments | `style: improve yellow notice banner contrast in dark mode` |
| `refactor` | Code restructuring without behavioral change | `refactor: extract DOM traversal helper in shared-core` |
| `test` | Adding or updating syntax and test suites | `test: add validation check for rules.json schema` |
| `docs` | Documentation, guides, or store submission updates | `docs: expand contributing guide with architecture details` |
| `chore` | Maintenance tasks or build pipeline adjustments | `chore: update build script temporary directory handling` |

---

## Pull Request Protocol

Before submitting a Pull Request, verify the following checklist:

- [ ] All code modifications were made inside `src/` (not directly in `extension/` or `dist/`).
- [ ] `./build.sh` was executed to synchronize extension files and recompile distribution packages.
- [ ] `npm test` passes without errors.
- [ ] The change was manually tested on [SLIIT Courseweb](https://courseweb.sliit.lk/) in at least one browser.
- [ ] No personal student information (PII), student IDs, real names, or session tokens are present in committed code, screenshots, or logs.
- [ ] The branch is rebased onto the latest `main` branch.

### Submitting the Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin <type>/<description>
   ```
2. Open a Pull Request against `dulithdivisekara/sliit-courseweb-cleaner` on the `main` branch.
3. In your PR description:
   - Provide a clear summary of the changes and motivation.
   - Reference any related issues (e.g., `Closes #4` or `Fixes #2`).
   - Include before-and-after screenshots or DOM snippets if visual changes were made.

---

## Security Disclosures

If you discover a security vulnerability or potential privacy leak:

- **Do NOT open a public GitHub issue.**
- Disclose the issue responsibly by contacting the project maintainer directly via email or Telegram (`@dulithdivisekara`).
- Provide detailed steps to reproduce the issue so a patch can be developed and deployed promptly.

---

## Contributors

Recognition and gratitude to the contributors who help build and maintain SLIIT Courseweb Cleaner:

- **Dulith Divisekara** ([@dulithdivisekara](https://github.com/dulithdivisekara)) - Project creator and maintainer.
- **Kavindu Udhara** ([@kavinduUdhara](https://github.com/kavinduUdhara)) - UI/UX improvements, anti-flash preloader, side-panel drawer, and notice contrast enhancements (#3).
- **Kesaru Hasun** ([@kesaruhasun](https://github.com/kesaruhasun)) - Creator of the SLIIT Courseweb Model Context Protocol (MCP) server integration.
