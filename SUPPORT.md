# Support Channels and Troubleshooting Guide

Welcome to the SLIIT Courseweb Cleaner support center. This guide provides an end-to-end troubleshooting manual, diagnostics playbook, and community support channels to help resolve issues quickly.

---

## Community Support Channels

Choose the appropriate channel based on your need:

| Channel | Best For | Link / Location |
| :--- | :--- | :--- |
| **GitHub Issues** | Defect reports, false-positive filter detections, and regression reports | [Open an Issue](https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues) |
| **GitHub Discussions** | Questions, configuration advice, feature suggestions, and general ideas | [Join Discussions](https://github.com/dulithdivisekara/sliit-courseweb-cleaner/discussions) |
| **GitHub Wiki** | Detailed guides on heuristics, dark theme architecture, and setup | [Project Wiki](https://github.com/dulithdivisekara/sliit-courseweb-cleaner/wiki) |
| **Telegram Community** | Real-time community discussion and direct maintainer contact | [@dulithdivisekara](https://t.me/dulithdivisekara) |
| **Security Reports** | Private vulnerability and privacy disclosures | `contact@dulith.me` (See [SECURITY.md](SECURITY.md)) |

---

## Pre-Flight Diagnostic Checklist

Before opening an issue, follow this 5-step triage checklist:

### 1. Verify Active Host URL
Confirm you are on [SLIIT Courseweb](https://courseweb.sliit.lk/). The extension is strictly scoped to this domain; it will not execute on other portals or external identity providers.

### 2. Confirm Double-Lock Configuration Status
To protect students from premature content filtering, the extension uses a **Double-Lock Defense**:
- It will **not** hide any items until an initial campus profile is configured.
- Open the configuration drawer via the floating gear trigger (bottom-right) or the toolbar extension icon.
- Ensure your campus and batch tracks are selected, then click **Apply Setup**.

### 3. Test with "Peek Hidden" Mode
If you suspect an important assignment or lecture note is hidden:
- Click the floating settings trigger on Courseweb to slide open the side panel.
- In the **Live Filter Status** card, click **Peek Hidden**.
- Hidden items will temporarily reappear with a distinct dashed gold border.
- Inspect the item's label to see whether it contains campus keywords that triggered the filter.

### 4. Review Whitelist Overrides
If an item has unusual phrasing (e.g., `Lab 3 Repeat Assignment (All Centers)`):
- Add a specific keyword (e.g., `repeat`) to the **Whitelist** field in the side panel or popup.
- Whitelisted keywords take immediate precedence and will never be hidden.

### 5. Check Browser DevTools Console
Open developer tools (`F12` or `Ctrl+Shift+I` on Windows/Linux; `Cmd+Option+I` on macOS) and filter the Console stream for:
```text
[Courseweb Cleaner]
```
Diagnostic messages indicate the loaded profile, rule version, and items evaluated on the active DOM.

---

## Troubleshooting Playbook

| Symptom | Root Cause | Solution |
| :--- | :--- | :--- |
| **No items are filtered or hidden** | Setup has not been applied (Double-Lock active) or extension lacks permissions. | Open the toolbar popup, select your campus and batch, and click **Apply Setup**. Verify extension has access to `courseweb.sliit.lk` in `chrome://extensions`. |
| **My own batch assignment is hidden** | Item contains an explicit mention of another campus or does not match batch regex. | Use **Peek Hidden** to locate the item. Add a unique keyword from its title into the **Whitelist** field. If the naming format is standard for your batch, submit a rule update in `rules.json`. |
| **Notice banner text is difficult to read** | Moodle custom CSS conflicting with dark theme. | The extension includes built-in high-contrast notice overrides (`#f7b924` background with dark text). Ensure you are running version **7.3.0 or higher**. |
| **White flash occurs when clicking links** | Anti-flash script not running at `document_start`. | Ensure the extension is enabled in your primary profile and hardware acceleration is enabled in your browser settings. |
| **Settings do not persist across devices** | Browser account sync is disabled or `chrome.storage.sync` quota exceeded. | Verify that browser profile sync is active in Chrome or Edge settings. The extension automatically falls back to local storage if sync is offline. |
| **Userscript is not executing on Tampermonkey** | Tampermonkey Developer Mode is disabled or script injection permissions are missing. | Open Tampermonkey dashboard, navigate to Settings, ensure Developer Mode is active, and confirm `@match *://courseweb.sliit.lk/*` is allowed. |
| **New semester batch format is ignored** | Campus introduced a new naming pattern not yet in `rules.json`. | Background service worker updates rules every 24 hours. You can force an update by re-applying setup or submit a pattern pull request to `rules.json`. |

---

## Filing an Effective Bug Report

When opening a bug report on [GitHub Issues](https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues), provide the following structured details:

```markdown
### Environment
- **Extension Version**: 7.3.0 (or commit hash)
- **Browser & Version**: (e.g., Google Chrome 124.0.6367.60, Brave 1.65, Firefox 125)
- **Installation Method**: (Chrome Web Store / Edge Add-ons / Firefox AMO / Userscript)
- **Active Profile**: Campus: [e.g., Malabe], Batch: [e.g., Weekday], Batch ID: [e.g., 2]

### Problem Description
A clear and concise description of what happened versus what was expected.

### Affected Activity Title
The exact text of the Courseweb assignment or section title (do NOT include sensitive student info or URLs with tokens):
`Example: Lab 02 - Weekday Batch 02 (Malabe)`

### Console Output
Copy relevant lines matching `[Courseweb Cleaner]` from DevTools Console.

### Screenshots
Attach screenshots comparing normal view with **Peek Hidden** mode enabled (if applicable).
```

---

## Frequently Asked Questions (FAQ)

### Does the extension collect my student ID or track my grades?
**No.** The extension operates entirely within your browser client. No student identifiers, grades, assignments, or network requests are sent to any external server. See our [Security Policy](SECURITY.md) and [Privacy Policy](site/privacy-policy.html).

### Why are notices and announcements never hidden?
The extension implements a strict **Notice Protector** heuristic. Critical alerts, rescheduled lecture announcements, exam schedules, and general faculty announcements are permanently protected from filtering to ensure students never miss vital academic updates.

### Can I temporarily view hidden items without changing my configuration?
**Yes.** Open the side panel drawer and click **Peek Hidden** (or enable **Ghost Mode** in settings). In Ghost Mode, filtered items are muted with partial opacity (`0.25`) instead of being completely removed.

### How do I update to the latest rules without reinstalling?
The extension's background service worker automatically polls for the latest community regex heuristics from GitHub once every 24 hours. When new patterns are merged into `rules.json`, your browser receives them in the background without requiring a Web Store update.

---

## Escalation and Project Contacts

If you cannot find an answer or need direct assistance:
- **Lead Maintainer**: Dulith Divisekara
- **Email**: `contact@dulith.me`
- **Telegram**: [@dulithdivisekara](https://t.me/dulithdivisekara)
- **GitHub**: [@dulithdivisekara](https://github.com/dulithdivisekara)
