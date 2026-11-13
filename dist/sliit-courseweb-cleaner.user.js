// ==UserScript==
// @name         SLIIT Courseweb Module Cleaner
// @namespace    http://tampermonkey.net/
// @version      7.3.0
// @description  A professional, context-aware module filter and dark theme for SLIIT Courseweb.
// @author       Dulith Divisekara
// @match        *://courseweb.sliit.lk/*
// @run-at       document-start
// @updateURL    https://github.com/dulithdivisekara/sliit-courseweb-cleaner/raw/refs/heads/main/dist/sliit-courseweb-cleaner.user.js
// @downloadURL  https://github.com/dulithdivisekara/sliit-courseweb-cleaner/raw/refs/heads/main/dist/sliit-courseweb-cleaner.user.js
// @require      https://cdn.jsdelivr.net/npm/darkreader@4.9.133/darkreader.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// ==/UserScript==

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

window.CONFIG = {
    hasSeenWelcome: GM_getValue('hasSeenWelcome', false),
    darkMode: GM_getValue('darkMode', false),
    enabled: GM_getValue('enabled', true),
    ghostMode: GM_getValue('ghostMode', true),
    hideSubmissions: GM_getValue('hideSubmissions', false),
    campus: GM_getValue('campus', 'malabe'),
    batchType: GM_getValue('batchType', 'weekday'),
    batchTypeShort: GM_getValue('batchTypeShort', 'wd'),
    groupId: GM_getValue('groupId', ''),
    customWhitelist: GM_getValue('customWhitelist', ''),
    customBlacklist: GM_getValue('customBlacklist', '')
};
window.REMOTE_RULES = null;
window.SF_PEEK_ACTIVE = false;

// Apply dark mode immediately at document-start to prevent white flash
if (window.CONFIG.darkMode) {
    setAntiFlashTheme(true);
    applyDarkReader(true);
}

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
    GM_addStyle(`
        #sliit-filter-btn { position: fixed; bottom: 60px; right: 0; background-color: #f7b924; color: #212529; border: none; border-radius: 9999px 0 0 9999px; padding: 10px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: -3px 3px 12px rgba(0,0,0,0.2); z-index: 10001; transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease; display: flex; align-items: center; justify-content: center; width: 46px; height: 46px; outline: none; }
        #sliit-filter-btn:hover { background-color: #e5a919; }
        #sliit-filter-btn.open { right: 360px; box-shadow: -4px 2px 10px rgba(0,0,0,0.15); }
        #sliit-filter-btn svg { width: 22px; height: 22px; margin: 0; padding: 0; display: block; }
        #sf-badge-count { position: absolute; top: -6px; left: -6px; background-color: #0f3b5f; color: #ffffff; font-size: 10px; font-weight: 700; min-width: 19px; height: 19px; padding: 0 5px; border-radius: 9999px; display: none; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.25); border: 1.5px solid #ffffff; box-sizing: border-box; line-height: 1; pointer-events: none; }
        #sf-badge-count.visible { display: inline-flex; }
        #sliit-filter-btn.open #sf-badge-count { display: none !important; }
        .sf-status-banner { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; margin-bottom: 16px; font-size: 12px; color: #1e293b; }
        .sf-status-info { display: flex; align-items: center; gap: 8px; font-weight: 600; line-height: 1.3; }
        .sf-status-dot { width: 8px; height: 8px; border-radius: 50%; background-color: #10b981; flex-shrink: 0; }
        .sf-status-dot.paused { background-color: #94a3b8; }
        .sf-status-dot.peeking { background-color: #f59e0b; }
        .sf-peek-btn { background: #ffffff; color: #0f3b5f; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px 10px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s ease; }
        .sf-peek-btn:hover { background: #e2e8f0; }
        .sf-peek-btn.active { background: #f7b924; color: #212529; border-color: #e5a919; }
        .sf-peek-highlight { outline: 1.5px dashed #f7b924 !important; outline-offset: 2px !important; border-radius: 6px !important; }
        .sf-modal-container { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ffffff; padding: 24px; border-radius: 8px; border-top: 4px solid #0f3b5f; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 10000; width: 340px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; max-height: 85vh; overflow-y: auto; }
        #sliit-filter-modal.sf-side-panel { position: fixed; top: 0; right: 0; bottom: 0; left: auto; transform: translateX(100%); background: #ffffff; padding: 24px; border-radius: 16px 0 0 16px; border-top: none; border-left: 4px solid #0f3b5f; box-shadow: -5px 0 35px rgba(0, 0, 0, 0.25); z-index: 10000; width: 360px; max-width: calc(100vw - 50px); height: 100vh; max-height: 100vh; overflow-y: auto; box-sizing: border-box; display: flex; flex-direction: column; visibility: hidden; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s ease; }
        #sliit-filter-modal.sf-side-panel.open { transform: translateX(0); visibility: visible; }
        .sf-dark-theme#sliit-filter-modal.sf-side-panel { background: #1e1e1e !important; border-left-color: #f7b924 !important; border-top: none !important; box-shadow: -5px 0 35px rgba(0, 0, 0, 0.5) !important; }
        @media (max-width: 420px) {
            #sliit-filter-modal.sf-side-panel { width: 100vw; max-width: 100vw; border-radius: 0; border-left: none; }
            #sliit-filter-btn.open { right: calc(100vw - 46px); }
        }
        .sf-modal-container h3 { margin-top: 0; margin-bottom: 16px; color: #0f3b5f; font-size: 18px; font-weight: 600; border-bottom: 1px solid #dee2e6; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .sf-toggle-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px dashed #dee2e6; }
        .sf-toggle-label { font-size: 13px; font-weight: 600; color: #212529; }
        .sf-toggle-sub { font-size: 11px; color: #6c757d; font-weight: normal; display: block; }
        .sf-switch { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
        .sf-switch input { opacity: 0; width: 0; height: 0; }
        .sf-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ced4da; transition: .3s; border-radius: 22px; }
        .sf-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .sf-slider { background-color: #0f3b5f; }
        input:checked + .sf-slider:before { transform: translateX(18px); }
        .sf-input-label { display: block; margin-top: 14px; font-size: 12px; font-weight: 600; color: #495057; }
        .sf-modal-container select, .sf-modal-container input[type="text"] { width: 100%; padding: 10px 12px; margin-top: 6px; border: 1px solid #ced4da; border-radius: 6px; box-sizing: border-box; font-size: 14px; color: #495057; background-color: #f8f9fa; }
        .sf-modal-container select:focus, .sf-modal-container input[type="text"]:focus { outline: none; border-color: #f7b924; background-color: #fff; }
        .sliit-modal-actions { margin-top: 22px; display: flex; justify-content: space-between; align-items: center; width: 100%; }
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
        #sliit-filter-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.18); z-index: 9998; }
        #sliit-filter-overlay.sf-welcome-backdrop { background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(3px); }
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
        .sf-dark-theme .sf-status-banner { background: #26292e; border-color: #3f444c; color: #e2e8f0; }
        .sf-dark-theme .sf-peek-btn { background: #33373d; color: #f8fafc; border-color: #4b5563; }
        .sf-dark-theme .sf-peek-btn:hover { background: #3f444c; }
        .sf-dark-theme .sf-peek-btn.active { background: #f7b924; color: #141517; border-color: #f7b924; }
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
        /* CourseWeb logo dark theme inversion (monochrome white on dark header) */
        html[data-darkreader-scheme="dark"] #header-logo .logo img, html.sf-dark-mode-preload #header-logo .logo img { filter: invert(1) grayscale(1) brightness(3) contrast(100) !important; mix-blend-mode: screen !important; }
        /* Anti-white-flash & instant skeleton preloader styles for seamless first-load in dark mode */
        html.sf-dark-mode-preload, html.sf-dark-mode-preload body, html[data-darkreader-scheme="dark"], html[data-darkreader-scheme="dark"] body { background-color: #181a1b !important; color-scheme: dark !important; }
        html.sf-dark-mode-preload body { color: #e2e8f0; }
        html.sf-dark-mode-preload .sr-only, html.sf-dark-mode-preload .accesshide, html.sf-dark-mode-preload .visually-hidden, html.sf-dark-mode-preload .d-none, html.sf-dark-mode-preload .hidden, html.sf-dark-mode-preload .drawer.not-initialized, html.sf-dark-mode-preload [data-region="loading-placeholder-content"] { display: none !important; }
        html.sf-dark-mode-preload .activity-item, html.sf-dark-mode-preload .course-section-header, html.sf-dark-mode-preload li.section { border-color: rgba(255, 255, 255, 0.08) !important; }
        html.sf-dark-mode-preload img.activityicon { width: 24px; height: 24px; background-color: transparent !important; }
        html.sf-dark-mode-preload .userpicture, html.sf-dark-mode-preload .btn.drawertoggle, html.sf-dark-mode-preload .drawer-toggles .btn { border-color: rgba(255, 255, 255, 0.12) !important; }
    `);

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
    const updateThemeUI = (isDark) => {
        applyDarkReader(isDark);
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

    const toggleDarkTheme = (forcedState) => {
        const nextState = typeof forcedState === 'boolean' ? forcedState : !window.CONFIG.darkMode;
        window.CONFIG.darkMode = nextState;
        setAntiFlashTheme(nextState);
        updateThemeUI(window.CONFIG.darkMode);
        GM_setValue('darkMode', window.CONFIG.darkMode);
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

    btn.onclick = toggleSidePanel;
    const closeBtn = document.getElementById('sf-close-panel');
    if (closeBtn) closeBtn.onclick = closeSidePanel;
    document.getElementById('sf-cancel').onclick = closeSidePanel;
    overlay.onclick = closeSidePanel;

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
            GM_setValue('hasSeenWelcome', true);
            welcomeModal.style.display = 'none';
            cleanCoursePage();
            openSidePanel();
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
        GM_setValue('enabled', newSettings.enabled);
        GM_setValue('darkMode', newSettings.darkMode);
        GM_setValue('ghostMode', newSettings.ghostMode);
        GM_setValue('hideSubmissions', newSettings.hideSubmissions);
        GM_setValue('campus', newSettings.campus);
        GM_setValue('batchType', newSettings.batchType);
        GM_setValue('batchTypeShort', newSettings.batchTypeShort);
        GM_setValue('groupId', newSettings.groupId);
        GM_setValue('customWhitelist', newSettings.customWhitelist);
        GM_setValue('customBlacklist', newSettings.customBlacklist);
        GM_setValue('hasSeenWelcome', true);

        cleanCoursePage();
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
    };

    ['sf-enabled', 'sf-ghost', 'sf-hide-submissions', 'sf-campus', 'sf-type'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', () => persistAndApplyLive(false));
    });

    document.getElementById('sf-reset').onclick = () => {
        if (confirm('Are you sure you want to reset all configurations to default?')) {
            setAntiFlashTheme(false);
            applyDarkReader(false);
            GM_deleteValue('hasSeenWelcome');
            GM_deleteValue('darkMode');
            GM_deleteValue('enabled');
            GM_deleteValue('ghostMode');
            GM_deleteValue('hideSubmissions');
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
        persistAndApplyLive(true);
    };

    if (window.SF_LAST_STATS) {
        window.updateFilterStatsUI(window.SF_LAST_STATS);
    }
}

function isCourseViewPage() {
    const path = window.location.pathname || '';
    return path.includes('/course/view.php') || path.includes('/course/section.php');
}

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
    // Only inject UI and run filtering on course view pages
    // This protects homepage (/my/) and course selectors (/my/courses.php)
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
// --- SHARED CORE LOGIC ---
const CAMPUS_ALIASES = {
    malabe: ['malabe', 'mlb'],
    metro: ['metro', 'colombo'],
    kandy: ['kandy', 'kandy uni', 'kandy center', 'kandy centre'],
    kurunegala: ['kurunegala', 'kurunegale', 'kurunagala', 'kurunegala center', 'kurunegala centre'],
    matara: ['matara', 'mathara', 'matara center', 'matara centre'],
    jaffna: ['jaffna', 'northern', 'nothern', 'northern uni', 'nothern uni', 'nu group', 'nu dataset', 'jaffna center', 'jaffna centre'],
    deakin: ['deakin'],
    curtin: ['curtin']
};

// Regional centers where separate Weekend vs Weekday batches generally do not exist (only Weekday / single cohorts)
const WEEKDAY_ONLY_REGIONAL_CENTERS = new Set(['kandy', 'matara', 'kurunegala']);

const DEFAULT_CAMPUSES = Object.values(CAMPUS_ALIASES).flat();
const DEFAULT_IGNORE_KEYWORDS = ['notice', 'rescheduled', 'announcement', 'general'];
const KEYWORD_REGEX_CACHE = new Map();

function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsKeyword(lower, kw) {
    if (!lower || !kw) return false;
    const key = kw.toLowerCase();
    let regex = KEYWORD_REGEX_CACHE.get(key);
    if (!regex) {
        regex = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(key)}(?:$|[^a-z0-9])`, 'i');
        KEYWORD_REGEX_CACHE.set(key, regex);
    }
    return regex.test(lower);
}

function getMergedCampuses() {
    const remoteRules = window.REMOTE_RULES || {};
    const remoteCampuses = remoteRules.campuses || [];
    return Array.from(new Set([...DEFAULT_CAMPUSES, ...remoteCampuses]));
}

function getMergedIgnoreKeywords() {
    const remoteRules = window.REMOTE_RULES || {};
    const remoteKeywords = remoteRules.ignoreKeywords || [];
    return Array.from(new Set([...DEFAULT_IGNORE_KEYWORDS, ...remoteKeywords]));
}

/**
 * Returns an array of canonical campus keys (e.g. ['malabe', 'kandy']) mentioned in `lower`.
 */
function getMentionedCampuses(lower) {
    if (!lower) return [];
    const mentioned = new Set();

    for (const [canonical, aliases] of Object.entries(CAMPUS_ALIASES)) {
        if (aliases.some(alias => containsKeyword(lower, alias))) {
            mentioned.add(canonical);
        }
    }

    // Also check any dynamic remote campuses not already in CAMPUS_ALIASES
    const remoteRules = window.REMOTE_RULES || {};
    const remoteCampuses = remoteRules.campuses || [];
    for (const rc of remoteCampuses) {
        const rcLower = rc.toLowerCase().trim();
        let matchedKnown = false;
        for (const [canonical, aliases] of Object.entries(CAMPUS_ALIASES)) {
            if (canonical === rcLower || aliases.includes(rcLower)) {
                matchedKnown = true;
                break;
            }
        }
        if (!matchedKnown && containsKeyword(lower, rcLower)) {
            mentioned.add(rcLower);
        }
    }

    return Array.from(mentioned);
}

/**
 * Extracts all numbered batches mentioned in `lower`, e.g.:
 * - "Batch 1 and 2" -> [1, 2]
 * - "Batch 1 to 3" -> [1, 2, 3]
 * - "Batch 2, 3, WE" -> [2, 3]
 * - "Batches (Batch 02 + Weekend Batch)" -> [2]
 * - "1st Batch / 2nd Batch" -> [1, 2]
 * - "Y2S1.B1" -> [1]
 */
function extractBatchNumbers(lower) {
    if (!lower) return [];
    const nums = new Set();

    // Strip Microsoft Teams Meeting IDs, URLs, and 8-digit dates (e.g. "22052026") so they never pollute batch number chains
    const cleanedLower = lower
        .replace(/https?:\/\/\S+/gi, ' ')
        .replace(/\bmeeting\s+id\s*[:\-]?\s*[\d\s]{5,25}/gi, ' ')
        .replace(/\b\d{8}\b/g, ' ');

    const batchChainRegex = /\b(?:batch(?:es)?|bacth)\s*(?:[:\-]?\s*)?(\d{1,2}\b(?!\s*(?:st|nd|rd|th)\b)(?:\s*(?:,|&|and|\+|\/|or|to|\-)\s*(?:(?:batch|bacth)\s*)?\d{1,2}\b(?!\s*(?:st|nd|rd|th)\b))*)/gi;
    let match;
    while ((match = batchChainRegex.exec(cleanedLower)) !== null) {
        const segment = match[1];
        const rangeMatch = segment.match(/^(\d{1,2})\s*(?:to|\-)\s*(\d{1,2})$/i);
        if (rangeMatch) {
            const start = parseInt(rangeMatch[1], 10);
            const end = parseInt(rangeMatch[2], 10);
            if (!isNaN(start) && !isNaN(end) && start <= end && end - start <= 10) {
                for (let i = start; i <= end; i++) {
                    if (i > 0 && i <= 20) nums.add(i);
                }
                continue;
            }
        }
        const digits = segment.match(/\d{1,2}/g);
        if (digits) {
            digits.forEach(d => {
                const n = parseInt(d, 10);
                if (!isNaN(n) && n > 0 && n <= 20) nums.add(n);
            });
        }
    }

    const ordinalBatchRegex = /\b(\d{1,2})(?:st|nd|rd|th)\s+(?:batch|bacth)\b/gi;
    while ((match = ordinalBatchRegex.exec(cleanedLower)) !== null) {
        const n = parseInt(match[1], 10);
        if (!isNaN(n) && n > 0 && n <= 20) nums.add(n);
    }

    const codeBatchRegex = /\by[1-4]\.?s[1-2]\.b(\d{1,2})\b/gi;
    while ((match = codeBatchRegex.exec(cleanedLower)) !== null) {
        const n = parseInt(match[1], 10);
        if (!isNaN(n) && n > 0 && n <= 20) nums.add(n);
    }

    return Array.from(nums);
}

/**
 * Extracts Business Faculty lab/tutorial sub-groups such as:
 * - "Batch 02 Group 04" -> [{ batchNum: 2, groupNum: 4 }]
 * - "Batch 2, Group 3" -> [{ batchNum: 2, groupNum: 3 }]
 * - "Batch 1 – Group 1 and Batch 1 – Group 2" -> [{ batchNum: 1, groupNum: 1 }, { batchNum: 1, groupNum: 2 }]
 */
function extractBatchSubGroups(lower) {
    if (!lower) return [];
    const pairs = [];
    const regex = /\b(?:batch|bacth)\s*(\d{1,2})\s*(?:[,–—\-:]?\s*)?(?:group|grp)\s*(\d{1,2})\b/gi;
    let match;
    while ((match = regex.exec(lower)) !== null) {
        const b = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        if (!isNaN(b) && !isNaN(g) && b > 0 && b <= 20 && g > 0 && g <= 30) {
            pairs.push({ batchNum: b, groupNum: g });
        }
    }
    return pairs;
}

/**
 * Helper to normalize group code segments so "01.02", "0102", and "1.2" all produce the same canonical key "1.2".
 */
function normalizeGroupSegments(str) {
    if (!str) return '';
    if (str.includes('.')) {
        return str
            .split('.')
            .filter(Boolean)
            .map(s => String(parseInt(s, 10)))
            .join('.');
    }
    if (/^\d{4}$/.test(str)) {
        const p1 = parseInt(str.slice(0, 2), 10);
        const p2 = parseInt(str.slice(2, 4), 10);
        return `${p1}.${p2}`;
    }
    return String(parseInt(str, 10));
}

function createGroupEntry(batchShort, rawGroup) {
    const cleanRaw = String(rawGroup).trim();
    const isFourDigitConcat = /^\d{4}$/.test(cleanRaw);
    const leadSegment = cleanRaw.includes('.')
        ? cleanRaw.split('.')[0]
        : (isFourDigitConcat ? cleanRaw.slice(0, 2) : cleanRaw);

    return {
        batchShort: batchShort.toLowerCase(),
        groupRaw: cleanRaw,
        groupNorm: cleanRaw.replace(/\./g, '').replace(/^0+/, '') || '0',
        groupCanonical: normalizeGroupSegments(cleanRaw),
        groupLeadNorm: (leadSegment || '').replace(/^0+/, '') || '0'
    };
}

/**
 * Extracts academic group codes across all years (Y1-Y4), semesters (S1-S2), and faculties/specializations:
 * Supports dot, space, or underscore separators, optional faculty segments, 4-digit concatenated subgroups (1101 -> 11.01),
 * group ranges ("Y1.S2.WD.IT.01-09", "Y1.S2.WD.IT.01 to Y1.S2.WD.IT.07"), and conjunctions ("Y2.S1.WD.IT.13 and 14").
 * Ignores illustrative examples like "Example: Y2.S1.WD.IT.01".
 */
function extractAcademicGroups(lower) {
    if (!lower) return [];

    // Strip illustrative examples like "e.g. Y2.S1.WD.IT.01" or "Example: Y2.S1.WD.IT.01"
    const cleanedLower = lower.replace(/\b(?:example|e\.g\.|eg|for\s+example|format)\s*[:\-]?\s*(?:y[1-4][\s._-]*s[1-2][\s._-]*)?(?:wd|we)[\s._-]*(?:[a-z]{2,5}[\s._-]*)?\d+(?:\.\d+)?/gi, ' ');

    const groups = [];
    const seen = new Set();

    const addGroup = (batchShort, rawGroup) => {
        const entry = createGroupEntry(batchShort, rawGroup);
        const key = `${entry.batchShort}:${entry.groupCanonical}:${entry.groupRaw}`;
        if (!seen.has(key)) {
            seen.add(key);
            groups.push(entry);
        }
    };

    // Match group codes with '.', '_', or ' ' separators, optional faculty (IT/SE/DS/etc. or omitted like Y1.S2.WD.07.02 or WE.02.02),
    // plus optional trailing range/conjunction (e.g. "-09", "and 14", "& 04")
    const fullCodeRegex = /\b(?:y[1-4][\s._-]*s[1-2][\s._-]*)?(wd|we)(?:[\s._-]+(?:it|se|cs|ds|csne|ise|im|cy|bm|en|ai|is))?[\s._-]+(\d{1,4}(?:\.\d{1,2})?)(?:\s*(?:(?:\-|to)\s*(?:y[1-4][\s._-]*s[1-2][\s._-]*(?:wd|we)(?:[\s._-]+[a-z]{2,5})?[\s._-]+)?(\d{1,2})|(?:,|&|\band\b)\s*(\d{1,2}(?:\.\d{1,2})?)))?\b/gi;

    let match;
    while ((match = fullCodeRegex.exec(cleanedLower)) !== null) {
        const batchShort = match[1].toLowerCase();
        const rawGroup = match[2];
        const rangeEndStr = match[3];
        const conjSecondStr = match[4];

        // Guard against matching random prose like "we 1" unless it has leading zero, dot, 4-digits, or Y1S1/faculty context
        const fullMatchStr = match[0];
        const hasExplicitCodeStructure = /[._]/.test(fullMatchStr) ||
            /\by[1-4]/i.test(fullMatchStr) ||
            /\b(?:it|se|cs|ds|csne|ise|im|cy|bm|en|ai|is)\b/i.test(fullMatchStr) ||
            /^0\d/.test(rawGroup);
        if (!hasExplicitCodeStructure) continue;

        addGroup(batchShort, rawGroup);

        if (rangeEndStr && !rawGroup.includes('.') && /^\d{1,2}$/.test(rawGroup)) {
            const start = parseInt(rawGroup, 10);
            const end = parseInt(rangeEndStr, 10);
            if (!isNaN(start) && !isNaN(end) && start <= end && end - start <= 25) {
                for (let i = start; i <= end; i++) {
                    addGroup(batchShort, String(i).padStart(2, '0'));
                }
            }
        }

        if (conjSecondStr) {
            addGroup(batchShort, conjSecondStr);
        }
    }

    return groups;
}

/**
 * Parses the user's configured groupId into a normalized representation.
 */
function parseUserGroup(groupIdStr) {
    if (!groupIdStr) return null;
    const raw = groupIdStr.trim().toLowerCase();
    if (!raw) return null;

    // Support Business Faculty "Batch 2 Group 3" / "B2 G3" format as well as IT "Y2.S1.WD.IT.01.02" / "01.02" / "2"
    const bmBatchGroupMatch = raw.match(/^(?:batch|bacth|b)\s*(\d{1,2})(?:\s*[,/\-]?\s*(?:group|grp|g)\s*(\d{1,2}))?$/i);
    if (bmBatchGroupMatch) {
        const bNum = parseInt(bmBatchGroupMatch[1], 10);
        const gNum = bmBatchGroupMatch[2] ? parseInt(bmBatchGroupMatch[2], 10) : null;
        const canonical = gNum !== null ? `${bNum}.${gNum}` : String(bNum);
        return {
            raw,
            cleaned: canonical,
            digitsOnly: gNum !== null ? `${bNum}${gNum}` : String(bNum),
            normCode: canonical.replace(/\./g, ''),
            canonical,
            leadNorm: String(bNum),
            batchNum: bNum,
            subGroupNum: gNum
        };
    }

    // Strip optional prefix like "y2.s1.wd.it." or "wd.it." or "batch "
    const cleaned = raw
        .replace(/^(?:y[1-4][\s._-]*s[1-2][\s._-]*)?(?:wd|we)(?:[\s._-]+[a-z]{2,5})?[\s._-]*/i, '')
        .replace(/^(?:batch|bacth)\s*/i, '')
        .replace(/^b(\d+)$/i, '$1')
        .trim();

    if (!cleaned) return null;

    const digitsOnly = cleaned.replace(/\./g, '');
    const isSingleBatchNumber = /^\d{1,2}$/.test(cleaned) && parseInt(cleaned, 10) <= 20;
    let batchNum = isSingleBatchNumber ? parseInt(cleaned, 10) : null;
    const normCode = digitsOnly.replace(/^0+/, '') || '0';
    const canonical = normalizeGroupSegments(cleaned);
    const leadSegment = cleaned.includes('.')
        ? cleaned.split('.')[0]
        : (/^\d{4}$/.test(cleaned) ? cleaned.slice(0, 2) : cleaned);
    const leadNorm = (leadSegment || '').replace(/^0+/, '') || '0';

    let subGroupNum = null;
    if (cleaned.includes('.')) {
        const parts = cleaned.split('.').filter(Boolean);
        if (parts.length === 2 && parseInt(parts[0], 10) <= 20) {
            batchNum = parseInt(parts[0], 10);
            subGroupNum = parseInt(parts[1], 10);
        }
    }

    return {
        raw,
        cleaned,
        digitsOnly,
        normCode,
        canonical,
        leadNorm,
        batchNum,
        subGroupNum
    };
}

/**
 * Detects whether an item has an explicit Weekday indicator (excluding "regular", which means Regular intake/exam on Courseweb).
 */
function hasWeekdayIndicator(text, lower) {
    if (!lower) return false;
    return /\b(?:weekday|wd)\b/i.test(lower) ||
        /[._-]wd[._-]/i.test(lower) ||
        /\bwd[\s._-]+(?:it|se|cs|ds|csne|ise|im|cy|bm|en)\b/i.test(lower) ||
        /\b(?:monday|tuesday|wednesday|thursday|friday)[\s._-]+batch(?:[\s._-]|$)/i.test(lower);
}

/**
 * Detects whether an item has an explicit Weekend indicator without false-matching the English pronoun "We" / "we".
 */
function hasWeekendIndicator(text, lower) {
    if (!lower) return false;
    // Case-sensitive uppercase "WE" (e.g. "Malabe WE", "Y2.S1.WE.IT.01", "Batch 2, 3, WE")
    if (text && /\bWE\b/.test(text)) return true;
    return /\bweekend\b/i.test(lower) ||
        /[._-]we[._-]/i.test(lower) ||
        /\bwe[\s._-]+(?:it|se|cs|ds|csne|ise|im|cy|bm|en|batch|group|students|quiz|tute|tutorial|lecture|lab|session)\b/i.test(lower) ||
        /\b(?:malabe|metro|kandy|matara|kurunegala|jaffna|northern)\s*[\-–—:]\s*we\b/i.test(lower);
}

/**
 * Extracts and caches the clean text of an element (excluding Moodle's screen-reader "Select activity ..." prefix)
 * and inserts spaces around HTML tag boundaries so adjacent tags like `</ul><strong>Matara</strong><ul>` never concatenate into `"AllocationMataraMatara"`.
 */
function getCleanActivityText(element) {
    if (!element) return '';
    const htmlLen = element.innerHTML ? String(element.innerHTML.length) : '0';
    if (element.dataset && element.dataset.sfCleanTextV2 !== undefined && element.dataset.sfTextLen === htmlLen) {
        return element.dataset.sfCleanTextV2;
    }

    const clone = element.cloneNode(true);
    clone.querySelectorAll('.sr-only, .accesshide, .visually-hidden, [data-region="activity-information"]').forEach(el => el.remove());

    // Ensure adjacent elements without whitespace between tags do not concatenate words across tag boundaries
    clone.querySelectorAll('*').forEach(el => {
        el.insertBefore(document.createTextNode(' '), el.firstChild);
        el.appendChild(document.createTextNode(' '));
    });

    const text = (clone.textContent || '')
        .replace(/^\s*Select activity\s+/i, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (element.dataset) {
        element.dataset.sfCleanTextV2 = text;
        element.dataset.sfCleanText = text;
        element.dataset.sfTextLen = htmlLen;
    }
    return text;
}

/**
 * Determines if an activity is an assignment submission link (for Issue #4: Hide Submission Links).
 * Preserves assignment specification PDFs, marking rubrics, topic allocations, and marks sheets.
 */
function isSubmissionActivity(activity, lower) {
    if (!activity) return false;

    const isAssignMod = activity.classList.contains('modtype_assign') ||
        activity.classList.contains('assign') ||
        activity.classList.contains('modtype_turnitintooltwo') ||
        Boolean(activity.querySelector('a[href*="/mod/assign/"], a[href*="/mod/turnitintooltwo/"]'));

    if (isAssignMod) return true;

    // Also catch URL/feedback activities explicitly titled as submission links/forms
    if (/\b(?:submission\s+link|submit\s+here|submission\s+portal)\b/i.test(lower)) {
        return true;
    }

    return false;
}

/**
 * Protects universal core learning materials (Lecture Slides, Tutorials, Module Outlines, Delivery Schedules,
 * and general Notices/Rescheduled Announcements) that do not contain any campus, batch, or group restrictions.
 */
function isCoreLearningMaterial(lower, mentionedCampuses, batchNumbers, academicGroups, hasWeekdayWord, hasWeekendWord) {
    if (mentionedCampuses.length > 0 || batchNumbers.length > 0 || academicGroups.length > 0 || hasWeekdayWord || hasWeekendWord) {
        return false;
    }
    if (/\b(?:lecture\s*slides?|lesson\s*\d*|tutorials?\b|tutes?\b|module\s*outline|delivery\s*schedule|marking\s*rubric|past\s*papers?|model\s*papers?)\b/i.test(lower)) {
        return true;
    }
    const ignoreKws = getMergedIgnoreKeywords();
    if (ignoreKws.some(kw => containsKeyword(lower, kw))) {
        return true;
    }
    return false;
}

/**
 * Core filtering rule evaluator.
 * @param {string} text - Clean text of the activity/item
 * @param {string} lower - Lowercase clean text
 * @param {object} [context] - Optional section context flags:
 *   - `sectionHasRegionalCampusItems`: whether the current section has explicit items for the user's regional center
 *   - `sectionHasMyCampusBothBatches`: whether the current section explicitly separates `<userCampus> Weekday` and `<userCampus> Weekend`
 */
function shouldBlock(text, lower, context = {}) {
    if (!lower) return false;

    // 1. Custom Blacklist check (Highest priority)
    if (window.CONFIG.customBlacklist) {
        const blacklists = window.CONFIG.customBlacklist.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
        if (blacklists.some(keyword => lower.includes(keyword))) return true;
    }

    // 2. Custom Whitelist check
    if (window.CONFIG.customWhitelist) {
        const whitelists = window.CONFIG.customWhitelist.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
        if (whitelists.some(keyword => lower.includes(keyword))) return false;
    }

    const userCampus = (window.CONFIG.campus || 'malabe').toLowerCase();
    const userBatch = (window.CONFIG.batchType || 'weekday').toLowerCase();
    const userBatchShort = (window.CONFIG.batchTypeShort || (userBatch === 'weekend' ? 'we' : 'wd')).toLowerCase();
    const oppositeShort = userBatchShort === 'we' ? 'wd' : 'we';
    const userGroup = parseUserGroup(window.CONFIG.groupId);

    // 3. Campus resolution with full alias normalization
    // Strip tangential remarks like "(new date as per the request of Matara Centre)" so they don't misclassify universal notices
    const lowerForCampus = lower.replace(/\b(?:as\s+per\s+the\s+)?request\s+of\s+(?:malabe|metro|kandy|kurunegala|kurunegale|kurunagala|matara|mathara|jaffna|northern|nothern)(?:\s+(?:uni|center|centre|campus))?/gi, ' ');
    const mentionedCampuses = getMentionedCampuses(lowerForCampus);

    // Multi-campus staff directories or general instructions listing 4+ campuses ("Lecturers of BM1014...", "Welcome to BM1030...", "Mid Quiz Instructions...")
    const isUniversalMultiCampusDirectory = mentionedCampuses.length >= 4;
    const mentionsAllOrOtherCampuses = isUniversalMultiCampusDirectory ||
        /\b(?:other|all)\s+(?:campuses|centers|centres|batches|unis)\b/i.test(lower) ||
        /\bcenter\s+repeats\b/i.test(lower);

    const hasMyCampus = mentionedCampuses.includes(userCampus) || mentionsAllOrOtherCampuses;
    const hasForeignCampus = mentionedCampuses.some(c => c !== userCampus);
    const isAggregatedCampusList = hasMyCampus && hasForeignCampus;

    // 4. Batch & Group resolution
    const batchNumbers = extractBatchNumbers(lower);
    const batchSubGroups = extractBatchSubGroups(lower);
    const academicGroups = extractAcademicGroups(lower);

    const hasWeekdayExplicit = hasWeekdayIndicator(text, lower);
    const hasWeekendExplicit = hasWeekendIndicator(text, lower);

    // Numbered batches (Batch 1, Batch 2, Batch 3) in SLIIT represent Weekday batches
    // Note: if an item says "COMPULSORY for all the WEEKDAY students ... A separate plan will be there for weekend students",
    // do not treat the incidental mention of "weekend students" in a separate-plan disclaimer as targeting the weekend cohort
    const lowerWithoutSeparateWeekendDisclaimer = lower.replace(/\b(?:separate\s+plan\s+will\s+be\s+there\s+for\s+weekend\s+students|however,?\s+weekend\s+students\s+are\s+encouraged\s+to\s+join)\b/gi, ' ');
    const effectiveHasWeekend = hasWeekendIndicator(text, lowerWithoutSeparateWeekendDisclaimer);

    const hasWeekday = hasWeekdayExplicit || batchNumbers.length > 0;
    const hasWeekend = effectiveHasWeekend;

    const hasMyBatchType = userBatch === 'weekend' ? hasWeekend : hasWeekday;
    const hasOppositeBatchType = userBatch === 'weekend' ? hasWeekday : hasWeekend;

    // Check if an item is a multi-cohort title joining a Batch + another Campus/Center
    // e.g. "Weekend Batch / Center Repeats & Northern Uni: 8.30 p.m." or "ITB Batch 01 and Matara Batch"
    const isMultiCohortBatchAndCampus = /\b(?:(?:weekend|weekday)\s+batch|(?:batch|bacth)\s*\d{1,2})\b[^a-z0-9]*(?:\/|&|\+|\band\b)/i.test(lower);
    const isMultiCohortMyBatch = hasMyBatchType && isMultiCohortBatchAndCampus &&
        (userBatch === 'weekend' || !userGroup || userGroup.batchNum === null || batchNumbers.includes(userGroup.batchNum));
    const isMultiCohortMyCampus = mentionedCampuses.includes(userCampus) && isMultiCohortBatchAndCampus;

    // 5. Block foreign campuses (unless my campus or my multi-cohort batch is also targeted)
    if (hasForeignCampus && !isAggregatedCampusList && !isMultiCohortMyBatch) {
        return true;
    }

    // If an item explicitly names the user's regional center (e.g., "Kandy Uni", "Matara", "Northern Uni - Batch 1",
    // "Y2.S1.WE.IT_Metro_Quiz"), regional centers often only have one cohort or combine with a specific batch.
    // Never block an item that explicitly names the user's regional campus unless the section explicitly splits
    // that regional campus into separate Weekday and Weekend items!
    const explicitlyTargetsMyRegionalCampus = userCampus !== 'malabe' && mentionedCampuses.includes(userCampus);
    if (explicitlyTargetsMyRegionalCampus && !context.sectionHasMyCampusBothBatches) {
        return false;
    }

    // Universal "ALL BATCHES" / "Final CA Marks ... released" / multi-campus directory notices
    if (isUniversalMultiCampusDirectory || /\ball\s+(?:the\s+)?batches\b/i.test(lower) || /\bmarks\b.*\bhav[e]?\s+been\s+released\b/i.test(lower)) {
        return false;
    }

    // 6. Academic group code checks (e.g. Y2.S1.WD.IT.01.02)
    if (academicGroups.length > 0) {
        const myBatchGroups = academicGroups.filter(g => g.batchShort === userBatchShort);
        const oppBatchGroups = academicGroups.filter(g => g.batchShort === oppositeShort);

        // For regional centers that only have Weekday batches (Kandy, Matara, Kurunegala),
        // do not hide shared WD group resources (like LECTURE LINKS Y2.S1.WD.IT.01..15) if no campus is mentioned
        const isWeekdayOnlyRegionalFallback = WEEKDAY_ONLY_REGIONAL_CENTERS.has(userCampus) &&
            mentionedCampuses.length === 0 &&
            oppBatchGroups.every(g => g.batchShort === 'wd');

        if (oppBatchGroups.length > 0 && myBatchGroups.length === 0 && !isAggregatedCampusList && !isWeekdayOnlyRegionalFallback) {
            return true;
        }

        const groupsToCheck = myBatchGroups.length > 0 ? myBatchGroups : (isWeekdayOnlyRegionalFallback ? oppBatchGroups : []);
        if (userGroup && groupsToCheck.length > 0) {
            // If the activity lists many groups (e.g. LECTURE LINKS with 6+ groups) and user is at a regional center, keep it visible
            const isBroadSharedLectureList = userCampus !== 'malabe' && mentionedCampuses.length === 0 && groupsToCheck.length >= 5;
            if (!isBroadSharedLectureList) {
                const matchesMyGroup = groupsToCheck.some(g =>
                    g.groupRaw.toLowerCase() === userGroup.cleaned ||
                    g.groupNorm === userGroup.normCode ||
                    g.groupCanonical === userGroup.canonical ||
                    g.groupRaw.replace(/\./g, '') === userGroup.digitsOnly ||
                    (userGroup.batchNum !== null && g.groupLeadNorm === String(userGroup.batchNum)) ||
                    (!g.groupCanonical.includes('.') && g.groupLeadNorm === userGroup.leadNorm)
                );
                if (!matchesMyGroup) return true;
            }
        }
    }

    // 7. Malabe vs Regional lab/batch code isolation (e.g. Y2S1.B1, Y2S1.LAB_01)
    if (userCampus === 'malabe') {
        const regionalCodeRegexes = [/\by[1-4]\.?s[1-2]\.b\d+\b/i, /\by[1-4]\.?s[1-2]\.lab_\w+\b/i];
        if (regionalCodeRegexes.some(r => r.test(lower)) && !hasMyCampus) {
            return true;
        }
    }

    // 8. Numbered Batches (Batch 1, Batch 2, Batch 3, Batch 02 + Weekend Batch)
    if (batchNumbers.length > 0) {
        // If user is at a regional center and the section HAS dedicated regional center items (e.g. BM1041 Online Quiz),
        // then unqualified "Batch 1 / Batch 2 / Batch 3" items are Malabe weekday batches and should be hidden
        if (userCampus !== 'malabe' && !hasMyCampus && context.sectionHasRegionalCampusItems) {
            if (!userGroup || userGroup.batchNum === null || !batchNumbers.includes(userGroup.batchNum)) {
                if (!(userBatch === 'weekend' && hasWeekend)) {
                    return true;
                }
            }
        }

        if (userBatch === 'weekend') {
            // Weekend student: block numbered weekday batches unless Weekend is ALSO in this item
            // OR the user is at a weekday-only regional center and the section has no regional/weekend items
            const allowForWeekdayOnlyCenter = WEEKDAY_ONLY_REGIONAL_CENTERS.has(userCampus) &&
                mentionedCampuses.length === 0 &&
                !context.sectionHasRegionalCampusItems &&
                !context.sectionHasWeekendItems;
            if (!hasWeekend && !allowForWeekdayOnlyCenter) return true;
        } else {
            // Weekday student: if user configured a specific batch/group number (e.g. "1", "2", "3", or "Batch 2 Group 3"), filter out other batches
            if (userGroup && userGroup.batchNum !== null) {
                if (!batchNumbers.includes(userGroup.batchNum)) {
                    return true;
                }
                // If both the item and the user specify a Business Faculty sub-group (e.g. "Batch 2 Group 3" vs "Batch 2 Group 4"), filter out mismatched sub-groups
                if (userGroup.subGroupNum !== null && batchSubGroups.length > 0) {
                    const matchesSubGroup = batchSubGroups.some(sg =>
                        sg.batchNum === userGroup.batchNum && sg.groupNum === userGroup.subGroupNum
                    );
                    if (!matchesSubGroup) return true;
                }
            }
        }
    }

    // 9. Opposite batch type check (Weekday vs Weekend)
    if (hasOppositeBatchType && !hasMyBatchType && !isAggregatedCampusList && !isMultiCohortMyCampus) {
        // If the user is at a regional center that only has Weekday batches (Kandy, Matara, Kurunegala)
        // and the item is an unqualified Weekday item (or a shared Weekday item when the section has no Weekend items), do not hide it
        const isSharedWeekdayGroupResource = WEEKDAY_ONLY_REGIONAL_CENTERS.has(userCampus) &&
            userBatch === 'weekend' &&
            hasWeekday &&
            mentionedCampuses.length === 0 &&
            (academicGroups.length > 0 || !context.sectionHasWeekendItems);
        if (!isSharedWeekdayGroupResource) {
            return true;
        }
    }

    return false;
}

function applyHiding(element, shouldHide) {
    if (!element) return;
    if (shouldHide && !window.SF_PEEK_ACTIVE) {
        element.dataset.sfFiltered = 'true';
        element.style.outline = '';
        element.classList.remove('sf-peek-highlight');
        if (window.CONFIG && window.CONFIG.ghostMode) {
            element.style.display = '';
            element.style.opacity = '0.25';
            element.style.transform = 'scale(0.98)';
            element.style.transition = 'all 0.3s ease';
            element.style.filter = 'grayscale(100%)';
            element.classList.add('sf-dimmed');
        } else {
            element.style.display = 'none';
            element.style.opacity = '';
            element.style.transform = '';
            element.style.filter = '';
            element.classList.remove('sf-dimmed');
        }
    } else {
        if (shouldHide && window.SF_PEEK_ACTIVE) {
            element.dataset.sfFiltered = 'peek';
            element.style.display = '';
            element.style.opacity = '0.65';
            element.style.transform = 'none';
            element.style.filter = 'none';
            element.style.outline = '1px dashed #f7b924';
            element.classList.remove('sf-dimmed');
            element.classList.add('sf-peek-highlight');
        } else {
            delete element.dataset.sfFiltered;
            element.style.display = '';
            element.style.opacity = '';
            element.style.transform = '';
            element.style.filter = '';
            element.style.outline = '';
            element.classList.remove('sf-dimmed', 'sf-peek-highlight');
        }
    }
}

function resetAllFilteredElements(root = document) {
    root.querySelectorAll('[data-sf-filtered], .sf-dimmed, .sf-peek-highlight').forEach(el => {
        delete el.dataset.sfFiltered;
        if (!el.classList.contains('moveablesection')) {
            el.style.display = '';
        }
        el.style.opacity = '';
        el.style.transform = '';
        el.style.filter = '';
        el.style.outline = '';
        el.classList.remove('sf-dimmed', 'sf-peek-highlight');
    });
}

function isCourseViewPage() {
    const path = window.location.pathname || '';
    return path.includes('/course/view.php') || path.includes('/course/section.php');
}

/**
 * Determines whether a `.modtype_label` is a short structural divider heading (e.g. "Malabe Campus", "Kandy - Weekday")
 * rather than a standalone prose announcement/notice banner (e.g. "Dear Batch 1 Malabe Students, Your 24th July HRM session...").
 */
function isStructuralSectionDivider(activity, cleanText, lower) {
    if (!activity || !activity.classList || !activity.classList.contains('modtype_label')) return false;
    if (!cleanText || cleanText.length > 85) return false;
    // Prose notices/announcements are standalone items, NOT section headers for subsequent activities
    if (/\b(?:dear\b|please\s+note|will\s+be\s+held|will\s+held|rescheduled|regards|thank\s+you|students\s+must|kindly|guidelines|venue|time\s+slots|if\s+you\s+have|uploaded\s+schedule|allocated\s+venue)\b/i.test(lower)) {
        return false;
    }
    return true;
}

/**
 * Wraps bare non-empty text nodes that are siblings of block lists (<ul>/<ol>/<p>/<strong>/<h4>-<h6>) inside `.no-overflow`
 * (such as `<h5>Malabe Weekday<ul>...</ul><strong>Malabe Weekend</strong>...</h5>` in IT2011)
 * so they can be cleanly filtered alongside `<p>`, `<strong>`, and `<li>` sub-items.
 */
function normalizeInnerSubItemHeadings(noOverflow) {
    if (!noOverflow || noOverflow.dataset.sfNormalizedHeadings === 'true') return;
    // Wrap non-empty text nodes that are siblings of block elements (ul, ol, p, strong, h1-h6) inside .no-overflow or its descendants
    const containers = [noOverflow, ...Array.from(noOverflow.querySelectorAll('*'))];
    containers.forEach(container => {
        if (['A', 'SCRIPT', 'STYLE'].includes(container.tagName)) return;
        if (container.tagName === 'LI' && container.classList.contains('activity')) return;
        if (container.tagName === 'LI' && !container.querySelector('ul, ol')) return;
        const hasSubItemSibling = Array.from(container.children).some(c =>
            ['UL', 'OL', 'P', 'STRONG', 'H4', 'H5', 'H6', 'DIV'].includes(c.tagName)
        );
        if (!hasSubItemSibling) return;
        Array.from(container.childNodes).forEach(node => {
            if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 1) {
                const span = document.createElement('span');
                span.className = 'sf-inline-text-node';
                container.insertBefore(span, node);
                span.appendChild(node);
            }
        });
    });
    noOverflow.dataset.sfNormalizedHeadings = 'true';
}

function cleanCoursePage() {
    if (!isCourseViewPage()) return { total: 0, hidden: 0, submissionsHidden: 0 };

    const courseContainer = document.querySelector('.course-content') || document.querySelector('#region-main');
    if (!courseContainer) return { total: 0, hidden: 0, submissionsHidden: 0 };

    // If filter is disabled or welcome setup not yet completed, ensure all elements are restored cleanly
    if (!window.CONFIG || !window.CONFIG.enabled || !window.CONFIG.hasSeenWelcome) {
        resetAllFilteredElements(courseContainer);
        window.SF_LAST_STATS = { total: 0, hidden: 0, submissionsHidden: 0 };
        if (typeof window.updateFilterStatsUI === 'function') {
            window.updateFilterStatsUI(window.SF_LAST_STATS);
        }
        return window.SF_LAST_STATS;
    }

    const userCampus = (window.CONFIG.campus || 'malabe').toLowerCase();
    const userBatch = (window.CONFIG.batchType || 'weekday').toLowerCase();
    const oppositeFull = userBatch === 'weekend' ? 'weekday' : 'weekend';
    const hideSubmissions = Boolean(window.CONFIG.hideSubmissions);

    const customBlacklists = window.CONFIG.customBlacklist
        ? window.CONFIG.customBlacklist.split(',').map(k => k.trim().toLowerCase()).filter(Boolean)
        : [];
    const customWhitelists = window.CONFIG.customWhitelist
        ? window.CONFIG.customWhitelist.split(',').map(k => k.trim().toLowerCase()).filter(Boolean)
        : [];

    let totalActivities = 0;
    let hiddenActivities = 0;
    let submissionsHiddenCount = 0;

    // Group activities by section so `activeCampus` and `activeBatch` NEVER leak across sections!
    const sections = Array.from(courseContainer.querySelectorAll('li.section, div.section, .course-section'));
    const processedActivities = new Set();

    const processActivityList = (activityNodes, isSectionZero = false) => {
        let activeCampus = 'all';
        let activeBatch = 'all';

        // Pre-scan the section to detect whether this section has dedicated items for the user's regional center
        // or explicitly separates `<userCampus> Weekday` and `<userCampus> Weekend`
        let sectionHasRegionalCampusItems = false;
        let sectionHasMyCampusWeekday = false;
        let sectionHasMyCampusWeekend = false;
        let sectionHasWeekendItems = false;

        activityNodes.forEach(act => {
            const t = getCleanActivityText(act);
            const l = t.toLowerCase();
            const camps = getMentionedCampuses(l);
            const isWd = hasWeekdayIndicator(t, l) || extractBatchNumbers(l).length > 0;
            const isWe = hasWeekendIndicator(t, l);
            if (isWe) sectionHasWeekendItems = true;
            if (userCampus !== 'malabe' && camps.includes(userCampus)) {
                sectionHasRegionalCampusItems = true;
                if (camps.length === 1) {
                    if (isWd && !isWe) sectionHasMyCampusWeekday = true;
                    if (isWe && !isWd) sectionHasMyCampusWeekend = true;
                }
            }
        });

        const sectionContext = {
            sectionHasRegionalCampusItems,
            sectionHasMyCampusBothBatches: sectionHasMyCampusWeekday && sectionHasMyCampusWeekend,
            sectionHasWeekendItems
        };

        activityNodes.forEach(activity => {
            if (processedActivities.has(activity)) return;
            processedActivities.add(activity);

            // Protect selector controls, dropdowns, navigation drawers, and Moodle forms
            if (activity.closest('select, .dropdown, .dropdown-menu, .groupselector, .singleselect, form, nav, header')) return;
            if (activity.querySelector('select, form, .groupselector, .singleselect')) return;

            totalActivities++;

            const text = getCleanActivityText(activity);
            const lower = text.toLowerCase();

            const mentionedCampuses = getMentionedCampuses(lower);
            const batchNumbers = extractBatchNumbers(lower);
            const academicGroups = extractAcademicGroups(lower);
            const hasWeekdayWord = hasWeekdayIndicator(text, lower);
            const hasWeekendWord = hasWeekendIndicator(text, lower);

            const isDivider = !isSectionZero && isStructuralSectionDivider(activity, text, lower);

            if (isDivider) {
                const hasBothBatches = (hasWeekdayWord || batchNumbers.length > 0) && hasWeekendWord;
                const hasMyBatchInDivider = userBatch === 'weekend' ? hasWeekendWord : (hasWeekdayWord || batchNumbers.length > 0);
                const hasOppBatchInDivider = userBatch === 'weekend' ? (hasWeekdayWord || batchNumbers.length > 0) : hasWeekendWord;

                if (mentionedCampuses.length > 0 || hasMyBatchInDivider || hasOppBatchInDivider) {
                    if (mentionedCampuses.length > 1) {
                        activeCampus = 'all';
                    } else if (mentionedCampuses.length === 1) {
                        activeCampus = mentionedCampuses[0];
                    } else {
                        activeCampus = 'all';
                    }

                    if (hasBothBatches) {
                        activeBatch = 'all';
                    } else if (hasMyBatchInDivider) {
                        activeBatch = userBatch;
                    } else if (hasOppBatchInDivider) {
                        activeBatch = oppositeFull;
                    } else {
                        activeBatch = 'all';
                    }
                } else {
                    activeCampus = 'all';
                    activeBatch = 'all';
                }
            }

            let shouldHide = false;
            let hiddenBySubmissionToggle = false;
            let forcedByCustom = null;

            if (customBlacklists.some(kw => lower.includes(kw))) forcedByCustom = true;
            if (customWhitelists.some(kw => lower.includes(kw))) forcedByCustom = false;

            const isAnnouncementsForum = activity.classList.contains('modtype_forum') && /\bannouncements?\b/i.test(lower);
            const isCoreMaterial = isCoreLearningMaterial(lower, mentionedCampuses, batchNumbers, academicGroups, hasWeekdayWord, hasWeekendWord);

            if (forcedByCustom !== null) {
                shouldHide = forcedByCustom;
            } else if (isAnnouncementsForum) {
                shouldHide = false;
            } else if (hideSubmissions && isSubmissionActivity(activity, lower)) {
                shouldHide = true;
                hiddenBySubmissionToggle = true;
            } else if (isCoreMaterial) {
                // Never allow sticky section state to hide universal lecture slides, tutorials, module outlines, or general notices
                shouldHide = false;
            } else if (shouldBlock(text, lower, sectionContext)) {
                shouldHide = true;
            } else if (!isDivider && activeCampus !== 'all' && activeCampus !== userCampus && mentionedCampuses.length === 0) {
                shouldHide = true;
            } else if (!isDivider && activeBatch !== 'all' && activeBatch !== userBatch && mentionedCampuses.length === 0 && !hasWeekdayWord && !hasWeekendWord && batchNumbers.length === 0) {
                shouldHide = true;
            }

            if (isDivider && forcedByCustom === null) {
                if ((activeCampus !== 'all' && activeCampus !== userCampus) ||
                    (activeBatch !== 'all' && activeBatch !== userBatch && !(userCampus !== 'malabe' && activeCampus === userCampus && !sectionContext.sectionHasMyCampusBothBatches))) {
                    shouldHide = true;
                }
            }

            if (shouldHide) {
                hiddenActivities++;
                if (hiddenBySubmissionToggle) submissionsHiddenCount++;
                // Reset any previously filtered inner elements so they don't double-dim (0.25 * 0.25) when the parent is dimmed
                resetAllFilteredElements(activity);
            }

            applyHiding(activity, shouldHide);

            // Filter multi-item inner lists (e.g. multiple <li>, <p>, <strong>, or inline heading nodes inside a single visible activity)
            // Only filter inner sub-items when .no-overflow actually contains multiple clickable <a> links (such as IT2011 Group Details or BM1042 Student Feedback Forms)
            if (!shouldHide) {
                const noOverflow = activity.querySelector('.no-overflow');
                if (noOverflow) {
                    const hasMultipleLinks = noOverflow.querySelectorAll('a[href]').length > 1;
                    if (hasMultipleLinks) {
                        normalizeInnerSubItemHeadings(noOverflow);
                        const candidateLists = noOverflow.querySelectorAll('li, p, strong, .sf-inline-text-node');
                        if (candidateLists.length > 1) {
                            candidateLists.forEach(el => {
                                if (el.closest('select, .dropdown, .dropdown-menu, .groupselector, .singleselect, form, nav, header')) return;
                                // Skip <strong> or <p> elements that are nested inside an inner <li> (not the outer .activity) or <a>, or that wrap a <ul>/<ol>
                                const parentLi = el.tagName !== 'LI' ? el.closest('li') : null;
                                if (parentLi && parentLi !== activity) return;
                                if (el.tagName !== 'LI' && el.closest('a')) return;
                                if (el.querySelector('ul, ol')) return;
                                if (el.tagName === 'STRONG' && el.closest('p')) return;
                                const itemText = getCleanActivityText(el);
                                if (!itemText) return;

                                const itemLower = itemText.toLowerCase();
                                let itemHide = false;
                                if (customBlacklists.some(kw => itemLower.includes(kw))) itemHide = true;
                                else if (customWhitelists.some(kw => itemLower.includes(kw))) itemHide = false;
                                else if (shouldBlock(itemText, itemLower, sectionContext)) itemHide = true;
                                applyHiding(el, itemHide);
                            });
                            // Also hide/dim any <ul>/<ol> inside .no-overflow whose <li> children are ALL filtered
                            noOverflow.querySelectorAll('ul, ol').forEach(listEl => {
                                const lis = Array.from(listEl.querySelectorAll(':scope > li'));
                                if (lis.length > 0 && lis.every(li => Boolean(li.dataset.sfFiltered))) {
                                    if (!window.CONFIG || !window.CONFIG.ghostMode) {
                                        applyHiding(listEl, true);
                                    } else {
                                        applyHiding(listEl, false);
                                    }
                                } else {
                                    applyHiding(listEl, false);
                                }
                            });
                            const actionableLinksOrLis = Array.from(noOverflow.querySelectorAll('li, p')).filter(el => el.querySelector('a'));
                            if (actionableLinksOrLis.length > 1 && actionableLinksOrLis.every(el => Boolean(el.dataset.sfFiltered))) {
                                hiddenActivities++;
                                resetAllFilteredElements(activity);
                                applyHiding(activity, true);
                            }
                        }
                    }
                }
            }
        });
    };

    if (sections.length > 0) {
        sections.forEach(sec => {
            const isSecZero = sec.id === 'section-0' || sec.id === 'section-zero-container' || sec.dataset?.section === '0';
            const acts = sec.querySelectorAll('.activity, .subtile');
            if (acts.length > 0) {
                processActivityList(acts, isSecZero);
            }

            // Also filter entire non-zero sections whose section title explicitly targets another campus/batch
            // (e.g. "Attendance Batch 1", "Attendance Weekend Batch", "Guest session (Malabe)") when all inner activities are hidden or empty
            if (!isSecZero) {
                const headerEl = sec.querySelector('.sectionname, .section-title, h3');
                if (headerEl) {
                    const secTitle = getCleanActivityText(headerEl);
                    const secLower = secTitle.toLowerCase();
                    const secShouldBlock = shouldBlock(secTitle, secLower);
                    const visibleActsInSec = Array.from(acts).filter(a => !a.dataset.sfFiltered);
                    applyHiding(sec, secShouldBlock && visibleActsInSec.length === 0);
                }
            }
        });
    }

    // Filter top-level `li.tile` elements in `format_tiles` courses (e.g. `li.tile#tile-11` "Quiz Malabe Center" in BM1045)
    const tiles = courseContainer.querySelectorAll('li.tile');
    tiles.forEach(tile => {
        if (tile.id === 'section-0' || tile.dataset?.section === '0') return;
        const titleEl = tile.querySelector('.tile-text, h3') || tile;
        const tileText = getCleanActivityText(titleEl);
        const tileLower = tileText.toLowerCase();
        totalActivities++;
        let tileHide = false;
        if (customBlacklists.some(kw => tileLower.includes(kw))) tileHide = true;
        else if (customWhitelists.some(kw => tileLower.includes(kw))) tileHide = false;
        else if (shouldBlock(tileText, tileLower)) tileHide = true;
        if (tileHide) hiddenActivities++;
        applyHiding(tile, tileHide);
    });

    // Fallback for any activities not nested inside standard section containers
    const remainingActivities = courseContainer.querySelectorAll('.activity, .subtile');
    if (remainingActivities.length > 0) {
        processActivityList(remainingActivities, false);
    }

    window.SF_LAST_STATS = {
        total: totalActivities,
        hidden: hiddenActivities,
        submissionsHidden: submissionsHiddenCount
    };

    if (typeof window.updateFilterStatsUI === 'function') {
        window.updateFilterStatsUI(window.SF_LAST_STATS);
    }

    return window.SF_LAST_STATS;
}

window.CAMPUS_ALIASES = CAMPUS_ALIASES;
window.containsKeyword = containsKeyword;
window.getMentionedCampuses = getMentionedCampuses;
window.extractBatchNumbers = extractBatchNumbers;
window.extractBatchSubGroups = extractBatchSubGroups;
window.extractAcademicGroups = extractAcademicGroups;
window.parseUserGroup = parseUserGroup;
window.hasWeekdayIndicator = hasWeekdayIndicator;
window.hasWeekendIndicator = hasWeekendIndicator;
window.getCleanActivityText = getCleanActivityText;
window.isSubmissionActivity = isSubmissionActivity;
window.isCoreLearningMaterial = isCoreLearningMaterial;
window.isStructuralSectionDivider = isStructuralSectionDivider;
window.shouldBlock = shouldBlock;
window.applyHiding = applyHiding;
window.cleanCoursePage = cleanCoursePage;
window.resetAllFilteredElements = resetAllFilteredElements;
