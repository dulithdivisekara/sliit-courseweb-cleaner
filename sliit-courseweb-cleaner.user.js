// ==UserScript==
// @name         SLIIT Courseweb Module Cleaner
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  A professional, context-aware module filter for SLIIT Courseweb.
// @author       Dulith Divisekara
// @match        *://courseweb.sliit.lk/course/view.php*
// @updateURL    https://github.com/dulithdivisekara/sliit-courseweb-cleaner/raw/refs/heads/main/sliit-courseweb-cleaner.user.js
// @downloadURL  https://github.com/dulithdivisekara/sliit-courseweb-cleaner/raw/refs/heads/main/sliit-courseweb-cleaner.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // --- LOAD SAVED CONFIGURATION ---
    const CONFIG = {
        hasSeenWelcome: GM_getValue('hasSeenWelcome', false),
        enabled: GM_getValue('enabled', true),
        ghostMode: GM_getValue('ghostMode', false),
        campus: GM_getValue('campus', 'malabe'),
        batchType: GM_getValue('batchType', 'weekend'),
        batchTypeShort: GM_getValue('batchTypeShort', 'we'),
        groupId: GM_getValue('groupId', '0301')
    };
    // --------------------------------

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

    function applyHiding(element, shouldHide) {
        if (shouldHide) {
            if (CONFIG.ghostMode) {
                element.style.opacity = '0.25';
                element.style.transform = 'scale(0.98)';
                element.style.transition = 'all 0.3s ease';
                element.style.filter = 'grayscale(100%)';
            } else {
                element.style.display = 'none';
            }
        } else {
            element.style.display = '';
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.filter = 'none';
        }
    }

    function cleanCoursePage() {
        if (!CONFIG.enabled) return;

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

            if (isTitle || isExplicitlyMine(lower)) {
                applyHiding(activity, false);
            } else if (shouldBlock(text) || hideSection) {
                applyHiding(activity, true);
            } else {
                applyHiding(activity, false);
            }
        });

        const innerElements = document.querySelectorAll('.no-overflow p, .no-overflow li, .no-overflow div');

        innerElements.forEach(el => {
            if (el.children.length > 2 && el.tagName === 'DIV') return;
            const lowerText = el.innerText.toLowerCase();

            if (isExplicitlyMine(lowerText)) {
                applyHiding(el, false);
            } else if (shouldBlock(el.innerText)) {
                applyHiding(el, true);
            }
        });
    }

    // --- USER INTERFACE (SETTINGS & WELCOME MENU) ---
    function injectUI() {
        GM_addStyle(`
            #sliit-filter-btn { position: fixed; top: 120px; right: 0; background-color: #f7b924; color: #212529; border: none; border-radius: 6px 0 0 6px; padding: 10px 14px 10px 18px; font-size: 13px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; cursor: pointer; box-shadow: -2px 2px 6px rgba(0,0,0,0.15); z-index: 9999; transition: all 0.2s ease-in-out; display: flex; align-items: center; gap: 8px; }
            #sliit-filter-btn:hover { background-color: #e5a919; padding-right: 20px; }
            #sliit-filter-btn svg { width: 16px; height: 16px; }
            
            .sf-modal-container { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ffffff; padding: 24px; border-radius: 8px; border-top: 4px solid #0f3b5f; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 10000; width: 340px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
            .sf-modal-container h3 { margin-top: 0; margin-bottom: 20px; color: #0f3b5f; font-size: 18px; font-weight: 600; border-bottom: 1px solid #dee2e6; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
            
            .sf-toggle-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #dee2e6; }
            .sf-toggle-label { font-size: 13px; font-weight: 600; color: #212529; }
            .sf-toggle-sub { font-size: 11px; color: #6c757d; font-weight: normal; display: block; }
            
            .sf-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
            .sf-switch input { opacity: 0; width: 0; height: 0; }
            .sf-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ced4da; transition: .3s; border-radius: 22px; }
            .sf-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
            input:checked + .sf-slider { background-color: #0f3b5f; }
            input:checked + .sf-slider:before { transform: translateX(18px); }

            .sf-input-label { display: block; margin-top: 15px; font-size: 12px; font-weight: 600; color: #495057; }
            .sf-modal-container select, .sf-modal-container input[type="text"] { width: 100%; padding: 10px 12px; margin-top: 6px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box; font-size: 14px; color: #495057; background-color: #f8f9fa; }
            .sf-modal-container select:focus, .sf-modal-container input[type="text"]:focus { outline: none; border-color: #f7b924; background-color: #fff; }
            
            .sliit-modal-actions { margin-top: 25px; display: flex; justify-content: space-between; align-items: center; }
            .sliit-btn { padding: 9px 14px; border: none; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background-color 0.15s ease-in-out; text-decoration: none; text-align: center; }
            .sliit-btn-save { background: #0f3b5f; color: white; }
            .sliit-btn-save:hover { background: #0a2942; }
            .sliit-btn-cancel { background: #e9ecef; color: #495057; }
            .sliit-btn-cancel:hover { background: #dde0e3; }
            .sliit-btn-reset { background: transparent; color: #dc3545; border: 1px solid #dc3545; padding: 8px 12px; }
            .sliit-btn-reset:hover { background: #dc3545; color: white; }
            
            .sf-footer { margin-top: 20px; text-align: center; font-size: 12px; color: #6c757d; }
            .sf-footer a { color: #0f3b5f; text-decoration: none; font-weight: 600; margin: 0 5px; }
            .sf-footer a:hover { text-decoration: underline; }
            
            #sliit-filter-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9998; backdrop-filter: blur(3px); }

            /* Welcome Modal Specifics */
            .sf-welcome-text { font-size: 13px; color: #495057; line-height: 1.5; margin-bottom: 15px; }
            .sf-welcome-credit { background: #f8f9fa; border-left: 3px solid #f7b924; padding: 12px; font-size: 12px; color: #6c757d; margin-bottom: 20px; }
            .sf-welcome-credit strong { color: #0f3b5f; }
        `);

        const overlay = document.createElement('div');
        overlay.id = 'sliit-filter-overlay';

        const btn = document.createElement('button');
        btn.id = 'sliit-filter-btn';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Settings`;

        // The Main Settings Modal
        const settingsModal = document.createElement('div');
        settingsModal.className = 'sf-modal-container';
        settingsModal.id = 'sliit-filter-modal';
        settingsModal.innerHTML = `
            <h3>Filter Settings</h3>
            <div class="sf-toggle-container">
                <span class="sf-toggle-label">Enable Filter <span class="sf-toggle-sub">Turn on/off entire script</span></span>
                <label class="sf-switch"><input type="checkbox" id="sf-enabled" ${CONFIG.enabled ? 'checked' : ''}><span class="sf-slider"></span></label>
            </div>
            <div class="sf-toggle-container">
                <span class="sf-toggle-label">Ghost Mode <span class="sf-toggle-sub">Dim items instead of hiding</span></span>
                <label class="sf-switch"><input type="checkbox" id="sf-ghost" ${CONFIG.ghostMode ? 'checked' : ''}><span class="sf-slider"></span></label>
            </div>
            <label class="sf-input-label">Campus</label>
            <select id="sf-campus">
                <option value="malabe">Malabe</option>
                <option value="metro">Metro</option>
                <option value="kandy">Kandy</option>
                <option value="kurunegala">Kurunegala</option>
                <option value="matara">Matara</option>
                <option value="jaffna">Jaffna</option>
            </select>
            <label class="sf-input-label">Batch Type</label>
            <select id="sf-type">
                <option value="weekend">Weekend (WE)</option>
                <option value="weekday">Weekday (WD)</option>
            </select>
            <label class="sf-input-label">Group ID (e.g., 0301)</label>
            <input type="text" id="sf-group" placeholder="Leave empty for all groups">
            <div class="sliit-modal-actions">
                <button class="sliit-btn sliit-btn-reset" id="sf-reset">Reset</button>
                <div>
                    <button class="sliit-btn sliit-btn-cancel" id="sf-cancel">Cancel</button>
                    <button class="sliit-btn sliit-btn-save" id="sf-save">Save</button>
                </div>
            </div>
            <div class="sf-footer">
                <a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues" target="_blank">Report Bug</a> • 
                <a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner" target="_blank">Source Code</a>
            </div>
        `;

        // The Welcome Modal
        const welcomeModal = document.createElement('div');
        welcomeModal.className = 'sf-modal-container';
        welcomeModal.id = 'sliit-welcome-modal';
        welcomeModal.innerHTML = `
            <h3>Welcome! 👋</h3>
            <p class="sf-welcome-text">Thank you for installing the <strong>SLIIT Courseweb Cleaner</strong>. This tool is designed to keep your dashboard distraction-free by automatically filtering out irrelevant batches and centers.</p>
            <div class="sf-welcome-credit">
                Developed by <strong>Dulith Divisekara</strong>.<br><br>
                If you find this tool helpful, please consider supporting the project by leaving a star on GitHub!
            </div>
            <div class="sliit-modal-actions" style="justify-content: space-between;">
                <a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner" target="_blank" class="sliit-btn sliit-btn-cancel">⭐ Star on GitHub</a>
                <button class="sliit-btn sliit-btn-save" id="sf-welcome-start">Configure Settings</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(btn);
        document.body.appendChild(settingsModal);
        document.body.appendChild(welcomeModal);

        // Populate selects
        document.getElementById('sf-campus').value = CONFIG.campus;
        document.getElementById('sf-type').value = CONFIG.batchType;
        document.getElementById('sf-group').value = CONFIG.groupId;

        // Display Logic
        const showSettings = () => { settingsModal.style.display = 'block'; overlay.style.display = 'block'; };
        const closeModals = () => { settingsModal.style.display = 'none'; welcomeModal.style.display = 'none'; overlay.style.display = 'none'; };

        btn.onclick = showSettings;
        document.getElementById('sf-cancel').onclick = closeModals;
        overlay.onclick = closeModals;

        // Welcome Modal Logic
        if (!CONFIG.hasSeenWelcome) {
            welcomeModal.style.display = 'block';
            overlay.style.display = 'block';
            document.getElementById('sf-welcome-start').onclick = () => {
                GM_setValue('hasSeenWelcome', true);
                welcomeModal.style.display = 'none';
                showSettings(); // Move them right into settings to set up their batch
            };
        }

        // Settings Logic
        document.getElementById('sf-reset').onclick = () => {
            if(confirm('Are you sure you want to reset all settings to default?')) {
                GM_deleteValue('hasSeenWelcome');
                GM_deleteValue('enabled');
                GM_deleteValue('ghostMode');
                GM_deleteValue('campus');
                GM_deleteValue('batchType');
                GM_deleteValue('batchTypeShort');
                GM_deleteValue('groupId');
                location.reload();
            }
        };

        document.getElementById('sf-save').onclick = () => {
            const newType = document.getElementById('sf-type').value;
            GM_setValue('enabled', document.getElementById('sf-enabled').checked);
            GM_setValue('ghostMode', document.getElementById('sf-ghost').checked);
            GM_setValue('campus', document.getElementById('sf-campus').value);
            GM_setValue('batchType', newType);
            GM_setValue('batchTypeShort', newType === 'weekend' ? 'we' : 'wd');
            GM_setValue('groupId', document.getElementById('sf-group').value.trim());
            location.reload();
        };
    }

    window.addEventListener('load', () => {
        cleanCoursePage();
        injectUI();
    });
    setTimeout(cleanCoursePage, 1000);
    setTimeout(cleanCoursePage, 2500);
})();