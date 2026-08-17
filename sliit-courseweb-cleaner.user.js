// ==UserScript==
// @name         SLIIT Courseweb Module Cleaner
// @namespace    http://tampermonkey.net/
// @version      5.6
// @description  Hides specific links for other centers and adds a custom Settings UI.
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

        const otherGroupsRegex = new RegExp(`y2\\.s1\\.${CONFIG.batchTypeShort}\\.it\\.(?!${CONFIG.groupId})\\d+`, 'i');
        if (otherGroupsRegex.test(lower)) return true;

        const oppositeShort = CONFIG.batchTypeShort === 'we' ? 'wd' : 'we';
        if (lower.includes(`.${oppositeShort}.`) || lower.includes(`${oppositeShort}.it`)) return true;
        const oppositeFull = CONFIG.batchType === 'weekend' ? 'weekday' : 'weekend';

        const blockKeywords = [
            'kandy', 'kurunegal', 'metro', 'matara', 'mathara',
            'jaffna', 'northern', 'nothern', oppositeFull,
            'nu group', 'nu dataset', 'malabe batch'
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
            #sliit-filter-btn { position: fixed; bottom: 20px; right: 20px; background: #00529b; color: white; border: none; border-radius: 50px; padding: 12px 20px; font-size: 14px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2); z-index: 9999; font-weight: bold; transition: background 0.3s; }
            #sliit-filter-btn:hover { background: #003d73; }
            #sliit-filter-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 25px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 10000; width: 320px; font-family: sans-serif; }
            #sliit-filter-modal h3 { margin-top: 0; color: #333; }
            #sliit-filter-modal label { display: block; margin-top: 15px; font-size: 13px; color: #555; }
            #sliit-filter-modal select, #sliit-filter-modal input { width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
            .sliit-modal-actions { margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px; }
            .sliit-btn { padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; }
            .sliit-btn-save { background: #28a745; color: white; }
            .sliit-btn-cancel { background: #dc3545; color: white; }
            #sliit-filter-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9998; }
        `);

        const overlay = document.createElement('div');
        overlay.id = 'sliit-filter-overlay';

        const btn = document.createElement('button');
        btn.id = 'sliit-filter-btn';
        btn.innerHTML = '⚙️ Filter Settings';

        const modal = document.createElement('div');
        modal.id = 'sliit-filter-modal';
        modal.innerHTML = `
            <h3>Courseweb Filter Settings</h3>
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
            <input type="text" id="sf-group" placeholder="Enter your 4-digit ID">
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
            GM_setValue('groupId', document.getElementById('sf-group').value);
            location.reload(); // Instantly apply changes!
        };
    }

    // Run core logic
    window.addEventListener('load', () => {
        cleanCoursePage();
        injectUI(); // Inject the settings button
    });
    setTimeout(cleanCoursePage, 1000);
    setTimeout(cleanCoursePage, 2500);
})();