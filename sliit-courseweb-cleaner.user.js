// ==UserScript==
// @name         SLIIT Courseweb Module Cleaner (v5.4 - Keep Titles)
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  Hides specific links for other centers but KEEPS the section titles visible.
// @author       You
// @match        *://courseweb.sliit.lk/course/view.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function isExplicitlyMine(lower) {
        if (lower.includes('y2.s1.we.it.0301')) return true;
        if (lower.includes('malabe') && lower.includes('weekend')) return true;
        if (lower.includes('notice') || lower.includes('rescheduled') || lower.includes('announcement')) return true;
        return false;
    }

    function shouldBlock(text) {
        const lower = text.toLowerCase().trim();
        if (!lower) return false;

        if (isExplicitlyMine(lower)) return false;
        if (/y2\.s1\.we\.it\.(?!0301)\d+/i.test(lower)) return true;
        if (lower.includes('.wd.') || lower.includes('wd.it')) return true;

        const blockKeywords = [
            'kandy', 'kurunegal', 'metro', 'matara', 'mathara', 
            'jaffna', 'northern', 'nothern', 'weekday', 
            'nu group', 'nu dataset', 'malabe batch'
        ];
        if (blockKeywords.some(word => lower.includes(word))) return true;

        const blockRegexes = [
            /\bbatch\s*\d+\b/i,
            /\by2s1\.b\d+/i,
            /\by2s1\.lab_\w+/i
        ];
        if (blockRegexes.some(regex => regex.test(lower))) return true;

        return false;
    }

    function cleanCoursePage() {
        const activities = document.querySelectorAll('.activity');
        let hideSection = false;

        activities.forEach(activity => {
            const text = activity.innerText;
            const lower = text.toLowerCase();
            
            // Check if this item is just a structural Title/Label
            const isTitle = activity.classList.contains('modtype_label') || activity.querySelector('h1, h2, h3, h4, h5');

            // 1. Toggle "Hide Section" mode based on what the title says
            if (isExplicitlyMine(lower) || lower.includes('weekend') || lower.includes('we.') || lower.includes('lecture') || lower.includes('general') || lower.includes('workshop') || lower.includes('lab ')) {
                hideSection = false;
            } else if (shouldBlock(text) && !lower.includes('weekend') && !lower.includes('we.')) {
                hideSection = true;
            }

            // 2. Apply visibility rules
            if (isTitle) {
                // NEVER hide titles! Leave them visible on the page.
                activity.style.display = '';
            } else if (isExplicitlyMine(lower)) {
                activity.style.display = ''; // Force show your specific links
            } else if (shouldBlock(text) || hideSection) {
                activity.style.display = 'none'; // Hide the actionable links for other groups
            } else {
                activity.style.display = ''; // Safe links stay visible
            }
        });

        // Clean inner elements (removed heading tags from this list to protect inner titles too)
        const innerElements = document.querySelectorAll('.no-overflow p, .no-overflow li, .no-overflow div');

        innerElements.forEach(el => {
            if (el.children.length > 2 && el.tagName === 'DIV') return;
            
            const lowerText = el.innerText.toLowerCase();
            
            if (isExplicitlyMine(lowerText)) {
                el.style.display = '';
            } else if (shouldBlock(el.innerText)) {
                el.style.display = 'none';
            }
        });
    }

    // Run when page loads and handle dynamic Moodle rendering
    window.addEventListener('load', cleanCoursePage);
    setTimeout(cleanCoursePage, 1000);
    setTimeout(cleanCoursePage, 2500);
})();
