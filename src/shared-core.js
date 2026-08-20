// --- SHARED CORE LOGIC ---
const DEFAULT_CAMPUSES = [
    'malabe', 'kandy', 'kurunegala', 'kurunegale', 'metro',
    'matara', 'mathara', 'jaffna', 'northern', 'nothern', 'nu group', 'nu dataset'
];

function getMergedCampuses() {
    const remoteRules = window.REMOTE_RULES || {};
    const remoteCampuses = remoteRules.campuses || [];
    return Array.from(new Set([...DEFAULT_CAMPUSES, ...remoteCampuses]));
}

function shouldBlock(text, lower) {
    if (!lower) return false;

    // 1. Custom Blacklist check
    if (window.CONFIG.customBlacklist) {
        const blacklists = window.CONFIG.customBlacklist.split(',').map(k => k.trim().toLowerCase()).filter(k=>k);
        if (blacklists.some(keyword => lower.includes(keyword))) return true;
    }

    // 2. Custom Whitelist check
    if (window.CONFIG.customWhitelist) {
        const whitelists = window.CONFIG.customWhitelist.split(',').map(k => k.trim().toLowerCase()).filter(k=>k);
        if (whitelists.some(keyword => lower.includes(keyword))) return false;
    }

    const remoteRules = window.REMOTE_RULES || {};
    const campuses = getMergedCampuses();
    const foreignCampuses = campuses.filter(c => c !== window.CONFIG.campus);
    const oppositeFull = window.CONFIG.batchType === 'weekend' ? 'weekday' : 'weekend';
    const oppositeShort = window.CONFIG.batchTypeShort === 'we' ? 'wd' : 'we';

    const hasMyCampus = lower.includes(window.CONFIG.campus);
    const hasForeignCampus = foreignCampuses.some(c => lower.includes(c));
    const isAggregatedCampusList = hasMyCampus && hasForeignCampus;

    const hasMyBatchFull = lower.includes(window.CONFIG.batchType);
    const hasOppositeFull = lower.includes(oppositeFull);
    const isAggregatedBatchList = hasMyBatchFull && hasOppositeFull;

    const hasMyShort = lower.includes(`.${window.CONFIG.batchTypeShort}.`) || lower.includes(`${window.CONFIG.batchTypeShort}.it`);
    const hasOppositeShort = lower.includes(`.${oppositeShort}.`) || lower.includes(`${oppositeShort}.it`);
    const isAggregatedShortList = hasMyShort && hasOppositeShort;

    if (window.CONFIG.groupId) {
        const otherGroupsRegex = new RegExp(`y2\\.s1\\.${window.CONFIG.batchTypeShort}\\.it\\.(?!${window.CONFIG.groupId})\\d+`, 'i');
        const myGroupRegex = new RegExp(`y2\\.s1\\.${window.CONFIG.batchTypeShort}\\.it\\.${window.CONFIG.groupId}`, 'i');
        if (otherGroupsRegex.test(lower) && !myGroupRegex.test(lower)) return true;
    }

    if (hasOppositeShort && !isAggregatedShortList && !isAggregatedCampusList) return true;
    if (hasOppositeFull && !isAggregatedBatchList && !isAggregatedCampusList) return true;
    if (hasForeignCampus && !isAggregatedCampusList) return true;

    if (window.CONFIG.campus === 'malabe') {
        const malabeBlockRegexes = remoteRules.malabeBlockRegexes ?
            remoteRules.malabeBlockRegexes.map(r => new RegExp(r, 'i')) :
            [/\bbatch\s*\d+\b/i, /\by2s1\.b\d+/i, /\by2s1\.lab_\w+/i];

        if (malabeBlockRegexes.some(regex => regex.test(lower))) {
            if (window.CONFIG.batchType === 'weekday' && lower.includes('malabe') && !lower.includes('weekend')) return false;
            if (window.CONFIG.batchType === 'weekend' && lower.includes('malabe') && lower.includes('weekend')) return false;
            return true;
        }
    }

    if (window.CONFIG.campus !== 'malabe') {
        if (/y2\.s1\.(wd|we)\.it\.?\d+/i.test(lower) && !isAggregatedCampusList && !hasMyCampus && !/\by2s1\.b\d+/i.test(lower)) return true;
    }

    return false;
}

function applyHiding(element, shouldHide) {
    if (shouldHide) {
        if (window.CONFIG.ghostMode) {
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
    // DOUBLE-LOCK DEFENSE: Prevent execution if disabled or setup is incomplete
    if (!window.CONFIG || !window.CONFIG.enabled || !window.CONFIG.hasSeenWelcome) return;

    const activities = document.querySelectorAll('.activity');
    const remoteRules = window.REMOTE_RULES || {};
    const campuses = getMergedCampuses();
    const foreignCampuses = campuses.filter(c => c !== window.CONFIG.campus);
    const oppositeFull = window.CONFIG.batchType === 'weekend' ? 'weekday' : 'weekend';
    const oppositeShort = window.CONFIG.batchTypeShort === 'we' ? 'wd' : 'we';

    let activeCampus = 'all';
    let activeBatch = 'all';

    const customBlacklists = window.CONFIG.customBlacklist ? window.CONFIG.customBlacklist.split(',').map(k => k.trim().toLowerCase()).filter(k=>k) : [];
    const customWhitelists = window.CONFIG.customWhitelist ? window.CONFIG.customWhitelist.split(',').map(k => k.trim().toLowerCase()).filter(k=>k) : [];
    const ignoreKeywords = remoteRules.ignoreKeywords || ['notice', 'rescheduled', 'announcement', 'general'];

    activities.forEach(activity => {
        const text = activity.innerText;
        const lower = text.toLowerCase();
        const isTitle = activity.classList.contains('modtype_label') || activity.querySelector('h1, h2, h3, h4, h5');

        if (isTitle) {
            const foundCampuses = campuses.filter(c => lower.includes(c));
            const hasBothBatches = lower.includes(window.CONFIG.batchType) && lower.includes(oppositeFull);

            if (foundCampuses.length > 0 || lower.includes(window.CONFIG.batchType) || lower.includes(oppositeFull)) {
                if (foundCampuses.length > 1) {
                    activeCampus = 'all';
                } else if (foundCampuses.length === 1) {
                    activeCampus = foundCampuses[0];
                }

                if (hasBothBatches) {
                    activeBatch = 'all';
                } else if (lower.includes(window.CONFIG.batchType)) {
                    activeBatch = window.CONFIG.batchType;
                } else if (lower.includes(oppositeFull)) {
                    activeBatch = oppositeFull;
                }

                if (foundCampuses.length > 0 && !hasBothBatches && !lower.includes(window.CONFIG.batchType) && !lower.includes(oppositeFull)) {
                    activeBatch = 'all';
                }
                if (foundCampuses.length === 0 && (lower.includes(window.CONFIG.batchType) || lower.includes(oppositeFull))) {
                    activeCampus = 'all';
                }
            } else {
                activeCampus = 'all';
                activeBatch = 'all';
            }
        }

        let shouldHide = false;
        let forcedByCustom = null;

        const hasMyShort = lower.includes(`.${window.CONFIG.batchTypeShort}.`) || lower.includes(`${window.CONFIG.batchTypeShort}.it`);
        const hasOppositeShort = lower.includes(`.${oppositeShort}.`) || lower.includes(`${oppositeShort}.it`);

        // Smart Campus check for explicitlyMine override
        let impliesMyCampus = window.CONFIG.campus === 'malabe'
            ? !foreignCampuses.some(c => lower.includes(c))
            : lower.includes(window.CONFIG.campus);

        const explicitlyMine = hasMyShort && !hasOppositeShort && impliesMyCampus;

        if (customBlacklists.some(kw => lower.includes(kw))) forcedByCustom = true;
        if (customWhitelists.some(kw => lower.includes(kw))) forcedByCustom = false;

        if (forcedByCustom !== null) {
            shouldHide = forcedByCustom;
        } else if (window.CONFIG.groupId && lower.includes(`y2.s1.${window.CONFIG.batchTypeShort}.it.${window.CONFIG.groupId}`)) {
            shouldHide = false;
        } else if (explicitlyMine) {
            shouldHide = false;
        } else if (ignoreKeywords.some(kw => lower.includes(kw))) {
            shouldHide = false;
        } else if (activeCampus !== 'all' && activeCampus !== window.CONFIG.campus) {
            shouldHide = true;
        } else if (activeBatch !== 'all' && activeBatch !== window.CONFIG.batchType) {
            shouldHide = true;
        } else if (shouldBlock(text, lower)) {
            shouldHide = true;
        }

        if (isTitle && forcedByCustom === null) {
            if ((activeCampus !== 'all' && activeCampus !== window.CONFIG.campus) ||
                (activeBatch !== 'all' && activeBatch !== window.CONFIG.batchType)) {
                shouldHide = true;
            } else {
                shouldHide = false;
            }
        }
        applyHiding(activity, shouldHide);
    });

    const innerElements = document.querySelectorAll('.no-overflow p, .no-overflow li, .no-overflow div');
    innerElements.forEach(el => {
        if (el.children.length > 2 && el.tagName === 'DIV') return;
        const lowerText = el.innerText.toLowerCase();

        let forcedByCustom = null;
        if (customBlacklists.some(kw => lowerText.includes(kw))) forcedByCustom = true;
        if (customWhitelists.some(kw => lowerText.includes(kw))) forcedByCustom = false;

        const hasMyShortInner = lowerText.includes(`.${window.CONFIG.batchTypeShort}.`) || lowerText.includes(`${window.CONFIG.batchTypeShort}.it`);
        const hasOppositeShortInner = lowerText.includes(`.${oppositeShort}.`) || lowerText.includes(`${oppositeShort}.it`);

        // Smart Campus check for inner elements explicitlyMine override
        let impliesMyCampusInner = window.CONFIG.campus === 'malabe'
            ? !foreignCampuses.some(c => lowerText.includes(c))
            : lowerText.includes(window.CONFIG.campus);

        const explicitlyMineInner = hasMyShortInner && !hasOppositeShortInner && impliesMyCampusInner;

        if (forcedByCustom !== null) {
            applyHiding(el, forcedByCustom);
        } else if (window.CONFIG.groupId && lowerText.includes(`y2.s1.${window.CONFIG.batchTypeShort}.it.${window.CONFIG.groupId}`)) {
            applyHiding(el, false);
        } else if (explicitlyMineInner) {
            applyHiding(el, false);
        } else if (ignoreKeywords.some(kw => lowerText.includes(kw))) {
            applyHiding(el, false);
        } else if (shouldBlock(el.innerText, lowerText)) {
            applyHiding(el, true);
        }
    });
}