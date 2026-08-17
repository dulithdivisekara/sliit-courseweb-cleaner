# SLIIT Courseweb Module Cleaner

A lightweight, context-aware userscript designed to clean up the SLIIT Moodle (Courseweb) interface. It automatically filters out irrelevant modules, assignments, and announcements meant for other campuses or weekday groups, leaving you with a distraction-free dashboard.

## Visual Comparison

| Before (Cluttered) | After (Clean) |
| :---: | :---: |
| ![Before Filter](assets/before.png) | ![After Filter](assets/after.png) |

## Core Features

* **Smart Filtering:** Hides activities belonging to other centers (Metro, Kandy, Matara, Northern Uni) and Weekday batches.
* **Preserves Structure:** Keeps general course announcements, shared materials, and section headers strictly visible.
* **Targeted Whitelisting:** Protects specific Weekend group resources (e.g., `Y2.S1.WE.IT.0301`).
* **Notice Protector:** Ensures critical alerts, rescheduled labs, and general announcements remain visible.

## Installation Instructions

1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your browser.
2. Click **[HERE](https://github.com/dulithdivisekara/sliit-courseweb-cleaner/raw/refs/heads/main/sliit-courseweb-cleaner.user.js)** to install the script.
3. Click **Install** when the Tampermonkey tab opens.
4. Refresh your Courseweb page.

## Technical Details

* **Language:** JavaScript (ES6+)
* **Dependency:** Tampermonkey API

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.