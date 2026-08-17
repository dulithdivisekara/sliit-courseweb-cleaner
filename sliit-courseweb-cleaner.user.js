// ==UserScript==
// @name         SLIIT Courseweb Module Cleaner
// @namespace    http://tampermonkey.net/
// @version      6.9.0
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
        ghostMode: GM_getValue('ghostMode', true),
        campus: GM_getValue('campus', 'malabe'),
        batchType: GM_getValue('batchType', 'weekday'),
        batchTypeShort: GM_getValue('batchTypeShort', 'wd'),
        groupId: GM_getValue('groupId', '')
    };
    // --------------------------------

    function shouldBlock(text, lower) {
        if (!lower) return false;

        // Core Identifiers
        const campuses = ['malabe', 'kandy', 'kurunegal', 'metro', 'matara', 'mathara', 'jaffna', 'northern', 'nothern'];
        const foreignCampuses = campuses.filter(c => c !== CONFIG.campus);

        const oppositeFull = CONFIG.batchType === 'weekend' ? 'weekday' : 'weekend';
        const oppositeShort = CONFIG.batchTypeShort === 'we' ? 'wd' : 'we';

        // Aggregated List Heuristics
        const hasMyCampus = lower.includes(CONFIG.campus);
        const hasForeignCampus = foreignCampuses.some(c => lower.includes(c));
        const isAggregatedCampusList = hasMyCampus && hasForeignCampus;

        const hasMyBatchFull = lower.includes(CONFIG.batchType);
        const hasOppositeFull = lower.includes(oppositeFull);
        const isAggregatedBatchList = hasMyBatchFull && hasOppositeFull;

        const hasMyShort = lower.includes(`.${CONFIG.batchTypeShort}.`) || lower.includes(`${CONFIG.batchTypeShort}.it`);
        const hasOppositeShort = lower.includes(`.${oppositeShort}.`) || lower.includes(`${oppositeShort}.it`);
        const isAggregatedShortList = hasMyShort && hasOppositeShort;

        // 1. Block foreign groups (Unless it's an aggregated block containing my group)
        if (CONFIG.groupId) {
            const otherGroupsRegex = new RegExp(`y2\\.s1\\.${CONFIG.batchTypeShort}\\.it\\.(?!${CONFIG.groupId})\\d+`, 'i');
            const myGroupRegex = new RegExp(`y2\\.s1\\.${CONFIG.batchTypeShort}\\.it\\.${CONFIG.groupId}`, 'i');
            if (otherGroupsRegex.test(lower) && !myGroupRegex.test(lower)) return true;
        }

        // 2. Block opposite batch abbreviations (Protect Aggregated)
        if (hasOppositeShort && !isAggregatedShortList && !isAggregatedCampusList) return true;

        // 3. Block opposite full batch names (Protect Aggregated)
        if (hasOppositeFull && !isAggregatedBatchList && !isAggregatedCampusList) return true;

        // 4. Block foreign campuses (Protect Aggregated)
        if (hasForeignCampus && !isAggregatedCampusList) return true;

        // 5. Malabe-only format logic
        if (CONFIG.campus === 'malabe') {
            const malabeBlockRegexes = [/\bbatch\s*\d+\b/i, /\by2s1\.b\d+/i, /\by2s1\.lab_\w+/i];
            if (malabeBlockRegexes.some(regex => regex.test(lower))) {
                if (CONFIG.batchType === 'weekday' && lower.includes('malabe') && !lower.includes('weekend')) return false;
                return true;
            }
        }

        // 6. Regional-only format logic
        if (CONFIG.campus !== 'malabe') {
            if (/y2\.s1\.(wd|we)\.it\.?\d+/i.test(lower) && !isAggregatedCampusList && !hasMyCampus && !/\by2s1\.b\d+/i.test(lower)) return true;
        }

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
        const campuses = ['malabe', 'kandy', 'kurunegal', 'metro', 'matara', 'mathara', 'jaffna', 'northern', 'nothern'];
        const oppositeFull = CONFIG.batchType === 'weekend' ? 'weekday' : 'weekend';

        let activeCampus = 'all';
        let activeBatch = 'all';

        activities.forEach(activity => {
            const text = activity.innerText;
            const lower = text.toLowerCase();
            const isTitle = activity.classList.contains('modtype_label') || activity.querySelector('h1, h2, h3, h4, h5');

            // --- AUTO-RESETTING CONTEXT ENGINE ---
            if (isTitle) {
                const mentionedCampus = campuses.find(c => lower.includes(c));
                const mentionedBatch = lower.includes(CONFIG.batchType) ? CONFIG.batchType : (lower.includes(oppositeFull) ? oppositeFull : null);

                if (mentionedCampus || mentionedBatch) {
                    if (mentionedCampus) activeCampus = mentionedCampus;
                    if (mentionedBatch) activeBatch = mentionedBatch;

                    if (mentionedCampus && !mentionedBatch) activeBatch = 'all';
                    if (!mentionedCampus && mentionedBatch) activeCampus = 'all';
                } else {
                    activeCampus = 'all';
                    activeBatch = 'all';
                }
            }

            let shouldHide = false;

            // Execution Priority Stack
            if (CONFIG.groupId && lower.includes(`y2.s1.${CONFIG.batchTypeShort}.it.${CONFIG.groupId}`)) {
                shouldHide = false;
            } else if (lower.includes('notice') || lower.includes('rescheduled') || lower.includes('announcement')) {
                shouldHide = false;
            } else if (activeCampus !== 'all' && activeCampus !== CONFIG.campus) {
                shouldHide = true;
            } else if (activeBatch !== 'all' && activeBatch !== CONFIG.batchType) {
                shouldHide = true;
            } else if (shouldBlock(text, lower)) {
                shouldHide = true;
            }

            if (isTitle) {
                if ((activeCampus !== 'all' && activeCampus !== CONFIG.campus) ||
                    (activeBatch !== 'all' && activeBatch !== CONFIG.batchType)) {
                    shouldHide = true;
                } else {
                    shouldHide = false;
                }
            }

            applyHiding(activity, shouldHide);
        });

        // Inner elements backup cleaner (Strips foreign items out of aggregated lists)
        const innerElements = document.querySelectorAll('.no-overflow p, .no-overflow li, .no-overflow div');
        innerElements.forEach(el => {
            if (el.children.length > 2 && el.tagName === 'DIV') return;
            const lowerText = el.innerText.toLowerCase();

            if (CONFIG.groupId && lowerText.includes(`y2.s1.${CONFIG.batchTypeShort}.it.${CONFIG.groupId}`)) {
                applyHiding(el, false);
            } else if (lowerText.includes('notice') || lowerText.includes('general')) {
                applyHiding(el, false);
            } else if (shouldBlock(el.innerText, lowerText)) {
                applyHiding(el, true);
            }
        });
    }

    // --- USER INTERFACE (SETTINGS MENU) ---
    function injectUI() {
        GM_addStyle(`
            #sliit-filter-btn { position: fixed; top: 150px; right: 0; background-color: #f7b924; color: #212529; border: none; border-radius: 6px 0 0 6px; padding: 10px 14px 10px 18px; font-size: 13px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; cursor: pointer; box-shadow: -2px 2px 6px rgba(0,0,0,0.15); z-index: 9999; transition: all 0.2s ease-in-out; display: flex; align-items: center; gap: 8px; }
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
            .sf-modal-container select, .sf-modal-container input[type="text"] { width: 100%; padding: 10px 12px; margin-top: 6px; border: 1px solid #ced4da; border-radius: 6px; box-sizing: border-box; font-size: 14px; color: #495057; background-color: #f8f9fa; }
            .sf-modal-container select:focus, .sf-modal-container input[type="text"]:focus { outline: none; border-color: #f7b924; background-color: #fff; }
            
            .sliit-modal-actions { margin-top: 25px; display: flex; justify-content: space-between; align-items: center; width: 100%; }
            .sliit-modal-actions-right { display: flex; gap: 10px; }
            
            .sliit-btn { padding: 9px 16px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; white-space: nowrap; }
            .sliit-btn-save { background: #0f3b5f; color: white; }
            .sliit-btn-save:hover { background: #0a2942; }
            .sliit-btn-cancel { background: #e9ecef; color: #495057; }
            .sliit-btn-cancel:hover { background: #dde0e3; }
            .sliit-btn-github { background: #24292e; color: white; }
            .sliit-btn-github:hover { background: #1b1f23; }
            .sliit-btn-reset { background: transparent; color: #dc3545; border: 1px solid #dc3545; padding: 8px 14px; }
            .sliit-btn-reset:hover { background: #dc3545; color: white; }
            
            #sliit-welcome-modal .sliit-modal-actions { display: flex; gap: 12px; justify-content: center; }
            #sliit-welcome-modal .sliit-btn { flex: 1; padding: 10px 16px; } 

            .sf-footer { margin-top: 20px; text-align: center; font-size: 12px; color: #6c757d; }
            .sf-footer a { color: #0f3b5f; text-decoration: none; font-weight: 600; margin: 0 5px; }
            .sf-footer a:hover { text-decoration: underline; }
            
            #sliit-filter-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9998; backdrop-filter: blur(3px); }

            .sf-welcome-header { text-align: center; margin-bottom: 15px; }
            .sf-welcome-header svg { stroke: #0f3b5f; width: 42px; height: 42px; margin-bottom: 10px; }
            .sf-welcome-header h3 { display: block; border: none; font-size: 18px; margin: 0; padding: 0; justify-content: center; color: #212529; }
            .sf-welcome-text { font-size: 13px; color: #495057; line-height: 1.5; margin-bottom: 15px; text-align: center; }
            .sf-welcome-credit { background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 12px; font-size: 12px; color: #495057; margin-bottom: 20px; text-align: left; line-height: 1.6; }
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
            <h3>Filter Configuration</h3>
            <div class="sf-toggle-container">
                <span class="sf-toggle-label">Module Filter <span class="sf-toggle-sub">Enable or disable filtering logic</span></span>
                <label class="sf-switch"><input type="checkbox" id="sf-enabled" ${CONFIG.enabled ? 'checked' : ''}><span class="sf-slider"></span></label>
            </div>
            <div class="sf-toggle-container">
                <span class="sf-toggle-label">Ghost Mode <span class="sf-toggle-sub">Fade filtered items instead of hiding</span></span>
                <label class="sf-switch"><input type="checkbox" id="sf-ghost" ${CONFIG.ghostMode ? 'checked' : ''}><span class="sf-slider"></span></label>
            </div>
            <label class="sf-input-label">Target Campus</label>
            <select id="sf-campus">
                <option value="malabe">Malabe</option>
                <option value="metro">Metro</option>
                <option value="kandy">Kandy</option>
                <option value="kurunegala">Kurunegala</option>
                <option value="matara">Matara</option>
                <option value="jaffna">Jaffna</option>
            </select>
            <label class="sf-input-label">Batch Classification</label>
            <select id="sf-type">
                <option value="weekday">Weekday (WD)</option>
                <option value="weekend">Weekend (WE)</option>
            </select>
            <label class="sf-input-label">Group ID (Optional)</label>
            <input type="text" id="sf-group" placeholder="e.g., 0301 (Leave empty for batch-wide view)">
            
            <div class="sliit-modal-actions">
                <button class="sliit-btn sliit-btn-reset" id="sf-reset">Reset</button>
                <div class="sliit-modal-actions-right">
                    <button class="sliit-btn sliit-btn-cancel" id="sf-cancel">Cancel</button>
                    <button class="sliit-btn sliit-btn-save" id="sf-save">Apply Setup</button>
                </div>
            </div>
            
            <div class="sf-footer">
                <a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues" target="_blank">Documentation & Issues</a>
            </div>
        `;

        // The Welcome Modal
        const welcomeModal = document.createElement('div');
        welcomeModal.className = 'sf-modal-container';
        welcomeModal.id = 'sliit-welcome-modal';
        welcomeModal.innerHTML = `
            <div class="sf-welcome-header">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                <h3>Extension Initialized</h3>
            </div>
            <p class="sf-welcome-text">The SLIIT Courseweb Module Cleaner is now active. This utility seamlessly optimizes your Moodle dashboard by filtering out unassigned contexts and centers.</p>
            <div class="sf-welcome-credit">
                <strong>Release Information</strong><br>
                Version: 6.9.0<br>
                Maintainer: Dulith Divisekara<br>
                License: Open Source (MIT)
            </div>
            <div class="sliit-modal-actions">
                <a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner" target="_blank" class="sliit-btn sliit-btn-github">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg> View Repository
                </a>
                <button class="sliit-btn sliit-btn-save" id="sf-welcome-start">Configure Setup</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(btn);
        document.body.appendChild(settingsModal);
        document.body.appendChild(welcomeModal);

        document.getElementById('sf-campus').value = CONFIG.campus;
        document.getElementById('sf-type').value = CONFIG.batchType;
        document.getElementById('sf-group').value = CONFIG.groupId;

        const showSettings = () => { settingsModal.style.display = 'block'; overlay.style.display = 'block'; };
        const closeModals = () => { settingsModal.style.display = 'none'; welcomeModal.style.display = 'none'; overlay.style.display = 'none'; };

        btn.onclick = showSettings;
        document.getElementById('sf-cancel').onclick = closeModals;
        overlay.onclick = closeModals;

        if (!CONFIG.hasSeenWelcome) {
            welcomeModal.style.display = 'block';
            overlay.style.display = 'block';
            document.getElementById('sf-welcome-start').onclick = () => {
                GM_setValue('hasSeenWelcome', true);
                welcomeModal.style.display = 'none';
                showSettings();
            };
        }

        document.getElementById('sf-reset').onclick = () => {
            if(confirm('Are you sure you want to reset all configurations to default?')) {
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