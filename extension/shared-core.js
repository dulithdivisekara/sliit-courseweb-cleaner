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
