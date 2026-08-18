# Chrome Web Store Metadata: SLIIT Courseweb Cleaner

## 1. Product Details

**Store Listing Name:**
SLIIT Courseweb Cleaner

**Short Description:**
Instantly hides irrelevant campus and batch modules from SLIIT Courseweb, keeping your dashboard clean and focused.

**Detailed Description:**
Tired of scrolling through endless modules meant for other campuses or batches on SLIIT Courseweb? The **SLIIT Courseweb Cleaner** automatically filters out the noise, providing a clean, personalized dashboard tailored exactly to you.

**Key Features:**
- **Smart Auto-Detect:** Automatically guesses your campus and batch (Weekday/Weekend) to get you started instantly.
- **Custom Keywords (Whitelist & Blacklist):** Total control over what you see. Hide old syllabus materials or pin crucial assignments using custom comma-separated keywords.
- **Cloud-Synced Configuration:** Configure it once, and your preferences sync automatically across all your signed-in Chrome browsers.
- **Community-Driven Updates:** The extension periodically fetches community-sourced filtering rules in the background, ensuring it always stays up-to-date even when SLIIT changes their naming conventions.
- **Ghost Mode:** Optionally fade filtered modules instead of completely hiding them, ensuring you never accidentally miss anything.
- **Group ID Filtering:** Focus solely on your specific subgroup (e.g., 0301).

**Privacy First:**
No analytics, no tracking, and no external data sharing. The extension strictly operates on your local machine and only communicates with a public GitHub repository to fetch the latest open-source filtering rules.

## 2. Privacy & Data Collection
**Privacy Policy URL:**
`https://dulithdivisekara.github.io/sliit-courseweb-cleaner/privacy-policy.html`

**Data Collection Form:**
- **Does this extension collect or use your data?** No.
- **Are you using the extension for financial or healthcare purposes?** No.

## 3. Permissions Justification

The following permissions are required in `manifest.json`:

1. **`storage`**
   - **Reason:** Required to save user preferences (like Campus selection, Ghost Mode toggle, and Custom Keywords) and sync them across devices using `chrome.storage.sync`. It also caches the remote community filtering rules using `chrome.storage.local`.

2. **`alarms`**
   - **Reason:** Required to schedule a lightweight, battery-efficient background task that fetches the latest community-driven filtering rules from our public GitHub repository once every 24 hours.

**Host Permissions:**
1. **`*://courseweb.sliit.lk/course/view.php*`**
   - **Reason:** Required to inject the content script that visually hides the DOM elements representing irrelevant course modules on the specific SLIIT Courseweb portal.
