# Chrome Web Store Metadata & Submission Guide: SLIIT Courseweb Cleaner

This document contains all metadata, store copy, privacy answers, and permission justifications required for the **Chrome Web Store Developer Dashboard**.

---

## 1. Store Listing Details

### Store Listing Name (Max 45 chars)
```text
SLIIT Courseweb Cleaner
```

### Summary / Short Description (Max 132 chars)
```text
Instantly hides irrelevant campus and batch modules from SLIIT Courseweb, keeping your dashboard clean and focused.
```
*(Character count: 114 / 132)*

### Detailed Description (Plain-text formatted for Chrome Web Store)
*Note: The Chrome Web Store dashboard does NOT parse Markdown. Use the plain-text formatted copy below with clean bullet points and section headers:*

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
Configure your preferences once, and they will automatically sync across all your signed-in Chrome devices via Chrome Sync.

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

## 2. Categorization & Media

| Field | Value |
| :--- | :--- |
| **Primary Category** | `Productivity` (or `Accessibility`) |
| **Language** | `English (United States)` |
| **Official Website URL** | `https://sliit-courseweb-cleaner-web.pages.dev/` |
| **Support URL** | `https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues` |

---

## 3. Privacy & Data Collection Declaration

### Single Purpose Description
```text
To enhance the learning experience of SLIIT students by automatically filtering irrelevant campus and batch modules on the Courseweb (Moodle) portal and providing an eye-friendly dark theme.
```

### Remote Code Declaration
- **Does your extension use remote code?**
  **NO.** 
  *Justification:* The extension does not download, evaluate, or execute any executable code at runtime. It only fetches a static JSON data file (`rules.json`) containing regex pattern strings and campus name arrays for local string matching.

### Data Collection Form
- **Does this extension collect or use your data?** `No`
- **Does this extension transmit user data off the device?** `No`
- **Are you using the extension for financial or healthcare purposes?** `No`

### Privacy Policy URL
```text
https://sliit-courseweb-cleaner-web.pages.dev/privacy-policy.html
```
*(Alternative GitHub Pages URL: `https://dulithdivisekara.github.io/sliit-courseweb-cleaner/privacy-policy.html`)*

---

## 4. Permissions Justification (Developer Dashboard)

Paste these exact justifications into the Chrome Developer Dashboard:

### 1. `storage`
> **Justification:** Required to store student preferences (selected campus, batch classification, group ID, custom keywords, ghost mode, and dark theme) locally and sync them across devices using `chrome.storage.sync`. It also caches the remote community filtering rules using `chrome.storage.local`.

### 2. `alarms`
> **Justification:** Required to schedule a lightweight, battery-efficient periodic task that fetches the latest community-contributed filtering rules (`rules.json`) from our public GitHub repository once every 24 hours.

### 3. `activeTab`
> **Justification:** Required when the user clicks the toolbar extension action button so the popup interface can verify whether the active tab is on SLIIT Courseweb, display live connection status, and send real-time filter adjustments to the active tab.

### 4. Host Permissions: `https://raw.githubusercontent.com/*`
> **Justification:** Required for the background service worker to perform an anonymous HTTP GET request to download the latest community-maintained module filtering patterns (`rules.json`) from the public GitHub repository.

### 5. Content Scripts Match: `*://courseweb.sliit.lk/*`
> **Justification:** Required to inject the client-side content script that applies the high-contrast dark theme and performs context-aware module hiding on SLIIT Courseweb course pages.
