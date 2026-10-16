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

const storageApi = (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync)
    ? chrome.storage.sync
    : ((typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) ? chrome.storage.local : null);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('popup-container');
    const themeToggleBtn = document.getElementById('popup-theme-toggle');
    const themeIcon = document.getElementById('popup-theme-icon');

    const enabledToggle = document.getElementById('pop-enabled');
    const ghostToggle = document.getElementById('pop-ghost');
    const campusSelect = document.getElementById('pop-campus');
    const typeSelect = document.getElementById('pop-type');
    const groupInput = document.getElementById('pop-group');

    const btnOpenModal = document.getElementById('btn-open-modal');
    const btnSaveApply = document.getElementById('btn-save-apply');

    let activeCoursewebTab = null;
    let currentConfig = { ...DEFAULT_CONFIG };

    // Update Popup Dark/Light Theme UI
    function setPopupTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('popup-dark');
            document.body.classList.add('popup-dark');
            container.classList.add('popup-dark');
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        } else {
            document.documentElement.classList.remove('popup-dark');
            document.body.classList.remove('popup-dark');
            container.classList.remove('popup-dark');
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    }

    // Save and Notify Active Tab
    function saveSettings(notifyTab = true) {
        if (!storageApi) return;
        const newBatchType = typeSelect.value;
        currentConfig.enabled = enabledToggle.checked;
        currentConfig.ghostMode = ghostToggle.checked;
        currentConfig.campus = campusSelect.value;
        currentConfig.batchType = newBatchType;
        currentConfig.batchTypeShort = newBatchType === 'weekend' ? 'we' : 'wd';
        currentConfig.groupId = groupInput.value.trim();

        storageApi.set(currentConfig, () => {
            if (notifyTab && activeCoursewebTab && activeCoursewebTab.id) {
                chrome.tabs.sendMessage(activeCoursewebTab.id, { action: 'configUpdated' }).catch(() => {});
            }
        });
    }

    // Detect Active Tab Status (for in-page modal access)
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs[0]) {
                const tab = tabs[0];
                const url = tab.url || '';
                if (url.includes('/course/view.php')) {
                    activeCoursewebTab = tab;
                    if (btnOpenModal) {
                        btnOpenModal.disabled = false;
                        btnOpenModal.title = 'Open settings modal on this course page';
                    }
                } else if (url.includes('courseweb.sliit.lk')) {
                    activeCoursewebTab = tab;
                    if (btnOpenModal) {
                        btnOpenModal.disabled = true;
                        btnOpenModal.title = 'In-page modal is available inside course pages';
                    }
                } else {
                    if (btnOpenModal) {
                        btnOpenModal.disabled = true;
                        btnOpenModal.title = 'Open SLIIT Courseweb to configure';
                    }
                }
            }
        });
    }

    // Load Configuration
    if (storageApi) {
        storageApi.get(DEFAULT_CONFIG, (syncConfig) => {
            currentConfig = syncConfig || { ...DEFAULT_CONFIG };
            setPopupTheme(currentConfig.darkMode);

            enabledToggle.checked = currentConfig.enabled;
            ghostToggle.checked = currentConfig.ghostMode;
            campusSelect.value = currentConfig.campus || 'malabe';
            typeSelect.value = currentConfig.batchType || 'weekday';
            groupInput.value = currentConfig.groupId || '';
        });
    }

    // Toggle Theme
    themeToggleBtn.addEventListener('click', () => {
        currentConfig.darkMode = !currentConfig.darkMode;
        setPopupTheme(currentConfig.darkMode);
        if (storageApi) {
            storageApi.set({ darkMode: currentConfig.darkMode }, () => {
                if (activeCoursewebTab && activeCoursewebTab.id) {
                    chrome.tabs.sendMessage(activeCoursewebTab.id, { action: 'configUpdated' }).catch(() => {});
                }
            });
        }
    });

    // In-Page Modal Action
    if (btnOpenModal) {
        btnOpenModal.addEventListener('click', () => {
            if (activeCoursewebTab && activeCoursewebTab.id) {
                chrome.tabs.sendMessage(activeCoursewebTab.id, { action: 'openSettingsModal' }).catch(() => {});
                window.close();
            }
        });
    }

    // Apply Setup Action
    if (btnSaveApply) {
        btnSaveApply.addEventListener('click', () => {
            saveSettings(true);
            const originalHtml = btnSaveApply.innerHTML;
            btnSaveApply.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Applied!';
            setTimeout(() => {
                btnSaveApply.innerHTML = originalHtml;
            }, 1200);
        });
    }
});
