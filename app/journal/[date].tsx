import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JournalEditor } from '@/components/JournalEditor';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { Colors } from '@/constants/Colors';
import { getEntryByDate } from '@/utils/storage';
import { JournalEntry } from '@/types';
import { getDayOfYear } from '@/utils/dateUtils';
import { FloatingDock } from '@/components/FloatingDock';

type DateStatus = 'today' | 'past-with-entry' | 'past-empty' | 'future';

export default function JournalPage() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();
    const { addEntry } = useJournalEntries();
    const [entry, setEntry] = useState<JournalEntry | null>(null);
    const [loading, setLoading] = useState(true);

    // Determine date status
    const dateStatus = useMemo((): DateStatus => {
        if (!date) return 'future';
        const today = new Date().toISOString().split('T')[0];
        if (date === today) return 'today';
        if (date > today) return 'future';
        return entry ? 'past-with-entry' : 'past-empty';
    }, [date, entry]);

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
        // Only allow saving for today
        if (!date || dateStatus !== 'today') return;

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

    const handleGoBack = () => {
        router.replace('/');
    };

    // Format date for display
    const formattedDate = useMemo(() => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }, [date]);

    // Render based on date status
    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.dark.accent} />
                </View>
            );
        }

        // Future date - shouldn't happen but handle gracefully
        if (dateStatus === 'future') {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyIcon}>🌱</Text>
                    <Text style={styles.emptyTitle}>Not yet...</Text>
                    <Text style={styles.emptySubtitle}>This day hasn't arrived.</Text>
                    <Text style={styles.emptyHint}>Come back on {formattedDate}</Text>
                    <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                        <Text style={styles.backButtonText}>Return to Garden</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Past day with no entry
        if (dateStatus === 'past-empty') {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyIcon}>🍂</Text>
                    <Text style={styles.emptyTitle}>No memory planted</Text>
                    <Text style={styles.emptySubtitle}>{formattedDate}</Text>
                    <Text style={styles.emptyHint}>This moment has passed</Text>
                    <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                        <Text style={styles.backButtonText}>Return to Garden</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Past day with entry (read-only) or Today (editable)
        return (
            <JournalEditor
                date={date}
                initialContent={entry?.content}
                initialIconId={entry?.plantIconId}
                onSave={handleSave}
                onDelete={handleDelete}
                isNewEntry={!entry}
                readOnly={dateStatus === 'past-with-entry'}
            />
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.container}>
                {renderContent()}
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyTitle: {
        color: Colors.dark.text,
        fontSize: 24,
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        marginBottom: 4,
        textAlign: 'center',
    },
    emptyHint: {
        color: Colors.dark.textTertiary,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        fontStyle: 'italic',
        marginBottom: 32,
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: Colors.dark.backgroundElevated,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    backButtonText: {
        color: Colors.dark.text,
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
});
