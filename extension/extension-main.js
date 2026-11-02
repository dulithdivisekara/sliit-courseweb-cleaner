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

function applyDarkReader(isDark) {
    if (typeof DarkReader === 'undefined') return;
    if (isDark) {
        DarkReader.enable({
            brightness: 100,
            contrast: 95,
            sepia: 0
        }, {
            css: `
                /* Maintain SLIIT Courseweb Cleaner branding & UI */
                #sliit-filter-btn {
                    background-color: #f7b924 !important;
                    color: #212529 !important;
                    border: none !important;
                }
                #sliit-filter-btn:hover {
                    background-color: #e5a919 !important;
                }
                #sliit-filter-btn svg {
                    stroke: #212529 !important;
                }
                #sliit-filter-overlay {
                    background: rgba(0, 0, 0, 0.65) !important;
                }
                .sf-modal-container.sf-dark-theme {
                    background-color: #1e1e1e !important;
                    color: #f8f9fa !important;
                    border-top-color: #f7b924 !important;
                }
                #sliit-filter-modal.sf-side-panel.sf-dark-theme {
                    background-color: #1e1e1e !important;
                    color: #f8f9fa !important;
                    border-left-color: #f7b924 !important;
                    border-top: none !important;
                }
                .sf-dark-theme h3 {
                    color: #f8f9fa !important;
                }
                .sf-dark-theme .sf-welcome-header h3 {
                    color: #f8f9fa !important;
                }
                .sf-dark-theme .sf-toggle-label {
                    color: #e9ecef !important;
                }
                .sf-dark-theme .sf-toggle-sub {
                    color: #adb5bd !important;
                }
                .sf-dark-theme .sf-input-label {
                    color: #ced4da !important;
                }
                .sf-dark-theme select, .sf-dark-theme input[type="text"] {
                    background-color: #2b2b2b !important;
                    color: #f8f9fa !important;
                    border-color: #444 !important;
                }
                .sf-dark-theme select:focus, .sf-dark-theme input[type="text"]:focus {
                    background-color: #333 !important;
                    border-color: #f7b924 !important;
                }
                .sf-dark-theme .sliit-btn-save {
                    background-color: #f7b924 !important;
                    color: #212529 !important;
                }
                .sf-dark-theme .sliit-btn-save:hover {
                    background-color: #e5a919 !important;
                }
                .sf-dark-theme .sliit-btn-cancel {
                    background-color: #333 !important;
                    color: #ced4da !important;
                }
                .sf-dark-theme .sliit-btn-cancel:hover {
                    background-color: #444 !important;
                }
                .sf-dark-theme .sf-footer a {
                    color: #f7b924 !important;
                }
                /* CourseWeb logo dark theme inversion */
                #header-logo .logo img {
                    filter: invert(1) !important;
                    mix-blend-mode: screen !important;
                }
                /* Dark scheme for native select elements & dropdowns */
                select, option, .dropdown-menu {
                    color-scheme: dark !important;
                }
                /* High-contrast yellow highlight for notices & announcements (e.g., red text on yellow highlight) */
                :is([data-darkreader-inline-bgcolor][style*="255, 207, 53"],
                    [data-darkreader-inline-bgcolor][style*="ffcf35" i],
                    [data-darkreader-inline-bgcolor][style*="255, 255, 0"],
                    [data-darkreader-inline-bgcolor][style*="ffff00" i],
                    [data-darkreader-inline-bgcolor][style*="yellow" i],
                    [data-darkreader-inline-bgcolor][style*="--darkreader-background-ffcf35"],
                    [style*="background-color: rgb(255, 207, 53)"],
                    [style*="background-color: #ffcf35" i],
                    [style*="background-color: rgb(255, 255, 0)"],
                    [style*="background-color: #ffff00" i],
                    [style*="background-color: yellow" i],
                    [style*="background: rgb(255, 207, 53)"],
                    [style*="background: #ffcf35" i],
                    [style*="background: rgb(255, 255, 0)"],
                    [style*="background: #ffff00" i]),
                :is([style*="239, 69, 64"], [style*="ef4540" i], [style*="255, 0, 0"], [style*="red" i]) :is([style*="255, 207, 53"], [style*="ffcf35" i], [style*="255, 255, 0"], [style*="yellow" i]),
                :is([style*="255, 207, 53"], [style*="ffcf35" i], [style*="255, 255, 0"], [style*="yellow" i]) :is([style*="239, 69, 64"], [style*="ef4540" i], [style*="255, 0, 0"], [style*="red" i]),
                :is([style*="239, 69, 64"], [style*="ef4540" i], [style*="255, 0, 0"], [style*="red" i]):is([style*="255, 207, 53"], [style*="ffcf35" i], [style*="255, 255, 0"], [style*="yellow" i]) {
                    background-color: #f7b924 !important;
                    color: #141517 !important;
                    padding: 1px 5px !important;
                    border-radius: 3px !important;
                    box-decoration-break: clone !important;
                    -webkit-box-decoration-break: clone !important;
                    text-decoration-color: #141517 !important;
                }
                :is([data-darkreader-inline-bgcolor][style*="255, 207, 53"],
                    [data-darkreader-inline-bgcolor][style*="ffcf35" i],
                    [data-darkreader-inline-bgcolor][style*="255, 255, 0"],
                    [data-darkreader-inline-bgcolor][style*="ffff00" i],
                    [data-darkreader-inline-bgcolor][style*="yellow" i],
                    [data-darkreader-inline-bgcolor][style*="--darkreader-background-ffcf35"],
                    [style*="background-color: rgb(255, 207, 53)"],
                    [style*="background-color: #ffcf35" i],
                    [style*="background-color: rgb(255, 255, 0)"],
                    [style*="background-color: #ffff00" i],
                    [style*="background-color: yellow" i],
                    [style*="background: rgb(255, 207, 53)"],
                    [style*="background: #ffcf35" i],
                    [style*="background: rgb(255, 255, 0)"],
                    [style*="background: #ffff00" i]) *,
                :is([style*="239, 69, 64"], [style*="ef4540" i], [style*="255, 0, 0"], [style*="red" i]) :is([style*="255, 207, 53"], [style*="ffcf35" i], [style*="255, 255, 0"], [style*="yellow" i]) *,
                :is([style*="255, 207, 53"], [style*="ffcf35" i], [style*="255, 255, 0"], [style*="yellow" i]) :is([style*="239, 69, 64"], [style*="ef4540" i], [style*="255, 0, 0"], [style*="red" i]) *,
                :is([style*="239, 69, 64"], [style*="ef4540" i], [style*="255, 0, 0"], [style*="red" i]):is([style*="255, 207, 53"], [style*="ffcf35" i], [style*="255, 255, 0"], [style*="yellow" i]) * {
                    color: #141517 !important;
                    text-decoration-color: #141517 !important;
                }
                u:has([data-darkreader-inline-bgcolor][style*="255, 207, 53"]),
                u:has([data-darkreader-inline-bgcolor][style*="ffcf35" i]),
                u:has([data-darkreader-inline-bgcolor][style*="255, 255, 0"]),
                u:has([style*="background-color: rgb(255, 207, 53)"]),
                u:has([style*="background-color: #ffcf35" i]) {
                    text-decoration-color: #141517 !important;
                }
            `,
            ignoreImageAnalysis: ['#header-logo .logo img'],
            ignoreInlineStyle: [],
            disableStyleSheetsProxy: true,
            disableCustomElementRegistryProxy: true,
            disableProxy: true
        });
    } else {
        DarkReader.disable();
    }
}

function setAntiFlashTheme(isDark) {
    if (isDark) {
        if (document.documentElement) {
            document.documentElement.classList.add('sf-dark-mode-preload');
            document.documentElement.style.backgroundColor = '#181a1b';
            document.documentElement.style.colorScheme = 'dark';
        }
    } else {
        if (document.documentElement) {
            document.documentElement.classList.remove('sf-dark-mode-preload');
            if (document.documentElement.style.backgroundColor === 'rgb(24, 26, 27)') {
                document.documentElement.style.backgroundColor = '';
            }
            if (document.documentElement.style.colorScheme === 'dark') {
                document.documentElement.style.colorScheme = '';
            }
        }
    }
}

// 0ms synchronous anti-flash execution at document_start before async storage resolves
let cachedDarkMode = false;
try {
    cachedDarkMode = localStorage.getItem('sf_darkMode') === 'true';
} catch (e) {}

if (cachedDarkMode) {
    setAntiFlashTheme(true);
    applyDarkReader(true);
}

storageApi.get(DEFAULT_CONFIG, (syncConfig) => {
    chrome.storage.local.get('remoteRules', (localData) => {
        window.CONFIG = syncConfig;
        window.REMOTE_RULES = localData.remoteRules || null;

        // Keep synchronous localStorage in sync for instant future navigations
        try {
            localStorage.setItem('sf_darkMode', window.CONFIG.darkMode ? 'true' : 'false');
        } catch (e) {}

        if (window.CONFIG.darkMode) {
            setAntiFlashTheme(true);
            applyDarkReader(true);
        } else {
            setAntiFlashTheme(false);
            applyDarkReader(false);
        }

        function isCourseViewPage() {
            const path = window.location.pathname || '';
            return path.includes('/course/view.php');
        }

        let showSettings = null;
        let updateThemeUI = null;

        function createUIElement(htmlString) {
            const doc = new DOMParser().parseFromString(htmlString.trim(), 'text/html');
            return doc.body.firstElementChild;
        }

        function injectUI() {
            const overlay = createUIElement(`<div id="sliit-filter-overlay"></div>`);
            const btn = createUIElement(`<button id="sliit-filter-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></button>`);

            const settingsModal = createUIElement(`
                <div class="sf-modal-container sf-side-panel" id="sliit-filter-modal">
                    <h3>Filter Configuration 
                        <div style="display:flex; align-items:center; gap:12px; margin-left:auto;">
                            <button id="sf-theme-toggle" style="background:none; border:none; cursor:pointer; padding:0; display:flex; align-items:center; color:inherit;" title="Toggle Theme">
                                <svg id="sf-theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
                            </button>
                            <button id="sf-close-panel" style="background:none; border:none; cursor:pointer; padding:0; display:flex; align-items:center; color:inherit;" title="Close Panel">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
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
                        <option value="deakin">Deakin</option>
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
                        <a href="https://sliit-courseweb-cleaner-web.pages.dev/" target="_blank">Documentation</a> | 
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
                        Version: 7.1.0<br>
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
            updateThemeUI = (isDark) => {
                applyDarkReader(isDark);
                if (isDark) {
                    settingsModal.classList.add('sf-dark-theme');
                    welcomeModal.classList.add('sf-dark-theme');
                    if (themeIcon) {
                        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
                    }
                } else {
                    settingsModal.classList.remove('sf-dark-theme');
                    welcomeModal.classList.remove('sf-dark-theme');
                    if (themeIcon) {
                        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
                    }
                }
            };
            updateThemeUI(window.CONFIG.darkMode);

            const toggleDarkTheme = (forcedState) => {
                const nextState = typeof forcedState === 'boolean' ? forcedState : !window.CONFIG.darkMode;
                window.CONFIG.darkMode = nextState;
                try {
                    localStorage.setItem('sf_darkMode', nextState ? 'true' : 'false');
                } catch (e) {}
                setAntiFlashTheme(nextState);
                updateThemeUI(window.CONFIG.darkMode);
                storageApi.set({ darkMode: window.CONFIG.darkMode });
            };

            document.getElementById('sf-theme-toggle').onclick = () => toggleDarkTheme();

            document.getElementById('sf-campus').value = window.CONFIG.campus;
            document.getElementById('sf-type').value = window.CONFIG.batchType;
            document.getElementById('sf-group').value = window.CONFIG.groupId;
            document.getElementById('sf-whitelist').value = window.CONFIG.customWhitelist || '';
            document.getElementById('sf-blacklist').value = window.CONFIG.customBlacklist || '';

            const GEAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
            const CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

            const isPanelOpen = () => settingsModal.classList.contains('open');

            const openSidePanel = () => {
                settingsModal.classList.add('open');
                overlay.style.display = 'block';
                btn.classList.add('open');
                btn.title = 'Close Configuration';
                btn.innerHTML = CLOSE_SVG;
            };

            const closeSidePanel = () => {
                settingsModal.classList.remove('open');
                overlay.style.display = 'none';
                welcomeModal.style.display = 'none';
                btn.classList.remove('open');
                btn.title = 'Filter Configuration';
                btn.innerHTML = GEAR_SVG;
            };

            const toggleSidePanel = () => {
                if (isPanelOpen()) {
                    closeSidePanel();
                } else {
                    openSidePanel();
                }
            };

            showSettings = openSidePanel;
            btn.onclick = toggleSidePanel;
            const closeBtn = document.getElementById('sf-close-panel');
            if (closeBtn) closeBtn.onclick = closeSidePanel;
            document.getElementById('sf-cancel').onclick = closeSidePanel;
            overlay.onclick = closeSidePanel;

            if (!window.CONFIG.hasSeenWelcome) {
                welcomeModal.style.display = 'block';
                overlay.style.display = 'block';
                document.getElementById('sf-welcome-start').onclick = () => {
                    storageApi.set({ hasSeenWelcome: true }, () => {
                        welcomeModal.style.display = 'none';
                        openSidePanel();
                    });
                };
            }

            document.getElementById('sf-reset').onclick = () => {
                if(confirm('Are you sure you want to reset all configurations to default?')) {
                    try {
                        localStorage.removeItem('sf_darkMode');
                    } catch (e) {}
                    setAntiFlashTheme(false);
                    applyDarkReader(false);
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

        // Global runtime listener for toolbar popup across all Courseweb pages
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.action === 'openSettingsModal') {
                    if (typeof showSettings === 'function') {
                        showSettings();
                    }
                    sendResponse({ success: true });
                } else if (request.action === 'configUpdated') {
                    storageApi.get(DEFAULT_CONFIG, (syncConfig) => {
                        window.CONFIG = syncConfig;
                        try {
                            localStorage.setItem('sf_darkMode', window.CONFIG.darkMode ? 'true' : 'false');
                        } catch (e) {}
                        setAntiFlashTheme(window.CONFIG.darkMode);
                        applyDarkReader(window.CONFIG.darkMode);
                        if (isCourseViewPage()) {
                            if (typeof updateThemeUI === 'function') {
                                updateThemeUI(window.CONFIG.darkMode);
                            }
                            runClean();
                            const enabledEl = document.getElementById('sf-enabled');
                            const ghostEl = document.getElementById('sf-ghost');
                            const campusEl = document.getElementById('sf-campus');
                            const typeEl = document.getElementById('sf-type');
                            const groupEl = document.getElementById('sf-group');
                            if (enabledEl) enabledEl.checked = window.CONFIG.enabled;
                            if (ghostEl) ghostEl.checked = window.CONFIG.ghostMode;
                            if (campusEl) campusEl.value = window.CONFIG.campus;
                            if (typeEl) typeEl.value = window.CONFIG.batchType;
                            if (groupEl) groupEl.value = window.CONFIG.groupId;
                        }
                    });
                    sendResponse({ success: true });
                }
            });
        }

        // Initialize UI and Core
        let isCleaning = false;
        function runClean() {
            if (!isCourseViewPage()) return;
            if (isCleaning) return;
            isCleaning = true;
            requestAnimationFrame(() => {
                cleanCoursePage();
                isCleaning = false;
            });
        }

        function init() {
            // Apply filtering and floating UI only on course view pages
            // This strictly protects homepage (/my/), course selectors (/my/courses.php), etc.
            if (isCourseViewPage()) {
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
            }
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            init();
        } else {
            window.addEventListener('DOMContentLoaded', init, { once: true });
        }
    });
});