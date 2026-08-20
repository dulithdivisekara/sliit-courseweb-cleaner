const DEFAULT_CONFIG = {
    hasSeenWelcome: false,
    darkMode: false,
    enabled: true,
    ghostMode: true,
    campus: 'malabe',
    batchType: 'weekday',
    batchTypeShort: 'wd',
    groupId: '',
    customWhitelist: '',
    customBlacklist: ''
};

// Fallback logic if chrome.storage.sync is unavailable (e.g. some obscure browsers)
const storageApi = chrome.storage.sync ? chrome.storage.sync : chrome.storage.local;

storageApi.get(DEFAULT_CONFIG, (syncConfig) => {
    chrome.storage.local.get('remoteRules', (localData) => {
        window.CONFIG = syncConfig;
        window.REMOTE_RULES = localData.remoteRules || null;

        function createUIElement(htmlString) {
            const div = document.createElement('div');
            div.innerHTML = htmlString.trim();
            return div.firstChild;
        }

        function injectUI() {
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
                storageApi.set({ darkMode: window.CONFIG.darkMode });
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
                    storageApi.set({ hasSeenWelcome: true }, () => {
                        welcomeModal.style.display = 'none';
                        showSettings();
                    });
                };
            }

            document.getElementById('sf-reset').onclick = () => {
                if(confirm('Are you sure you want to reset all configurations to default?')) {
                    storageApi.clear(() => location.reload());
                }
            };

            document.getElementById('sf-save').onclick = () => {
                const newType = document.getElementById('sf-type').value;
                const newSettings = {
                    enabled: document.getElementById('sf-enabled').checked,
                    darkMode: window.CONFIG.darkMode,
                    ghostMode: document.getElementById('sf-ghost').checked,
                    campus: document.getElementById('sf-campus').value,
                    batchType: newType,
                    batchTypeShort: newType === 'weekend' ? 'we' : 'wd',
                    groupId: document.getElementById('sf-group').value.trim(),
                    customWhitelist: document.getElementById('sf-whitelist').value.trim(),
                    customBlacklist: document.getElementById('sf-blacklist').value.trim()
                };
                storageApi.set(newSettings, () => location.reload());
            };
        }

        // Initialize UI and Core
        let isCleaning = false;
        function runClean() {
            if (isCleaning) return;
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
    });
});