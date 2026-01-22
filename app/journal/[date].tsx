import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JournalEditor } from '@/components/JournalEditor';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { Colors } from '@/constants/Colors';
import { getEntryByDate } from '@/utils/storage';
import { JournalEntry } from '@/types';
import { getDayOfYear } from '@/utils/dateUtils';
import { FloatingDock } from '@/components/FloatingDock';

export default function JournalPage() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();
    const { addEntry } = useJournalEntries();
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
    };

    const handleDelete = async () => {
        // Implement delete
    };

    const handleTabPress = (tab: 'year' | 'journal' | 'settings') => {
        if (tab === 'year') {
            router.replace('/');
        }
    };

    return (
        <>
            {/* Always hide the header */}
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.dark.accent} />
                    </View>
                ) : (
                    <JournalEditor
                        date={date}
                        initialContent={entry?.content}
                        initialIconId={entry?.plantIconId}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        isNewEntry={!entry}
                    />
                )}

                <FloatingDock activeTab="journal" onTabPress={handleTabPress} />
            </SafeAreaView>
        </>
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
