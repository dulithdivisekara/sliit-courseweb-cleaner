# Privacy Policy for SLIIT Courseweb Cleaner

**Last Updated:** 2026-08-18

The **SLIIT Courseweb Cleaner** browser extension is designed with a strict "Privacy First" methodology.

## 1. Information Collection And Use
We do not collect, transmit, distribute, or sell your data. The extension operates entirely within the confines of your local browser.

- **User Preferences:** Your selected campus, batch, and custom keywords are stored locally using Chrome's native `chrome.storage.sync` and `chrome.storage.local` APIs. This data may synchronize across your devices if you are signed into your Google account and have Chrome Sync enabled, but it is never transmitted to our servers or any third-party servers.

- **Courseweb Data:** The extension analyzes the text of the `courseweb.sliit.lk` webpage using local Javascript (`content_scripts`) strictly to determine which elements to hide or show. This text processing happens entirely on your device.

## 2. Remote Communication
The extension makes a single, periodic outbound network request (once every 24 hours) via the `chrome.alarms` API to fetch an open-source JSON file containing the latest community-contributed filtering rules from our public GitHub repository:
`https://raw.githubusercontent.com/dulithdivisekara/sliit-courseweb-cleaner/main/rules.json`

This request contains no identifiable information and is simply an anonymous HTTP GET request to download a static file.

## 3. Contact Us
If you have any questions or suggestions about this Privacy Policy, do not hesitate to contact the developer or open an issue on the [GitHub Repository](https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues).
