const DEFAULT_CONFIG = {
    hasSeenWelcome: false,
    darkMode: false,
    enabled: true,
    ghostMode: true,
    hideSubmissions: false,
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
                #sf-badge-count {
                    background-color: #0f3b5f !important;
                    color: #ffffff !important;
                    border-color: #181a1b !important;
                }
                #sliit-filter-overlay {
                    background: rgba(0, 0, 0, 0.28) !important;
                }
                #sliit-filter-overlay.sf-welcome-backdrop {
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
                .sf-dark-theme .sf-status-banner {
                    background-color: #26292e !important;
                    border-color: #3f444c !important;
                    color: #e2e8f0 !important;
                }
                .sf-dark-theme .sf-peek-btn {
                    background-color: #33373d !important;
                    color: #f8fafc !important;
                    border-color: #4b5563 !important;
                }
                .sf-dark-theme .sf-peek-btn.active {
                    background-color: #f7b924 !important;
                    color: #141517 !important;
                    border-color: #f7b924 !important;
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
                /* CourseWeb logo dark theme inversion (monochrome white on dark header) */
                #header-logo .logo img {
                    filter: invert(1) grayscale(1) brightness(3) contrast(100) !important;
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
                /* Smooth out Moodle activity icons & drawer toggles during initial DarkReader pass */
                img.activityicon, .activityiconcontainer, .activityiconcontainer img {
                    background-color: transparent !important;
                }
                .drawer-toggles .drawer-toggler .btn {
                    background-color: #242729 !important;
                    border-color: #383c42 !important;
                    color: #e2e8f0 !important;
                }
                .activity-item, .course-section-header, .section-item {
                    border-color: #2e3236 !important;
                }
                u:has([data-darkreader-inline-bgcolor][style*="255, 207, 53"]),
                u:has([data-darkreader-inline-bgcolor][style*="ffcf35" i]),
                u:has([data-darkreader-inline-bgcolor][style*="255, 255, 0"]),
                u:has([style*="background-color: rgb(255, 207, 53)"]),
                u:has([style*="background-color: #ffcf35" i]) {
                    text-decoration-color: #141517 !important;
                }
            `,
            ignoreImageAnalysis: ['#header-logo .logo img', 'img.activityicon', '.activityiconcontainer img', '.userpicture'],
            ignoreInlineStyle: [],
            disableStyleSheetsProxy: false,
            disableCustomElementRegistryProxy: true,
            disableProxy: false
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
        const clearPreload = () => {
            if (document.documentElement) {
                document.documentElement.classList.remove('sf-dark-mode-preload');
            }
        };
        if (document.readyState === 'complete') {
            clearPreload();
        } else {
            window.addEventListener('load', clearPreload, { once: true });
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
let cachedConfig = null;
try {
    cachedDarkMode = localStorage.getItem('sf_darkMode') === 'true';
    const rawCached = localStorage.getItem('sf_config_cache');
    if (rawCached) cachedConfig = JSON.parse(rawCached);
} catch (e) {}

if (cachedConfig) {
    window.CONFIG = { ...DEFAULT_CONFIG, ...cachedConfig };
}

if (cachedDarkMode || (window.CONFIG && window.CONFIG.darkMode)) {
    setAntiFlashTheme(true);
    applyDarkReader(true);
}

// Run an immediate synchronous filter pass as soon as DOM parses (even before async storage resolves)
if (window.CONFIG && window.CONFIG.enabled && window.CONFIG.hasSeenWelcome) {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        cleanCoursePage();
    } else {
        window.addEventListener('DOMContentLoaded', () => cleanCoursePage(), { once: true });
    }
}

storageApi.get(DEFAULT_CONFIG, (syncConfig) => {
    chrome.storage.local.get('remoteRules', (localData) => {
        window.CONFIG = syncConfig;
        window.REMOTE_RULES = localData.remoteRules || null;
        window.SF_PEEK_ACTIVE = false;

        // Keep synchronous localStorage in sync for instant future navigations
        try {
            localStorage.setItem('sf_darkMode', window.CONFIG.darkMode ? 'true' : 'false');
            localStorage.setItem('sf_config_cache', JSON.stringify(window.CONFIG));
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
            return path.includes('/course/view.php') || path.includes('/course/section.php');
        }

        let showSettings = null;
        let updateThemeUI = null;

        function createUIElement(htmlString) {
            const doc = new DOMParser().parseFromString(htmlString.trim(), 'text/html');
            return doc.body.firstElementChild;
        }

        window.updateFilterStatsUI = function(stats) {
            const badgeEl = document.getElementById('sf-badge-count');
            const dotEl = document.getElementById('sf-status-dot');
            const textEl = document.getElementById('sf-status-text');
            const peekBtn = document.getElementById('sf-peek-btn');

            if (!window.CONFIG || !window.CONFIG.enabled || !window.CONFIG.hasSeenWelcome) {
                if (badgeEl) badgeEl.classList.remove('visible');
                if (dotEl) dotEl.className = 'sf-status-dot paused';
                if (textEl) textEl.textContent = 'Module filter paused';
                if (peekBtn) peekBtn.style.display = 'none';
                return;
            }

            const count = stats ? stats.hidden : 0;
            if (badgeEl) {
                if (count > 0) {
                    badgeEl.textContent = String(count);
                    badgeEl.classList.add('visible');
                } else {
                    badgeEl.classList.remove('visible');
                }
            }

            if (peekBtn) {
                peekBtn.style.display = count > 0 ? 'inline-block' : 'none';
                if (window.SF_PEEK_ACTIVE) {
                    peekBtn.classList.add('active');
                    peekBtn.textContent = 'Hide Again';
                } else {
                    peekBtn.classList.remove('active');
                    peekBtn.textContent = 'Peek Hidden';
                }
            }

            if (dotEl && textEl) {
                if (window.SF_PEEK_ACTIVE && count > 0) {
                    dotEl.className = 'sf-status-dot peeking';
                    textEl.textContent = `Peeking ${count} hidden item${count === 1 ? '' : 's'}`;
                } else {
                    dotEl.className = 'sf-status-dot';
                    textEl.textContent = `${count} item${count === 1 ? '' : 's'} filtered on page`;
                }
            }
        };

        function injectUI() {
            if (document.getElementById('sliit-filter-btn')) return;
            const GEAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
            const CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

            const overlay = createUIElement(`<div id="sliit-filter-overlay"></div>`);
            const btn = createUIElement(`<button id="sliit-filter-btn" title="Filter Configuration"><span id="sf-btn-icon" style="display:flex;align-items:center;justify-content:center;">${GEAR_SVG}</span><span id="sf-badge-count">0</span></button>`);

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
                    <div class="sf-status-banner" id="sf-status-banner">
                        <div class="sf-status-info">
                            <span class="sf-status-dot" id="sf-status-dot"></span>
                            <span id="sf-status-text">0 items filtered on page</span>
                        </div>
                        <button type="button" class="sf-peek-btn" id="sf-peek-btn" title="Temporarily reveal hidden items">Peek Hidden</button>
                    </div>
                    <div class="sf-toggle-container">
                        <span class="sf-toggle-label">Module Filter <span class="sf-toggle-sub">Enable or disable filtering logic</span></span>
                        <label class="sf-switch"><input type="checkbox" id="sf-enabled" ${window.CONFIG.enabled ? 'checked' : ''}><span class="sf-slider"></span></label>
                    </div>
                    <div class="sf-toggle-container">
                        <span class="sf-toggle-label">Ghost Mode <span class="sf-toggle-sub">Fade filtered items instead of hiding</span></span>
                        <label class="sf-switch"><input type="checkbox" id="sf-ghost" ${window.CONFIG.ghostMode ? 'checked' : ''}><span class="sf-slider"></span></label>
                    </div>
                    <div class="sf-toggle-container">
                        <span class="sf-toggle-label">Hide Submissions <span class="sf-toggle-sub">Temporarily hide assignment dropboxes</span></span>
                        <label class="sf-switch"><input type="checkbox" id="sf-hide-submissions" ${window.CONFIG.hideSubmissions ? 'checked' : ''}><span class="sf-slider"></span></label>
                    </div>
                    <label class="sf-input-label">Target Campus</label>
                    <select id="sf-campus">
                        <option value="malabe">Malabe</option>
                        <option value="metro">Metro</option>
                        <option value="kandy">Kandy</option>
                        <option value="kurunegala">Kurunegala</option>
                        <option value="matara">Matara</option>
                        <option value="jaffna">Jaffna / Northern Uni</option>
                        <option value="deakin">Deakin</option>
                        <option value="curtin">Curtin</option>
                    </select>
                    <label class="sf-input-label">Batch Classification</label>
                    <select id="sf-type">
                        <option value="weekday">Weekday (WD)</option>
                        <option value="weekend">Weekend (WE)</option>
                    </select>
                    
                    <details class="sf-advanced-details">
                        <summary>Advanced Settings</summary>
                        <div style="margin-top: 10px;">
                            <label class="sf-input-label">Batch / Group ID (Optional)</label>
                            <input type="text" id="sf-group" placeholder="e.g., 1, Batch 2 Group 3, or 01.02">
                            
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
                        Version: 7.3.0<br>
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

            const btnIcon = document.getElementById('sf-btn-icon');
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

            const isPanelOpen = () => settingsModal.classList.contains('open');

            const openSidePanel = () => {
                settingsModal.classList.add('open');
                overlay.style.display = 'block';
                btn.classList.add('open');
                btn.title = 'Close Configuration';
                if (btnIcon) btnIcon.innerHTML = CLOSE_SVG;
                if (window.SF_LAST_STATS) window.updateFilterStatsUI(window.SF_LAST_STATS);
            };

            const closeSidePanel = () => {
                settingsModal.classList.remove('open');
                overlay.style.display = 'none';
                overlay.classList.remove('sf-welcome-backdrop');
                welcomeModal.style.display = 'none';
                btn.classList.remove('open');
                btn.title = 'Filter Configuration';
                if (btnIcon) btnIcon.innerHTML = GEAR_SVG;
                if (window.SF_LAST_STATS) window.updateFilterStatsUI(window.SF_LAST_STATS);
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

            // Peek Hidden button handler
            const peekBtn = document.getElementById('sf-peek-btn');
            if (peekBtn) {
                peekBtn.onclick = () => {
                    window.SF_PEEK_ACTIVE = !window.SF_PEEK_ACTIVE;
                    cleanCoursePage();
                };
            }

            if (!window.CONFIG.hasSeenWelcome) {
                welcomeModal.style.display = 'block';
                overlay.classList.add('sf-welcome-backdrop');
                overlay.style.display = 'block';
                document.getElementById('sf-welcome-start').onclick = () => {
                    window.CONFIG.hasSeenWelcome = true;
                    overlay.classList.remove('sf-welcome-backdrop');
                    storageApi.set({ hasSeenWelcome: true }, () => {
                        welcomeModal.style.display = 'none';
                        cleanCoursePage();
                        openSidePanel();
                    });
                };
            }

            const persistAndApplyLive = (closeAfter = false) => {
                const newType = document.getElementById('sf-type').value;
                const newSettings = {
                    hasSeenWelcome: true,
                    enabled: document.getElementById('sf-enabled').checked,
                    darkMode: window.CONFIG.darkMode,
                    ghostMode: document.getElementById('sf-ghost').checked,
                    hideSubmissions: document.getElementById('sf-hide-submissions').checked,
                    campus: document.getElementById('sf-campus').value,
                    batchType: newType,
                    batchTypeShort: newType === 'weekend' ? 'we' : 'wd',
                    groupId: document.getElementById('sf-group').value.trim(),
                    customWhitelist: document.getElementById('sf-whitelist').value.trim(),
                    customBlacklist: document.getElementById('sf-blacklist').value.trim()
                };
                window.CONFIG = { ...window.CONFIG, ...newSettings };
                try {
                    localStorage.setItem('sf_config_cache', JSON.stringify(window.CONFIG));
                } catch (e) {}
                cleanCoursePage();
                storageApi.set(newSettings, () => {
                    if (closeAfter) {
                        const saveBtn = document.getElementById('sf-save');
                        if (saveBtn) {
                            const orig = saveBtn.textContent;
                            saveBtn.textContent = 'Applied!';
                            setTimeout(() => {
                                saveBtn.textContent = orig;
                                closeSidePanel();
                            }, 350);
                        } else {
                            closeSidePanel();
                        }
                    }
                });
            };

            // Live instant application on toggle / select changes
            ['sf-enabled', 'sf-ghost', 'sf-hide-submissions', 'sf-campus', 'sf-type'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('change', () => persistAndApplyLive(false));
            });

            document.getElementById('sf-reset').onclick = () => {
                if (confirm('Are you sure you want to reset all configurations to default?')) {
                    try {
                        localStorage.removeItem('sf_darkMode');
                        localStorage.removeItem('sf_config_cache');
                    } catch (e) {}
                    setAntiFlashTheme(false);
                    applyDarkReader(false);
                    storageApi.clear(() => location.reload());
                }
            };

            document.getElementById('sf-save').onclick = () => {
                persistAndApplyLive(true);
            };

            if (window.SF_LAST_STATS) {
                window.updateFilterStatsUI(window.SF_LAST_STATS);
            }
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
                            localStorage.setItem('sf_config_cache', JSON.stringify(window.CONFIG));
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
                            const hideSubEl = document.getElementById('sf-hide-submissions');
                            const campusEl = document.getElementById('sf-campus');
                            const typeEl = document.getElementById('sf-type');
                            const groupEl = document.getElementById('sf-group');
                            if (enabledEl) enabledEl.checked = window.CONFIG.enabled;
                            if (ghostEl) ghostEl.checked = window.CONFIG.ghostMode;
                            if (hideSubEl) hideSubEl.checked = Boolean(window.CONFIG.hideSubmissions);
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
                injectUI();
                runClean();

                const observer = new MutationObserver((mutations) => {
                    let shouldRun = false;
                    for (let m of mutations) {
                        if (m.target && m.target.closest && m.target.closest('#sliit-filter-modal, #sliit-welcome-modal, #sliit-filter-btn, #sliit-filter-overlay')) {
                            continue;
                        }
                        if (m.addedNodes.length > 0) {
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
