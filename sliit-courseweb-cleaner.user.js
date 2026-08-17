// ==UserScript==
// @name         SLIIT Courseweb Module Cleaner
// @namespace    http://tampermonkey.net/
// @version      5.9
// @description  Hides specific links for other centers and adds a native-themed Settings UI.
// @author       You
// @match        *://courseweb.sliit.lk/course/view.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // --- LOAD SAVED CONFIGURATION (OR USE DEFAULTS) ---
    const CONFIG = {
        campus: GM_getValue('campus', 'malabe'),
        batchType: GM_getValue('batchType', 'weekend'),
        batchTypeShort: GM_getValue('batchTypeShort', 'we'),
        groupId: GM_getValue('groupId', '0301')
    };
    // --------------------------------------------------

    function isExplicitlyMine(lower) {
        if (CONFIG.groupId) {
            const exactGroup = `y2.s1.${CONFIG.batchTypeShort}.it.${CONFIG.groupId}`;
            if (lower.includes(exactGroup)) return true;
        }

        if (lower.includes(CONFIG.campus) && lower.includes(CONFIG.batchType)) return true;
        if (lower.includes('notice') || lower.includes('rescheduled') || lower.includes('announcement')) return true;

        return false;
    }

    function shouldBlock(text) {
        const lower = text.toLowerCase().trim();
        if (!lower) return false;

        if (isExplicitlyMine(lower)) return false;

        if (CONFIG.groupId) {
            const otherGroupsRegex = new RegExp(`y2\\.s1\\.${CONFIG.batchTypeShort}\\.it\\.(?!${CONFIG.groupId})\\d+`, 'i');
            if (otherGroupsRegex.test(lower)) return true;
        }

        const oppositeShort = CONFIG.batchTypeShort === 'we' ? 'wd' : 'we';
        if (lower.includes(`.${oppositeShort}.`) || lower.includes(`${oppositeShort}.it`)) return true;
        const oppositeFull = CONFIG.batchType === 'weekend' ? 'weekday' : 'weekend';

        const blockKeywords = [
            'malabe', 'kandy', 'kurunegal', 'metro', 'matara', 'mathara',
            'jaffna', 'northern', 'nothern', oppositeFull,
            'nu group', 'nu dataset', 'batch'
        ];

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

    // --- USER INTERFACE (SETTINGS MENU) ---
    function injectUI() {
        GM_addStyle(`
            /* NATIVE MOODLE THEME SYNC */
            #sliit-filter-btn { 
                position: fixed; 
                top: 120px; 
                right: 0; 
                background-color: #f7b924; /* SLIIT Yellow Accent */
                color: #212529; 
                border: none; 
                border-radius: 6px 0 0 6px; /* Flush against the right edge */
                padding: 10px 14px 10px 18px; 
                font-size: 13px; 
                font-weight: 600;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                cursor: pointer; 
                box-shadow: -2px 2px 6px rgba(0,0,0,0.15); 
                z-index: 9999; 
                transition: all 0.2s ease-in-out; 
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #sliit-filter-btn:hover { 
                background-color: #e5a919; 
                padding-right: 20px; /* Slight slide-out effect on hover */
            }
            #sliit-filter-btn svg {
                width: 16px;
                height: 16px;
            }
            
            #sliit-filter-modal { 
                display: none; 
                position: fixed; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%, -50%); 
                background: #ffffff; 
                padding: 24px; 
                border-radius: 8px; 
                border-top: 4px solid #0f3b5f; /* SLIIT Navy Header Accent */
                box-shadow: 0 10px 40px rgba(0,0,0,0.2); 
                z-index: 10000; 
                width: 340px; 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            #sliit-filter-modal h3 { 
                margin-top: 0; 
                margin-bottom: 20px;
                color: #0f3b5f; 
                font-size: 18px;
                font-weight: 600;
                border-bottom: 1px solid #dee2e6;
                padding-bottom: 12px;
            }
            #sliit-filter-modal label { 
                display: block; 
                margin-top: 15px; 
                font-size: 13px; 
                font-weight: 600;
                color: #495057; 
            }
            #sliit-filter-modal select, #sliit-filter-modal input { 
                width: 100%; 
                padding: 10px 12px; 
                margin-top: 6px; 
                border: 1px solid #ced4da; 
                border-radius: 4px; 
                box-sizing: border-box; 
                font-size: 14px;
                color: #495057;
                background-color: #f8f9fa;
                transition: border-color 0.15s ease-in-out;
            }
            #sliit-filter-modal select:focus, #sliit-filter-modal input:focus {
                outline: none;
                border-color: #f7b924; /* SLIIT Yellow Focus */
                background-color: #fff;
            }
            .sliit-modal-actions { 
                margin-top: 25px; 
                display: flex; 
                justify-content: flex-end; 
                gap: 10px; 
            }
            .sliit-btn { 
                padding: 9px 18px; 
                border: none; 
                border-radius: 4px; 
                font-size: 14px;
                font-weight: 600;
                cursor: pointer; 
                transition: background-color 0.15s ease-in-out;
            }
            .sliit-btn-save { 
                background: #0f3b5f; 
                color: white; 
            }
            .sliit-btn-save:hover { background: #0a2942; }
            .sliit-btn-cancel { 
                background: #e9ecef; 
                color: #495057; 
            }
            .sliit-btn-cancel:hover { background: #dde0e3; }
            #sliit-filter-overlay { 
                display: none; 
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100%; 
                height: 100%; 
                background: rgba(0,0,0,0.5); 
                z-index: 9998; 
                backdrop-filter: blur(3px);
            }
        `);

        const overlay = document.createElement('div');
        overlay.id = 'sliit-filter-overlay';

        const btn = document.createElement('button');
        btn.id = 'sliit-filter-btn';
        // Clean inline SVG instead of emoji
        const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
        btn.innerHTML = `${svgIcon} Settings`;

        const modal = document.createElement('div');
        modal.id = 'sliit-filter-modal';
        modal.innerHTML = `
            <h3>Filter Configuration</h3>
            <label>Campus</label>
            <select id="sf-campus">
                <option value="malabe">Malabe</option>
                <option value="metro">Metro</option>
                <option value="kandy">Kandy</option>
                <option value="kurunegala">Kurunegala</option>
                <option value="matara">Matara</option>
                <option value="jaffna">Jaffna</option>
            </select>
            <label>Batch Type</label>
            <select id="sf-type">
                <option value="weekend">Weekend (WE)</option>
                <option value="weekday">Weekday (WD)</option>
            </select>
            <label>Group ID (e.g., 0301)</label>
            <input type="text" id="sf-group" placeholder="Leave empty for all groups">
            <div class="sliit-modal-actions">
                <button class="sliit-btn sliit-btn-cancel" id="sf-cancel">Cancel</button>
                <button class="sliit-btn sliit-btn-save" id="sf-save">Save & Reload</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(btn);
        document.body.appendChild(modal);

        // Populate current saved values
        document.getElementById('sf-campus').value = CONFIG.campus;
        document.getElementById('sf-type').value = CONFIG.batchType;
        document.getElementById('sf-group').value = CONFIG.groupId;

        // Event Listeners
        btn.onclick = () => { modal.style.display = 'block'; overlay.style.display = 'block'; };
        const close = () => { modal.style.display = 'none'; overlay.style.display = 'none'; };
        document.getElementById('sf-cancel').onclick = close;
        overlay.onclick = close;

        document.getElementById('sf-save').onclick = () => {
            const newType = document.getElementById('sf-type').value;
            GM_setValue('campus', document.getElementById('sf-campus').value);
            GM_setValue('batchType', newType);
            GM_setValue('batchTypeShort', newType === 'weekend' ? 'we' : 'wd');
            GM_setValue('groupId', document.getElementById('sf-group').value.trim());
            location.reload();
        };
    }

    // Run core logic
    window.addEventListener('load', () => {
        cleanCoursePage();
        injectUI();
    });
    setTimeout(cleanCoursePage, 1000);
    setTimeout(cleanCoursePage, 2500);
})();