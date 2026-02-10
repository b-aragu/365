import { useState, useCallback, useEffect } from 'react';
import { JournalEntry } from '../types';
import * as storage from '../utils/storage';

export const useJournalEntries = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshEntries = useCallback(async (showLoading: boolean = true) => {
        if (showLoading) setLoading(true);
        const data = await storage.getAllEntries();
        setEntries(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        refreshEntries();

        const unsubscribe = storage.subscribeToEntryChanges(() => {
            refreshEntries(false);
        });

        return unsubscribe;
    }, [refreshEntries]);

    const addEntry = async (entry: JournalEntry) => {
        await storage.saveEntry(entry);
    };

    return {
        entries,
        loading,
        refreshEntries,
        addEntry,
    };
};
