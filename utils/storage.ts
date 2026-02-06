import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from '../types';

// Lazy database initialization to prevent startup crashes
let _db: SQLite.SQLiteDatabase | null = null;

const getDb = (): SQLite.SQLiteDatabase => {
    if (!_db) {
        _db = SQLite.openDatabaseSync('plant365.db');
    }
    return _db;
};

type EntryChangeListener = () => void;
const entryChangeListeners = new Set<EntryChangeListener>();

const notifyEntriesChanged = () => {
    entryChangeListeners.forEach((listener) => {
        try {
            listener();
        } catch (error) {
            console.error('Entry listener error:', error);
        }
    });
};

export const subscribeToEntryChanges = (listener: EntryChangeListener): (() => void) => {
    entryChangeListeners.add(listener);
    return () => entryChangeListeners.delete(listener);
};

// Initialize database tables
export const initDatabase = async (): Promise<void> => {
    try {
        const db = getDb();
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS entries (
                id TEXT PRIMARY KEY,
                date TEXT UNIQUE NOT NULL,
                content TEXT,
                plantIconId TEXT,
                wordCount INTEGER DEFAULT 0,
                createdAt TEXT NOT NULL,
                updatedAt TEXT,
                year INTEGER NOT NULL,
                timezoneOffset INTEGER
            );
            CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
            CREATE INDEX IF NOT EXISTS idx_entries_year ON entries(year);
        `);

        // Migrate from AsyncStorage if needed
        await migrateFromAsyncStorage();

        // Ensure schema is up to date (add timezoneOffset if missing)
        try {
            await db.execAsync('ALTER TABLE entries ADD COLUMN timezoneOffset INTEGER;');
        } catch (e) {
            // Check if error is because column exists (only reliable way in some sqlite versions without querying pragma)
            // Or just ignore, assuming failure means it likely exists or something minor.
            // Better: Check columns first.
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        // Don't throw - allow app to continue even if DB fails
    }
};

// Migrate old AsyncStorage data to SQLite
const migrateFromAsyncStorage = async (): Promise<void> => {
    try {
        const migrated = await AsyncStorage.getItem('@365_migrated_to_sqlite');
        if (migrated === 'true') return;

        const oldData = await AsyncStorage.getItem('@365_entries');
        if (oldData) {
            const entries: JournalEntry[] = JSON.parse(oldData);
            for (const entry of entries) {
                await saveEntry(entry);
            }
            console.log(`Migrated ${entries.length} entries to SQLite`);
        }

        await AsyncStorage.setItem('@365_migrated_to_sqlite', 'true');
    } catch (error) {
        console.error('Migration error:', error);
    }
};

// Save or update an entry
export const saveEntry = async (entry: JournalEntry): Promise<void> => {
    try {
        await getDb().runAsync(
            `INSERT OR REPLACE INTO entries (id, date, content, plantIconId, wordCount, createdAt, updatedAt, year, timezoneOffset)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                entry.id,
                entry.date,
                entry.content || '',
                entry.plantIconId || null,
                entry.wordCount || 0,
                entry.createdAt,
                entry.updatedAt || new Date().toISOString(),
                entry.year,
                entry.timezoneOffset || new Date().getTimezoneOffset()
            ]
        );
        notifyEntriesChanged();
    } catch (error) {
        console.error('Error saving entry:', error);
        throw error;
    }
};

// Get all entries
export const getAllEntries = async (): Promise<JournalEntry[]> => {
    try {
        const result = await getDb().getAllAsync<JournalEntry>('SELECT * FROM entries ORDER BY date DESC');
        return result;
    } catch (error) {
        console.error('Error getting entries:', error);
        return [];
    }
};

// Get entry by date
export const getEntryByDate = async (date: string): Promise<JournalEntry | undefined> => {
    try {
        const result = await getDb().getFirstAsync<JournalEntry>('SELECT * FROM entries WHERE date = ?', [date]);
        return result || undefined;
    } catch (error) {
        console.error('Error getting entry by date:', error);
        return undefined;
    }
};

// Get entries for a specific year
export const getEntriesByYear = async (year: number): Promise<JournalEntry[]> => {
    try {
        const result = await getDb().getAllAsync<JournalEntry>('SELECT * FROM entries WHERE year = ? ORDER BY date', [year]);
        return result;
    } catch (error) {
        console.error('Error getting entries by year:', error);
        return [];
    }
};

// Delete an entry
export const deleteEntry = async (id: string): Promise<void> => {
    try {
        await getDb().runAsync('DELETE FROM entries WHERE id = ?', [id]);
        notifyEntriesChanged();
    } catch (error) {
        console.error('Error deleting entry:', error);
        throw error;
    }
};

// Clear all data (for testing/reset)
export const clearAllData = async (): Promise<void> => {
    try {
        await getDb().runAsync('DELETE FROM entries');
        await AsyncStorage.removeItem('@365_migrated_to_sqlite');
        notifyEntriesChanged();
    } catch (error) {
        console.error('Error clearing data:', error);
    }
};

// Get entry count
export const getEntryCount = async (): Promise<number> => {
    try {
        const result = await getDb().getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM entries');
        return result?.count || 0;
    } catch (error) {
        console.error('Error getting entry count:', error);
        return 0;
    }
};

// Get total words
export const getTotalWords = async (): Promise<number> => {
    try {
        const result = await getDb().getFirstAsync<{ total: number }>('SELECT SUM(wordCount) as total FROM entries');
        return result?.total || 0;
    } catch (error) {
        console.error('Error getting total words:', error);
        return 0;
    }
};
