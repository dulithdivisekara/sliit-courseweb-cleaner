// --- SHARED CORE LOGIC ---
const STATE = {
    compiled: false,
    campuses: [],
    foreignCampuses: [],
    oppositeFull: '',
    oppositeShort: '',
    myGroupRegex: null,
    otherGroupsRegex: null,
    malabeBlockRegexes: [],
    ignoreKeywords: [],
    whitelist: [],
    blacklist: []
};

function initFilters() {
    if (STATE.compiled) return;

    const rules = window.REMOTE_RULES || {
        campuses: ['malabe', 'kandy', 'kurunegala', 'metro', 'matara', 'mathara', 'jaffna', 'northern', 'nothern', 'nu group', 'nu dataset'],
        ignoreKeywords: ['notice', 'rescheduled', 'announcement', 'general'],
        malabeBlockRegexes: ["\\bbatch\\s*\\d+\\b", "\\by2s1\\.b\\d+", "\\by2s1\\.lab_\\w+"]
    };

    STATE.campuses = rules.campuses;
    STATE.foreignCampuses = STATE.campuses.filter(c => c !== window.CONFIG.campus);
    STATE.oppositeFull = window.CONFIG.batchType === 'weekend' ? 'weekday' : 'weekend';
    STATE.oppositeShort = window.CONFIG.batchTypeShort === 'we' ? 'wd' : 'we';

    if (window.CONFIG.groupId) {
        STATE.otherGroupsRegex = new RegExp(`y2\\.s1\\.${window.CONFIG.batchTypeShort}\\.it\\.(?!${window.CONFIG.groupId})\\d+`, 'i');
        STATE.myGroupRegex = new RegExp(`y2\\.s1\\.${window.CONFIG.batchTypeShort}\\.it\\.${window.CONFIG.groupId}`, 'i');
    }

    STATE.malabeBlockRegexes = (rules.malabeBlockRegexes || []).map(r => new RegExp(r, 'i'));
    STATE.ignoreKeywords = rules.ignoreKeywords || [];
    
    // Parse custom keywords
    STATE.whitelist = (window.CONFIG.customWhitelist || '').split(',').map(s => s.trim().toLowerCase()).filter(s => s);
    STATE.blacklist = (window.CONFIG.customBlacklist || '').split(',').map(s => s.trim().toLowerCase()).filter(s => s);

    STATE.compiled = true;
}

function shouldBlock(text, lower) {
    if (!lower) return false;

    // 1. Custom Blacklist check
    if (STATE.blacklist.some(keyword => lower.includes(keyword))) {
        return true;
    }

    // 2. Custom Whitelist check
    if (STATE.whitelist.some(keyword => lower.includes(keyword))) {
        return false;
    }

    const hasMyCampus = lower.includes(window.CONFIG.campus);
    const hasForeignCampus = STATE.foreignCampuses.some(c => lower.includes(c));
    const isAggregatedCampusList = hasMyCampus && hasForeignCampus;

    const hasMyBatchFull = lower.includes(window.CONFIG.batchType);
    const hasOppositeFull = lower.includes(STATE.oppositeFull);
    const isAggregatedBatchList = hasMyBatchFull && hasOppositeFull;

    const hasMyShort = lower.includes(`.${window.CONFIG.batchTypeShort}.`) || lower.includes(`${window.CONFIG.batchTypeShort}.it`);
    const hasOppositeShort = lower.includes(`.${STATE.oppositeShort}.`) || lower.includes(`${STATE.oppositeShort}.it`);
    const isAggregatedShortList = hasMyShort && hasOppositeShort;

    if (window.CONFIG.groupId && STATE.otherGroupsRegex) {
        if (STATE.otherGroupsRegex.test(lower) && !STATE.myGroupRegex.test(lower)) return true;
    }

    if (hasOppositeShort && !isAggregatedShortList && !isAggregatedCampusList) return true;
    if (hasOppositeFull && !isAggregatedBatchList && !isAggregatedCampusList) return true;
    if (hasForeignCampus && !isAggregatedCampusList) return true;

    if (window.CONFIG.campus === 'malabe') {
        if (STATE.malabeBlockRegexes.some(regex => regex.test(lower))) {
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
    if (!window.CONFIG.enabled) return;
    initFilters();

    const activities = document.querySelectorAll('.activity');
    let activeCampus = 'all';
    let activeBatch = 'all';

    activities.forEach(activity => {
        const text = activity.innerText;
        const lower = text.toLowerCase();
        const isTitle = activity.classList.contains('modtype_label') || activity.querySelector('h1, h2, h3, h4, h5');

        if (isTitle) {
            const foundCampuses = STATE.campuses.filter(c => lower.includes(c));
            const hasBothBatches = lower.includes(window.CONFIG.batchType) && lower.includes(STATE.oppositeFull);

            if (foundCampuses.length > 0 || lower.includes(window.CONFIG.batchType) || lower.includes(STATE.oppositeFull)) {
                if (foundCampuses.length > 1) {
                    activeCampus = 'all';
                } else if (foundCampuses.length === 1) {
                    activeCampus = foundCampuses[0];
                }

                if (hasBothBatches) {
                    activeBatch = 'all';
                } else if (lower.includes(window.CONFIG.batchType)) {
                    activeBatch = window.CONFIG.batchType;
                } else if (lower.includes(STATE.oppositeFull)) {
                    activeBatch = STATE.oppositeFull;
                }

                if (foundCampuses.length > 0 && !hasBothBatches && !lower.includes(window.CONFIG.batchType) && !lower.includes(STATE.oppositeFull)) {
                    activeBatch = 'all';
                }
                if (foundCampuses.length === 0 && (lower.includes(window.CONFIG.batchType) || lower.includes(STATE.oppositeFull))) {
                    activeCampus = 'all';
                }
            } else {
                activeCampus = 'all';
                activeBatch = 'all';
            }
        }

        let shouldHide = false;

        // Custom Whitelist/Blacklist take highest priority
        if (STATE.blacklist.some(kw => lower.includes(kw))) {
            shouldHide = true;
        } else if (STATE.whitelist.some(kw => lower.includes(kw))) {
            shouldHide = false;
        } else if (window.CONFIG.groupId && STATE.myGroupRegex && STATE.myGroupRegex.test(lower)) {
            shouldHide = false;
        } else if (STATE.ignoreKeywords.some(kw => lower.includes(kw))) {
            shouldHide = false;
        } else if (activeCampus !== 'all' && activeCampus !== window.CONFIG.campus) {
            shouldHide = true;
        } else if (activeBatch !== 'all' && activeBatch !== window.CONFIG.batchType) {
            shouldHide = true;
        } else if (shouldBlock(text, lower)) {
            shouldHide = true;
        }

        if (isTitle && !STATE.blacklist.some(kw => lower.includes(kw)) && !STATE.whitelist.some(kw => lower.includes(kw))) {
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

        if (STATE.blacklist.some(kw => lowerText.includes(kw))) {
            applyHiding(el, true);
        } else if (STATE.whitelist.some(kw => lowerText.includes(kw))) {
            applyHiding(el, false);
        } else if (window.CONFIG.groupId && STATE.myGroupRegex && STATE.myGroupRegex.test(lowerText)) {
            applyHiding(el, false);
        } else if (STATE.ignoreKeywords.some(kw => lowerText.includes(kw))) {
            applyHiding(el, false);
        } else if (shouldBlock(el.innerText, lowerText)) {
            applyHiding(el, true);
        }
    });
}