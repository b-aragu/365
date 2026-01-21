import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, AppSettings } from '../types';

const STORAGE_KEYS = {
    ENTRIES: '@365_entries',
    SETTINGS: '@365_settings',
};

export const saveEntry = async (entry: JournalEntry): Promise<void> => {
    try {
        const existingEntries = await getAllEntries();
        const index = existingEntries.findIndex(e => e.id === entry.id);

        if (index >= 0) {
            existingEntries[index] = entry;
        } else {
            existingEntries.push(entry);
        }

        await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(existingEntries));
    } catch (error) {
        console.error('Error saving entry:', error);
        throw error;
    }
};

export const getAllEntries = async (): Promise<JournalEntry[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting entries:', error);
        return [];
    }
};

export const getEntryByDate = async (date: string): Promise<JournalEntry | undefined> => {
    try {
        const entries = await getAllEntries();
        return entries.find(e => e.date === date);
    } catch (error) {
        console.error('Error getting entry by date:', error);
        return undefined;
    }
};

export const clearAllData = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Error clearing data:', error);
    }
};
