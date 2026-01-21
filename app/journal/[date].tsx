import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JournalEditor } from '@/components/JournalEditor';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { Colors } from '@/constants/Colors';
import { getEntryByDate } from '@/utils/storage';
import { JournalEntry } from '@/types';
import { getDayOfYear, isLeapYear } from '@/utils/dateUtils';
import * as crypto from 'crypto';

export default function JournalPage() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();
    const { addEntry, refreshEntries } = useJournalEntries();
    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEntry = async () => {
            if (!date) return;
            setLoading(true);
            const fetchedEntry = await getEntryByDate(date);
            setEntry(fetchedEntry || null);
            setLoading(false);
        };
        loadEntry();
    }, [date]);

    const handleSave = async (content: string, iconId: string) => {
        if (!date) return;

        // We generated UUIDs previously but crypto.randomUUID isn't available in standard RN environment easily without polyfill
        // For now simple random ID for MVP
        const id = entry?.id || Math.random().toString(36).substring(2, 15);
        const year = new Date(date).getFullYear();

        const newEntry: JournalEntry = {
            id,
            date,
            dayOfYear: getDayOfYear(new Date(date)),
            year,
            content,
            wordCount: content.trim().split(/\s+/).length,
            plantIconId: iconId,
            createdAt: entry?.createdAt || Date.now(),
            updatedAt: Date.now(),
            version: 1,
        };

        await addEntry(newEntry);
        router.back();
    };

    const handleDelete = async () => {
        // Implement delete logic utilizing hooks or storage direct
        // For MVP just clearing content or explicit delete function in storage
        // To keep it simple, we will implement delete in storage.ts later or just overwrite with empty if permitted
        // For now, let's just go back
        router.back();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.dark.accent} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <JournalEditor
                date={date}
                initialContent={entry?.content}
                initialIconId={entry?.plantIconId}
                onSave={handleSave}
                onDelete={handleDelete}
                isNewEntry={!entry}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
