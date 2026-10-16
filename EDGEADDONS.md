# Microsoft Edge Add-ons Metadata & Submission Guide

This document contains all metadata, store copy, certification notes, and configuration required for the **Microsoft Partner Center (Edge Add-ons)** dashboard.

---

## 1. Store Listing Details

### Extension Name (Max 50 chars)
```text
SLIIT Courseweb Cleaner
```

### Short Description / Summary (Strict Max 100 characters in Edge)
*Note: Microsoft Edge enforces a strict 100-character limit (unlike Chrome's 132 chars).*

```text
Filters irrelevant campus and batch modules and adds dark mode to SLIIT Courseweb.
```
*(Character count: 82 / 100)*

### Search Terms (Up to 3 keywords, max 30 chars each)
1. `SLIIT Courseweb`
2. `SLIIT Cleaner`
3. `Courseweb Dark Mode`

### Category
- **Primary Category:** `Productivity`
- **Secondary Category:** `Education`

### Detailed Description
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

• Cloud-Synced Settings:
Configure your preferences once, and they will automatically sync across all your signed-in Edge devices via Edge Sync.

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

## 2. Support & Privacy URLs

| Field | URL |
| :--- | :--- |
| **Privacy Policy URL** | `https://sliit-courseweb-cleaner-web.pages.dev/privacy-policy.html` |
| **Support Contact URL** | `https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues` |
| **Official Website URL** | `https://sliit-courseweb-cleaner-web.pages.dev/` |

---

## 3. Notes for Certification (Reviewer Notes)

*Paste this into the **Notes for certification** textarea in Partner Center to accelerate review:*

```text
SLIIT Courseweb Cleaner enhances the student learning portal at SLIIT (Sri Lanka Institute of Information Technology - courseweb.sliit.lk).

HOW TO TEST:
1. Install the extension.
2. Click the extension action icon in the Edge toolbar to open the popup.
3. In the popup, you can toggle Dark Theme, change Campus (e.g. Malabe, Metro, Kandy), switch Batch (Weekday/Weekend), and toggle Ghost Mode.
4. When visiting https://courseweb.sliit.lk/course/view.php?id=..., unassigned activities and notices for other campuses/batches are automatically filtered or dimmed based on the user's selected preferences.
5. The extension does not collect any user data. All configuration is stored locally via chrome.storage.sync. The background service worker periodically fetches static regex rules from GitHub (rules.json) to stay up-to-date with course naming patterns.
```

---

## 4. Package to Upload
- Use: `dist/sliit-courseweb-cleaner-extension.zip`
- Built from: `extension/` directory (Standard MV3 package)
