export interface JournalEntry {
    id: string;
    date: string; // ISO 8601 YYYY-MM-DD
    dayOfYear: number;
    year: number;
    content: string;
    wordCount: number;
    plantIconId: string;
    createdAt: string; // ISO timestamp
    updatedAt?: string; // ISO timestamp
}

export interface PlantIcon {
    id: string;
    name: string;
    category: string;
    svgPath?: string; // We might use a component mapping instead
    color: string;
}

export interface AppSettings {
    theme: 'dark' | 'light';
    isHapticEnabled: boolean;
}

export interface YearData {
    year: number;
    totalDays: number;
    daysRemaining: number;
    entries: JournalEntry[];
    completionPercentage: number;
}
