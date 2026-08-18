const RULES_URL = 'https://raw.githubusercontent.com/dulithdivisekara/sliit-courseweb-cleaner/main/rules.json';

chrome.runtime.onInstalled.addListener(() => {
    // Initial fetch on install
    fetchAndSaveRules();
    
    // Set up alarm to fetch rules every 24 hours
    chrome.alarms.create('fetchRulesAlarm', { periodInMinutes: 1440 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'fetchRulesAlarm') {
        fetchAndSaveRules();
    }
});

async function fetchAndSaveRules() {
    try {
        const response = await fetch(RULES_URL);
        
        if (!response.ok) {
            // Fault tolerance: If the file isn't on GitHub yet (404/403), silently fail.
            // The extension will naturally fall back to the built-in rules in shared-core.js.
            console.info(`[Courseweb Cleaner] Remote rules not found (HTTP ${response.status}). Using secure local fallback rules.`);
            return;
        }
        
        const rules = await response.json();
        
        // Save the rules to local storage
        await chrome.storage.local.set({ remoteRules: rules });
        console.info('[Courseweb Cleaner] Successfully synced latest community rules.', rules);
    } catch (error) {
        // Handle network drops (e.g., offline) gracefully without throwing red console errors
        console.info('[Courseweb Cleaner] Offline or network error. Using secure local fallback rules.');
    }
}
