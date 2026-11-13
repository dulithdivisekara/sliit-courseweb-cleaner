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
