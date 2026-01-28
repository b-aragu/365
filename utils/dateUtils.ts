import { format, getDayOfYear as getFnsDayOfYear, isLeapYear as fnsIsLeapYear, differenceInDays, startOfYear, endOfYear, eachDayOfInterval } from 'date-fns';

export const getDayOfYear = (date: Date): number => {
    return getFnsDayOfYear(date);
};

export const isLeapYear = (year: number): boolean => {
    return fnsIsLeapYear(new Date(year, 0, 1));
};

export const getDaysInYear = (year: number): number => {
    return isLeapYear(year) ? 366 : 365;
};

export const getDaysRemaining = (): number => {
    const today = new Date();
    const lastDay = endOfYear(today);
    return differenceInDays(lastDay, today);
};

export const generateYearDays = (year: number) => {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));

    return eachDayOfInterval({ start, end }).map(date => ({
        date: format(date, 'yyyy-MM-dd'),
        dayOfYear: getDayOfYear(date),
        month: date.getMonth(),
        day: date.getDate(),
    }));
};


export const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'MMMM d, yyyy');
};

export const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
