# Mozilla Firefox Add-ons (AMO) Metadata & Reviewer Guide

This document contains all metadata, store copy, and reviewer information required for the **Mozilla Add-ons (AMO)** submission dashboard.

---

## 1. AMO Listing Details

### Add-on Name
```text
SLIIT Courseweb Cleaner
```

### Summary (Max 250 characters)
```text
Filters irrelevant campus and batch modules and introduces an eye-friendly, high-contrast dark theme on the SLIIT Courseweb (Moodle) portal.
```
*(Character count: 140 / 250)*

### Categories
- **Primary:** `Appearance`
- **Secondary:** `Tabs & Navigation`

### Tags / Keywords
`sliit`, `courseweb`, `moodle`, `dark-theme`, `filter`, `dark-reader`

### Full Description
```text
Tired of scrolling through endless modules, assignments, and announcements meant for other campuses or batches on SLIIT Courseweb? 

The SLIIT Courseweb Cleaner automatically filters out the clutter, providing a clean, personalized, and distraction-free dashboard tailored specifically to your campus and batch.

🚀 KEY FEATURES (v7.1.0):

• Smart Auto-Detect & Filtering:
Instantly filters course content to match your campus (Malabe, Metro, Kandy, Kurunegala, Matara, Jaffna) and your batch (Weekday or Weekend).

• Dynamic Dark Theme:
Integrated with the open-source Dark Reader engine to provide an eye-friendly, high-contrast dark mode across all Courseweb pages (dashboard /my/, course overview, module views, and activities).

• Modern Toolbar Action Popup:
Quickly toggle dark mode, switch campus/batch profiles, adjust Ghost Mode, or open the in-page modal directly from your browser toolbar.

• Ghost Mode (Peek Mode):
Prefer not to completely hide modules? Ghost Mode fades unassigned modules to 25% opacity so you can still review them at a glance.

• Partner Program Isolation:
Automatically isolates international degree streams (such as Deakin or Curtin) from local batch dashboards.

• Custom Whitelist & Blacklist:
Take total control. Hide outdated syllabus items or pin critical assignments using simple comma-separated keywords.

• Community-Driven Rule Updates:
The extension periodically fetches updated campus and batch regex patterns in the background, keeping the cleaner accurate whenever SLIIT updates their naming formats.

• Notice & Form Protection:
Critical notices, rescheduled lab alerts, category dropdowns, and Moodle submission forms are strictly protected and never hidden.

🔒 PRIVACY FIRST:
• 100% Client-Side Processing: All filtering logic runs entirely inside your browser.
• Zero Tracking & Zero Analytics: We do not collect, store, or transmit your personal data, credentials, or browsing history.
• No External Data Sharing: The only outbound request is an anonymous GET request to fetch the open-source rules.json file from our public GitHub repository.

🌐 OPEN SOURCE & COMMUNITY:
• Official Website: https://sliit-courseweb-cleaner-web.pages.dev/
• GitHub Repository: https://github.com/dulithdivisekara/sliit-courseweb-cleaner
• SLIIT Courseweb MCP Server: https://github.com/kesaruhasun/mcp-sliit-courseweb
• Developer Support: https://t.me/dulithdivisekara
```

---

## 2. Information for Reviewers (AMO Review Notes)

*Paste this into the **Information for Reviewers** box on AMO:*

```text
SLIIT Courseweb Cleaner is an open-source productivity extension designed for students at Sri Lanka Institute of Information Technology (SLIIT) on their Moodle platform (courseweb.sliit.lk).

1. Third-Party Libraries:
   • src/darkreader.js / extension/darkreader.js is the official standalone bundle of Dark Reader (v4.9.133), licensed under MIT from https://github.com/darkreader/darkreader.

2. Source Code & Build Process:
   • Source repository: https://github.com/dulithdivisekara/sliit-courseweb-cleaner
   • To build the exact Firefox package from source:
     $ ./build.sh
     This script assembles the Firefox package at dist/sliit-courseweb-cleaner-firefox.zip using extension/manifest.firefox.json.

3. Testing Instructions:
   • Click the extension icon in the Firefox toolbar to open the popup.
   • Verify toggling Dark Mode enables/disables high-contrast dark theme.
   • Change campus and batch selections; changes persist in browser.storage.sync.
   • When opening a SLIIT Courseweb course page (https://courseweb.sliit.lk/course/view.php), modules and activities are dynamically filtered or faded according to the selected preferences.
   • No personal data, credentials, or browsing activity is collected or transmitted.
```

---

## 3. Package to Upload
- Use: `dist/sliit-courseweb-cleaner-firefox.zip`
- Built using: `extension/manifest.firefox.json` with Firefox MV3 gecko ID (`courseweb-cleaner@dulithdivisekara.github.io`)
