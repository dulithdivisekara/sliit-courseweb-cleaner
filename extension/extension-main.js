const DEFAULT_CONFIG = {
    hasSeenWelcome: false,
    enabled: true,
    ghostMode: true,
    campus: 'malabe',
    batchType: 'weekday',
    batchTypeShort: 'wd',
    groupId: ''
};

chrome.storage.local.get(DEFAULT_CONFIG, (storedConfig) => {
    window.CONFIG = storedConfig;

    function createUIElement(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    function injectUI() {
        const overlay = createUIElement(`<div id="sliit-filter-overlay"></div>`);
        const btn = createUIElement(`<button id="sliit-filter-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Settings</button>`);

        const settingsModal = createUIElement(`
            <div class="sf-modal-container" id="sliit-filter-modal">
                <h3>Filter Configuration</h3>
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
                <label class="sf-input-label">Group ID (Optional)</label>
                <input type="text" id="sf-group" placeholder="e.g., 0301 (Leave empty for batch-wide view)">
                
                <div class="sliit-modal-actions">
                    <button class="sliit-btn sliit-btn-reset" id="sf-reset">Reset</button>
                    <div class="sliit-modal-actions-right">
                        <button class="sliit-btn sliit-btn-cancel" id="sf-cancel">Cancel</button>
                        <button class="sliit-btn sliit-btn-save" id="sf-save">Apply Setup</button>
                    </div>
                </div>
                <div class="sf-footer"><a href="https://github.com/dulithdivisekara/sliit-courseweb-cleaner/issues" target="_blank">Documentation & Issues</a></div>
            </div>
        `);

        const welcomeModal = createUIElement(`
            <div class="sf-modal-container" id="sliit-welcome-modal">
                <div class="sf-welcome-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    <h3>Extension Initialized</h3>
                </div>
                <p class="sf-welcome-text">The SLIIT Courseweb Module Cleaner is now active.</p>
                <div class="sf-welcome-credit">
                    <strong>Release Information</strong><br>
                    Version: 6.12.0<br>
                    Maintainer: Dulith Divisekara<br>
                    License: Open Source (MIT)
                </div>
                <div class="sliit-modal-actions">
                    <button class="sliit-btn sliit-btn-save" id="sf-welcome-start">Configure Setup</button>
                </div>
            </div>
        `);

        document.body.appendChild(overlay);
        document.body.appendChild(btn);
        document.body.appendChild(settingsModal);
        document.body.appendChild(welcomeModal);

        document.getElementById('sf-campus').value = window.CONFIG.campus;
        document.getElementById('sf-type').value = window.CONFIG.batchType;
        document.getElementById('sf-group').value = window.CONFIG.groupId;

        const showSettings = () => { settingsModal.style.display = 'block'; overlay.style.display = 'block'; };
        const closeModals = () => { settingsModal.style.display = 'none'; welcomeModal.style.display = 'none'; overlay.style.display = 'none'; };

        btn.onclick = showSettings;
        document.getElementById('sf-cancel').onclick = closeModals;
        overlay.onclick = closeModals;

        if (!window.CONFIG.hasSeenWelcome) {
            welcomeModal.style.display = 'block';
            overlay.style.display = 'block';
            document.getElementById('sf-welcome-start').onclick = () => {
                chrome.storage.local.set({ hasSeenWelcome: true }, () => {
                    welcomeModal.style.display = 'none';
                    showSettings();
                });
            };
        }

        document.getElementById('sf-reset').onclick = () => {
            if(confirm('Are you sure you want to reset all configurations to default?')) {
                chrome.storage.local.clear(() => location.reload());
            }
        };

        document.getElementById('sf-save').onclick = () => {
            const newType = document.getElementById('sf-type').value;
            const newSettings = {
                enabled: document.getElementById('sf-enabled').checked,
                ghostMode: document.getElementById('sf-ghost').checked,
                campus: document.getElementById('sf-campus').value,
                batchType: newType,
                batchTypeShort: newType === 'weekend' ? 'we' : 'wd',
                groupId: document.getElementById('sf-group').value.trim()
            };
            chrome.storage.local.set(newSettings, () => location.reload());
        };
    }

    // Initialize UI and Core
    window.addEventListener('load', () => {
        cleanCoursePage();
        injectUI();
    });
    setTimeout(cleanCoursePage, 1000);
    setTimeout(cleanCoursePage, 2500);
});