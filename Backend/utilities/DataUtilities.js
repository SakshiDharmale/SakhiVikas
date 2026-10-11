import dayjs from 'dayjs';

export const getDateRange = (range) => {
    if (range && typeof range === 'object' && range.start && range.end) {
        return { start: range.start, end: range.end };
    }

    const today = dayjs().startOf('day');

    // "1m", "2m", "3m" ... = rolling last N months
    const m = /^(\d{1,2})m$/.exec(range);
    if (m) {
        return {
            start: today.subtract(Number(m[1]), 'month').toDate(),
            end: today.toDate()
        };
    }

    let start;
    switch (range) {
        case 'daily':
            start = today;
            break;
        case 'weekly':                                   // week starts Monday
            start = today.subtract((today.day() + 6) % 7, 'day');
            break;
        case 'monthly':
            start = today.startOf('month');
            break;
        case 'yearly':
            start = today.startOf('year');
            break;
        default:
            throw new Error(`Invalid range: ${range}`);
    }

    return { start: start.toDate(), end: today.toDate() };
};
