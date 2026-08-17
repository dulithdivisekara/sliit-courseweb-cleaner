// ==UserScript==
// @name         SLIIT Courseweb Module Cleaner
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  Hides specific links for other centers but KEEPS the section titles visible.
// @author       You
// @match        *://courseweb.sliit.lk/course/view.php*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- USER CONFIGURATION ---
    // Edit these values to match your specific batch details
    const CONFIG = {
        campus: 'malabe',       // Options: 'malabe', 'kandy', 'kurunegala', 'metro', 'jaffna', 'northern'
        batchType: 'weekend',   // Options: 'weekend', 'weekday'
        batchTypeShort: 'we',   // Options: 'we', 'wd'
        groupId: '0301'         // Your specific group number
    };
    // --------------------------

    function isExplicitlyMine(lower) {
        const exactGroup = `y2.s1.${CONFIG.batchTypeShort}.it.${CONFIG.groupId}`;
        if (lower.includes(exactGroup)) return true;

        if (lower.includes(CONFIG.campus) && lower.includes(CONFIG.batchType)) return true;
        if (lower.includes('notice') || lower.includes('rescheduled') || lower.includes('announcement')) return true;

        return false;
    }

    function shouldBlock(text) {
        const lower = text.toLowerCase().trim();
        if (!lower) return false;

        if (isExplicitlyMine(lower)) return false;

        // Block other groups of the same batch type (e.g., other WE groups if you are WE)
        const otherGroupsRegex = new RegExp(`y2\\.s1\\.${CONFIG.batchTypeShort}\\.it\\.(?!${CONFIG.groupId})\\d+`, 'i');
        if (otherGroupsRegex.test(lower)) return true;

        // Block the opposite batch type dynamically (e.g., WD if you are WE)
        const oppositeShort = CONFIG.batchTypeShort === 'we' ? 'wd' : 'we';
        if (lower.includes(`.${oppositeShort}.`) || lower.includes(`${oppositeShort}.it`)) return true;
        const oppositeFull = CONFIG.batchType === 'weekend' ? 'weekday' : 'weekend';

        const blockKeywords = [
            'kandy', 'kurunegal', 'metro', 'matara', 'mathara',
            'jaffna', 'northern', 'nothern', oppositeFull,
            'nu group', 'nu dataset', 'malabe batch'
        ];

        // Remove the user's campus from the block list just in case
        const filteredBlockKeywords = blockKeywords.filter(word => word !== CONFIG.campus);

        if (filteredBlockKeywords.some(word => lower.includes(word))) return true;

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

            const isTitle = activity.classList.contains('modtype_label') || activity.querySelector('h1, h2, h3, h4, h5');

            if (isExplicitlyMine(lower) || lower.includes(CONFIG.batchType) || lower.includes(`${CONFIG.batchTypeShort}.`) || lower.includes('lecture') || lower.includes('general') || lower.includes('workshop') || lower.includes('lab ')) {
                hideSection = false;
            } else if (shouldBlock(text) && !lower.includes(CONFIG.batchType) && !lower.includes(`${CONFIG.batchTypeShort}.`)) {
                hideSection = true;
            }

            if (isTitle) {
                activity.style.display = '';
            } else if (isExplicitlyMine(lower)) {
                activity.style.display = '';
            } else if (shouldBlock(text) || hideSection) {
                activity.style.display = 'none';
            } else {
                activity.style.display = '';
            }
        });

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

    window.addEventListener('load', cleanCoursePage);
    setTimeout(cleanCoursePage, 1000);
    setTimeout(cleanCoursePage, 2500);
})();