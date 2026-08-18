// --- SHARED CORE LOGIC ---
function shouldBlock(text, lower) {
    if (!lower) return false;

    const campuses = ['malabe', 'kandy', 'kurunegal', 'metro', 'matara', 'mathara', 'jaffna', 'northern', 'nothern', 'nu group', 'nu dataset'];
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
        const malabeBlockRegexes = [/\bbatch\s*\d+\b/i, /\by2s1\.b\d+/i, /\by2s1\.lab_\w+/i];
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
    if (!window.CONFIG.enabled) return;

    const activities = document.querySelectorAll('.activity');
    const campuses = ['malabe', 'kandy', 'kurunegal', 'metro', 'matara', 'mathara', 'jaffna', 'northern', 'nothern', 'nu group', 'nu dataset'];
    const oppositeFull = window.CONFIG.batchType === 'weekend' ? 'weekday' : 'weekend';

    let activeCampus = 'all';
    let activeBatch = 'all';

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

        if (window.CONFIG.groupId && lower.includes(`y2.s1.${window.CONFIG.batchTypeShort}.it.${window.CONFIG.groupId}`)) {
            shouldHide = false;
        } else if (lower.includes('notice') || lower.includes('rescheduled') || lower.includes('announcement')) {
            shouldHide = false;
        } else if (activeCampus !== 'all' && activeCampus !== window.CONFIG.campus) {
            shouldHide = true;
        } else if (activeBatch !== 'all' && activeBatch !== window.CONFIG.batchType) {
            shouldHide = true;
        } else if (shouldBlock(text, lower)) {
            shouldHide = true;
        }

        if (isTitle) {
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

        if (window.CONFIG.groupId && lowerText.includes(`y2.s1.${window.CONFIG.batchTypeShort}.it.${window.CONFIG.groupId}`)) {
            applyHiding(el, false);
        } else if (lowerText.includes('notice') || lowerText.includes('general')) {
            applyHiding(el, false);
        } else if (shouldBlock(el.innerText, lowerText)) {
            applyHiding(el, true);
        }
    });
}