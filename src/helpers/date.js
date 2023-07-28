export function monthDiff(from, to) {
    let months = to.getMonth() - from.getMonth() + 12 * (to.getFullYear() - from.getFullYear());

    if (to.getDate() < from.getDate()) {
        months--;
    }
    return months;
}

export function daysDiff(from, to) {
    const diff = to.getTime() - from.getTime();
    return diff / (1000 * 3600 * 24);
}

export function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function addMonths(date, month) {
    let result = new Date(date);
    result.setMonth(result.getMonth() + month);
    return result;
}

export function addWeeks(date, week) {
    let result = new Date(date);
    result.setDate(result.getDate() + week * 7);
    return result;
}

export function addYears(date, year) {
    let result = new Date(date);
    result.setFullYear(result.getFullYear() + year);
    return result;
}

export function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

export function subMonths(date, month) {
    date.setMonth(date.getMonth() - month);
    return date;
}
