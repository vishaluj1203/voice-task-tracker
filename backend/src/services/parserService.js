const { addDays, addWeeks, nextMonday, nextTuesday, nextWednesday, nextThursday, nextFriday, nextSaturday, nextSunday } = require('date-fns');

/**
 * Extract priority from text
 */
const extractPriority = (lowerText) => {
    if (lowerText.includes('urgent') || lowerText.includes('critical')) {
        return 'URGENT';
    }
    if (lowerText.includes('high priority') || lowerText.includes('high')) {
        return 'HIGH';
    }
    if (lowerText.includes('low priority') || lowerText.includes('low')) {
        return 'LOW';
    }
    return 'MEDIUM';
};

/**
 * Extract status from text
 */
const extractStatus = (lowerText) => {
    if (lowerText.includes('in progress')) {
        return 'IN_PROGRESS';
    }
    if (lowerText.includes('done') || lowerText.includes('completed')) {
        return 'DONE';
    }
    return 'TODO';
};

/**
 * Parse relative dates (in X days/weeks)
 */
const parseRelativeDates = (lowerText, today) => {
    const inDaysMatch = lowerText.match(/in (\d+) days?/);
    if (inDaysMatch) {
        const days = parseInt(inDaysMatch[1]);
        return addDays(today, days);
    }

    const inWeeksMatch = lowerText.match(/in (\d+) weeks?/);
    if (inWeeksMatch) {
        const weeks = parseInt(inWeeksMatch[1]);
        return addWeeks(today, weeks);
    }

    return null;
};

/**
 * Parse simple relative dates (today, tomorrow)
 */
const parseSimpleRelativeDates = (lowerText, today) => {
    if (lowerText.includes('tomorrow')) {
        return addDays(today, 1);
    }
    if (lowerText.includes('today')) {
        return today;
    }
    return null;
};

/**
 * Parse weekday dates (Monday, Tuesday, etc.)
 */
const parseWeekdayDates = (lowerText, today) => {
    const weekdays = [
        { patterns: ['next monday', /\b(by|due|before)\s+monday\b/], fn: nextMonday },
        { patterns: ['next tuesday', /\b(by|due|before)\s+tuesday\b/], fn: nextTuesday },
        { patterns: ['next wednesday', /\b(by|due|before)\s+wednesday\b/], fn: nextWednesday },
        { patterns: ['next thursday', /\b(by|due|before)\s+thursday\b/], fn: nextThursday },
        { patterns: ['next friday', /\b(by|due|before)\s+friday\b/], fn: nextFriday },
        { patterns: ['next saturday', /\b(by|due|before)\s+saturday\b/], fn: nextSaturday },
        { patterns: ['next sunday', /\b(by|due|before)\s+sunday\b/], fn: nextSunday }
    ];

    for (const weekday of weekdays) {
        for (const pattern of weekday.patterns) {
            if (typeof pattern === 'string' && lowerText.includes(pattern)) {
                return weekday.fn(today);
            }
            if (pattern instanceof RegExp && lowerText.match(pattern)) {
                return weekday.fn(today);
            }
        }
    }

    return null;
};

/**
 * Parse absolute dates (15th January, Jan 20, etc.)
 */
const parseAbsoluteDates = (text, today) => {
    const monthMap = {
        'january': 0, 'jan': 0,
        'february': 1, 'feb': 1,
        'march': 2, 'mar': 2,
        'april': 3, 'apr': 3,
        'may': 4,
        'june': 5, 'jun': 5,
        'july': 6, 'jul': 6,
        'august': 7, 'aug': 7,
        'september': 8, 'sep': 8,
        'october': 9, 'oct': 9,
        'november': 10, 'nov': 10,
        'december': 11, 'dec': 11
    };

    const dateFormats = [
        /(\d{1,2})(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i,
        /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(st|nd|rd|th)?/i,
        /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(st|nd|rd|th)?/i,
        /(\d{1,2})(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i
    ];

    for (const format of dateFormats) {
        const match = text.match(format);
        if (match) {
            let day, month;

            if (match[1].match(/\d/)) {
                // Day comes first
                day = parseInt(match[1]);
                month = match[3] || match[2];
            } else {
                // Month comes first
                month = match[1];
                day = parseInt(match[2]);
            }

            const monthIndex = monthMap[month.toLowerCase()];
            if (monthIndex !== undefined) {
                const parsedDate = new Date(today.getFullYear(), monthIndex, day);
                // If the date is in the past, assume next year
                if (parsedDate < today) {
                    parsedDate.setFullYear(today.getFullYear() + 1);
                }
                return parsedDate;
            }
        }
    }

    return null;
};

/**
 * Extract time from text and apply to date
 */
const extractTime = (lowerText, parsedDate) => {
    let hours = 9; // Default to 9 AM
    let minutes = 0;

    const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
    if (timeMatch) {
        let h = parseInt(timeMatch[1]);
        const m = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3];

        if (period === 'pm' && h < 12) h += 12;
        if (period === 'am' && h === 12) h = 0;

        hours = h;
        minutes = m;
    } else if (lowerText.includes('evening')) {
        hours = 18; // 6 PM
    } else if (lowerText.includes('morning')) {
        hours = 9; // 9 AM
    } else if (lowerText.includes('afternoon')) {
        hours = 14; // 2 PM
    } else if (lowerText.includes('night')) {
        hours = 20; // 8 PM
    }

    parsedDate.setHours(hours, minutes, 0, 0);
    return parsedDate;
};

/**
 * Clean up title by removing all date/time/priority/status keywords
 */
const cleanTitle = (text) => {
    let cleanedTitle = text
        .replace(/^(create|add|make|start)\s+(a\s+)?(new\s+)?(task|todo|item)\s+(to|for)?/gi, '')
        .replace(/^(remind|tell|ask)\s+(me\s+)?(to)?/gi, '')
        .replace(/high priority|low priority|urgent|critical/gi, '')
        .replace(/in progress|done|completed|to do/gi, '')
        .replace(/tomorrow|today/gi, '')
        .replace(/next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, '')
        .replace(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '')
        .replace(/in \d+ (days?|weeks?)/gi, '')
        .replace(/(\d{1,2})(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/gi, '')
        .replace(/(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(st|nd|rd|th)?/gi, '')
        .replace(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(st|nd|rd|th)?/gi, '')
        .replace(/(\d{1,2})(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/gi, '')
        .replace(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/gi, '')
        .replace(/evening|morning|afternoon|night/gi, '')
        .replace(/\b(by|at|on|due|before)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Capitalize first letter
    if (cleanedTitle.length > 0) {
        return cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);
    }

    return cleanedTitle;
};

/**
 * Main parser function
 */
const parseTask = (text) => {
    const lowerText = text.toLowerCase();
    const today = new Date();

    // Extract components
    const priority = extractPriority(lowerText);
    const status = extractStatus(lowerText);

    // Parse date - try different strategies in order
    let parsedDate = parseRelativeDates(lowerText, today)
        || parseSimpleRelativeDates(lowerText, today)
        || parseWeekdayDates(lowerText, today)
        || parseAbsoluteDates(text, today);

    // Extract time if we have a date
    let dueDate = null;
    if (parsedDate) {
        dueDate = extractTime(lowerText, parsedDate);
    }

    // Clean up title
    const title = cleanTitle(text);

    return {
        title,
        priority,
        dueDate,
        status
    };
};

module.exports = { parseTask };
