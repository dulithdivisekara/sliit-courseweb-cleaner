// ==UserScript==
// @name         SLIIT Courseweb Module Cleaner
// @namespace    http://tampermonkey.net/
// @version      5.8
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
                top: 80px; 
                right: 30px; 
                background-color: #ffffff; 
                color: #0f3b5f; /* SLIIT Navy */
                border: 1px solid #0f3b5f; 
                border-radius: 4px; 
                padding: 6px 14px; 
                font-size: 13px; 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                cursor: pointer; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
                z-index: 9999; 
                transition: all 0.2s ease-in-out; 
            }
            #sliit-filter-btn:hover { 
                background-color: #0f3b5f; 
                color: #ffffff; 
            }
            
            #sliit-filter-modal { 
                display: none; 
                position: fixed; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%, -50%); 
                background: #ffffff; 
                padding: 24px; 
                border-radius: 6px; 
                border: 1px solid rgba(0,0,0,0.1);
                box-shadow: 0 10px 30px rgba(0,0,0,0.15); 
                z-index: 10000; 
                width: 340px; 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }
            #sliit-filter-modal h3 { 
                margin-top: 0; 
                margin-bottom: 20px;
                color: #212529; 
                font-size: 18px;
                font-weight: 600;
                border-bottom: 1px solid #dee2e6;
                padding-bottom: 10px;
            }
            #sliit-filter-modal label { 
                display: block; 
                margin-top: 15px; 
                font-size: 13px; 
                font-weight: 500;
                color: #495057; 
            }
            #sliit-filter-modal select, #sliit-filter-modal input { 
                width: 100%; 
                padding: 8px 12px; 
                margin-top: 6px; 
                border: 1px solid #ced4da; 
                border-radius: 4px; 
                box-sizing: border-box; 
                font-size: 14px;
                color: #495057;
                background-color: #fff;
            }
            #sliit-filter-modal select:focus, #sliit-filter-modal input:focus {
                outline: none;
                border-color: #80bdff;
                box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
            }
            .sliit-modal-actions { 
                margin-top: 25px; 
                display: flex; 
                justify-content: flex-end; 
                gap: 10px; 
            }
            .sliit-btn { 
                padding: 8px 16px; 
                border: none; 
                border-radius: 4px; 
                font-size: 14px;
                font-weight: 500;
                cursor: pointer; 
                transition: background-color 0.15s ease-in-out;
            }
            .sliit-btn-save { 
                background: #0f3b5f; /* Native SLIIT Blue instead of bright green */
                color: white; 
            }
            .sliit-btn-save:hover { background: #0a2942; }
            .sliit-btn-cancel { 
                background: #6c757d; /* Standard Bootstrap grey instead of bright red */
                color: white; 
            }
            .sliit-btn-cancel:hover { background: #5a6268; }
            #sliit-filter-overlay { 
                display: none; 
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100%; 
                height: 100%; 
                background: rgba(0,0,0,0.4); 
                z-index: 9998; 
                backdrop-filter: blur(2px);
            }
        `);

        const overlay = document.createElement('div');
        overlay.id = 'sliit-filter-overlay';

        const btn = document.createElement('button');
        btn.id = 'sliit-filter-btn';
        btn.innerHTML = 'Filter Settings';

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