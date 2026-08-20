// ==UserScript==
// @name         SLIIT Courseweb Module Cleaner
// @namespace    http://tampermonkey.net/
// @version      7.0.0
// @description  A professional, context-aware module filter for SLIIT Courseweb.
// @author       Dulith Divisekara
// @match        *://courseweb.sliit.lk/course/view.php*
// @updateURL    https://github.com/dulithdivisekara/sliit-courseweb-cleaner/raw/refs/heads/main/dist/sliit-courseweb-cleaner.user.js
// @downloadURL  https://github.com/dulithdivisekara/sliit-courseweb-cleaner/raw/refs/heads/main/dist/sliit-courseweb-cleaner.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// ==/UserScript==

window.CONFIG = {
    hasSeenWelcome: GM_getValue('hasSeenWelcome', false),
    darkMode: GM_getValue('darkMode', false),
    enabled: GM_getValue('enabled', true),
    ghostMode: GM_getValue('ghostMode', true),
    campus: GM_getValue('campus', 'malabe'),
    batchType: GM_getValue('batchType', 'weekday'),
    batchTypeShort: GM_getValue('batchTypeShort', 'wd'),
    groupId: GM_getValue('groupId', ''),
    customWhitelist: GM_getValue('customWhitelist', ''),
    customBlacklist: GM_getValue('customBlacklist', '')
};
window.REMOTE_RULES = null;

function createUIElement(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function injectUI() {
    GM_addStyle(`
        #sliit-filter-btn { position: fixed; top: 150px; right: 0; background-color: #f7b924; color: #212529; border: none; border-radius: 6px 0 0 6px; padding: 10px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: -2px 2px 6px rgba(0,0,0,0.15); z-index: 9999; transition: all 0.2s ease-in-out; display: flex; align-items: center; gap: 8px; }
        #sliit-filter-btn:hover { background-color: #e5a919; padding-right: 14px; }
        #sliit-filter-btn svg { width: 16px; height: 16px; margin: 0; padding: 0; display: block; }
        .sf-modal-container { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ffffff; padding: 24px; border-radius: 8px; border-top: 4px solid #0f3b5f; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 10000; width: 340px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; max-height: 85vh; overflow-y: auto; }
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
        .sf-modal-container::-webkit-scrollbar { width: 8px; }
        .sf-modal-container::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .sf-modal-container::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
        .sf-modal-container::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
        .sf-advanced-details { margin-top: 15px; border: 1px solid #dee2e6; border-radius: 6px; padding: 10px; background: #f8f9fa; cursor: pointer; }
        .sf-advanced-details summary { font-size: 12px; font-weight: 600; color: #0f3b5f; outline: none; }
        .sf-advanced-details div { cursor: default; }

        .sf-dark-theme { background: #1e1e1e; border-top-color: #f7b924; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        .sf-dark-theme h3 { color: #f8f9fa; border-bottom-color: #333; }
        .sf-dark-theme .sf-welcome-header h3 { color: #f8f9fa; }
        .sf-dark-theme .sf-toggle-label { color: #e9ecef; }
        .sf-dark-theme .sf-toggle-sub { color: #adb5bd; }
        .sf-dark-theme .sf-toggle-container { border-bottom-color: #333; }
        .sf-dark-theme .sf-input-label { color: #ced4da; }
        .sf-dark-theme select, .sf-dark-theme input[type="text"] { background-color: #2b2b2b; color: #f8f9fa; border-color: #444; }
        .sf-dark-theme select:focus, .sf-dark-theme input[type="text"]:focus { background-color: #333; border-color: #f7b924; }
        .sf-dark-theme .sf-slider { background-color: #495057; }
        .sf-dark-theme .sf-slider:before { background-color: #ced4da; }
        .sf-dark-theme input:checked + .sf-slider { background-color: #f7b924; }
        .sf-dark-theme input:checked + .sf-slider:before { background-color: #fff; }
        .sf-dark-theme .sliit-btn-cancel { background: #333; color: #ced4da; }
        .sf-dark-theme .sliit-btn-cancel:hover { background: #444; }
        .sf-dark-theme .sliit-btn-save { background: #f7b924; color: #212529; }
        .sf-dark-theme .sliit-btn-save:hover { background: #e5a919; }
        .sf-dark-theme .sf-footer { color: #adb5bd; }
        .sf-dark-theme .sf-footer a { color: #f7b924; }
        .sf-dark-theme .sf-advanced-details { background: #2b2b2b; border-color: #444; }
        .sf-dark-theme .sf-advanced-details summary { color: #f7b924; }
        .sf-dark-theme .sf-welcome-text { color: #ced4da; }
        .sf-dark-theme .sf-welcome-credit { background: #2b2b2b; border-color: #444; color: #ced4da; }
        .sf-dark-theme .sf-welcome-header svg { stroke: #f7b924; }
        .sf-dark-theme::-webkit-scrollbar-track { background: #2b2b2b; }
        .sf-dark-theme::-webkit-scrollbar-thumb { background: #555; }
        .sf-dark-theme::-webkit-scrollbar-thumb:hover { background: #777; }
    `);

    const overlay = createUIElement(`<div id="sliit-filter-overlay"></div>`);
    const btn = createUIElement(`<button id="sliit-filter-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></button>`);

    const settingsModal = createUIElement(`
        <div class="sf-modal-container" id="sliit-filter-modal">
            <h3>Filter Configuration 
                <button id="sf-theme-toggle" style="background:none; border:none; cursor:pointer; margin-left:auto; padding:0; display:flex; align-items:center; color:inherit;" title="Toggle Theme">
                    <svg id="sf-theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
                </button>
            </h3>
            <div class="sf-toggle-container">
                <span class="sf-toggle-label">Module Filter <span class="sf-toggle-sub">Enable or disable filtering logic</span></span>
                <label class="sf-switch"><input type="checkbox" id="sf-enabled" ${window.CONFIG.enabled ? 'checked' : ''}><span class="sf-slider"></span></label>
            </div>
            <div class="sf-toggle-container">
                <span class="sf-toggle-label">Ghost Mode <span class="sf-toggle-sub">Fade filtered items instead of hiding</span></span>
                <label class="sf-switch"><input type="checkbox" id="sf-ghost" ${window.CONFIG.ghostMode ? 'checked' : ''}><span class="sf-slider"></span></label>
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
            
            <details class="sf-advanced-details">
                <summary>Advanced Settings</summary>
                <div style="margin-top: 10px;">
                    <label class="sf-input-label">Group ID (Optional)</label>
                    <input type="text" id="sf-group" placeholder="e.g., 0301 (Leave empty for batch-wide view)">
                    
                    <label class="sf-input-label">Custom Whitelist (Comma separated)</label>
                    <input type="text" id="sf-whitelist" placeholder="e.g., Assignment, Revision">
                    
                    <label class="sf-input-label">Custom Blacklist (Comma separated)</label>
                    <input type="text" id="sf-blacklist" placeholder="e.g., Old Syllabus, Makeup">
                </div>
            </details>
            
            <div class="sliit-modal-actions">
                <button class="sliit-btn sliit-btn-reset" id="sf-reset">Reset</button>
                <div class="sliit-modal-actions-right">
                    <button class="sliit-btn sliit-btn-cancel" id="sf-cancel">Cancel</button>
                    <button class="sliit-btn sliit-btn-save" id="sf-save">Apply Setup</button>
                </div>
            </div>
            <div class="sf-footer">
                <a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues" target="_blank">Documentation</a> | 
                <a href="https://t.me/dulithdivisekara" target="_blank">Contact Dev</a>
            </div>
        </div>
    `);

    const welcomeModal = createUIElement(`
        <div class="sf-modal-container" id="sliit-welcome-modal">
            <div class="sf-welcome-header">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                <h3>Extension Initialized</h3>
            </div>
            <p class="sf-welcome-text">The SLIIT Courseweb Module Cleaner is now active. This utility seamlessly optimizes your Moodle dashboard by filtering out unassigned contexts and centers.</p>
            <div class="sf-welcome-credit">
                <strong>Release Information</strong><br>
                Version: 7.0.0<br>
                Maintainer: Dulith Divisekara<br>
                License: Open Source (MIT)
            </div>
            <div class="sliit-modal-actions">
                <a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner" target="_blank" class="sliit-btn sliit-btn-github">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg> View Repository
                </a>
                <button class="sliit-btn sliit-btn-save" id="sf-welcome-start">Configure Setup</button>
            </div>
        </div>
    `);

    document.body.appendChild(overlay);
    document.body.appendChild(btn);
    document.body.appendChild(settingsModal);
    document.body.appendChild(welcomeModal);

    const themeIcon = document.getElementById('sf-theme-icon');
    const updateThemeUI = (isDark) => {
        if (isDark) {
            settingsModal.classList.add('sf-dark-theme');
            welcomeModal.classList.add('sf-dark-theme');
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        } else {
            settingsModal.classList.remove('sf-dark-theme');
            welcomeModal.classList.remove('sf-dark-theme');
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    };
    updateThemeUI(window.CONFIG.darkMode);

    document.getElementById('sf-theme-toggle').onclick = () => {
        window.CONFIG.darkMode = !window.CONFIG.darkMode;
        updateThemeUI(window.CONFIG.darkMode);
        GM_setValue('darkMode', window.CONFIG.darkMode);
    };

    document.getElementById('sf-campus').value = window.CONFIG.campus;
    document.getElementById('sf-type').value = window.CONFIG.batchType;
    document.getElementById('sf-group').value = window.CONFIG.groupId;
    document.getElementById('sf-whitelist').value = window.CONFIG.customWhitelist || '';
    document.getElementById('sf-blacklist').value = window.CONFIG.customBlacklist || '';

    const showSettings = () => { settingsModal.style.display = 'block'; overlay.style.display = 'block'; };
    const closeModals = () => { settingsModal.style.display = 'none'; welcomeModal.style.display = 'none'; overlay.style.display = 'none'; };

    btn.onclick = showSettings;
    document.getElementById('sf-cancel').onclick = closeModals;
    overlay.onclick = closeModals;

    if (!window.CONFIG.hasSeenWelcome) {
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
            GM_deleteValue('darkMode');
            GM_deleteValue('enabled');
            GM_deleteValue('ghostMode');
            GM_deleteValue('campus');
            GM_deleteValue('batchType');
            GM_deleteValue('batchTypeShort');
            GM_deleteValue('groupId');
            GM_deleteValue('customWhitelist');
            GM_deleteValue('customBlacklist');
            location.reload();
        }
    };

    document.getElementById('sf-save').onclick = () => {
        const newType = document.getElementById('sf-type').value;
        GM_setValue('enabled', document.getElementById('sf-enabled').checked);
        GM_setValue('darkMode', window.CONFIG.darkMode);
        GM_setValue('ghostMode', document.getElementById('sf-ghost').checked);
        GM_setValue('campus', document.getElementById('sf-campus').value);
        GM_setValue('batchType', newType);
        GM_setValue('batchTypeShort', newType === 'weekend' ? 'we' : 'wd');
        GM_setValue('groupId', document.getElementById('sf-group').value.trim());
        GM_setValue('customWhitelist', document.getElementById('sf-whitelist').value.trim());
        GM_setValue('customBlacklist', document.getElementById('sf-blacklist').value.trim());
        GM_setValue('hasSeenWelcome', true);
        location.reload();
    };
}

let isCleaning = false;
function runClean() {
    // Abort if already cleaning OR if the user hasn't finished the initial setup
    if (isCleaning || !window.CONFIG.hasSeenWelcome) return;
    isCleaning = true;
    requestAnimationFrame(() => {
        cleanCoursePage();
        isCleaning = false;
    });
}

window.addEventListener('load', () => {
    runClean();
    injectUI();

    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;
        for (let m of mutations) {
            if (m.addedNodes.length > 0 && m.target.className !== 'sf-modal-container') {
                shouldRun = true;
                break;
            }
        }
        if (shouldRun) runClean();
    });

    const courseContent = document.querySelector('.course-content') || document.body;
    observer.observe(courseContent, { childList: true, subtree: true });
});