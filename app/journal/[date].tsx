import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Path } from 'react-native-svg';
import { JournalEditor } from '@/components/JournalEditor';
// import { useJournalEntries } from '@/hooks/useJournalEntries'; // Removed unused hook
import { Colors } from '@/constants/Colors';
import { getEntryByDate, saveEntry } from '@/utils/storage';

import { JournalEntry } from '@/types';
import { getDayOfYear } from '@/utils/dateUtils';
import { FloatingDock } from '@/components/FloatingDock';

type DateStatus = 'today' | 'past-with-entry' | 'past-empty' | 'future';

// Back Arrow Icon
const BackArrow = ({ size = 24, color = Colors.dark.text }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default function JournalPage() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();
    // Removed useJournalEntries hook to prevent fetching ALL entries on mount
    const [entry, setEntry] = useState<JournalEntry | null>(null);
    // Removed blocking loading state to render instantly
    // const [loading, setLoading] = useState(true);

    // Determine date status
    const dateStatus = useMemo((): DateStatus => {
        if (!date) return 'future';
        const today = new Date().toISOString().split('T')[0];
        if (date === today) return 'today';
        if (date > today) return 'future';
        // If entry is not yet loaded (null), but it's past, we might show 'past-empty' temporarily.
        // Ideally we check if we *tried* loading. 
        // For instant "Today" transition, this is fine.
        return entry ? 'past-with-entry' : 'past-empty';
    }, [date, entry]);

    useEffect(() => {
        const loadEntry = async () => {
            if (!date) return;
            // setLoading(true);
            const fetchedEntry = await getEntryByDate(date);
            setEntry(fetchedEntry || null);
            // setLoading(false);
        };
        loadEntry();
    }, [date]);

    const handleSave = async (content: string, iconId: string) => {
        if (!date || dateStatus !== 'today') return;

        const id = entry?.id || Math.random().toString(36).substring(2, 15);
        const year = new Date(date).getFullYear();

        const newEntry: JournalEntry = {
            id,
            date,
            dayOfYear: getDayOfYear(new Date(date)),
            year,
            content,
            wordCount: content.trim().split(/\s+/).filter(w => w).length,
            plantIconId: iconId,
            createdAt: entry?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await saveEntry(newEntry);
        // Update local state to reflect save immediately
        setEntry(newEntry);
    };

    // ... handle delete ...

    // ... handle routes ...

    // ... formattedDate ...

    // Render based on date status
    const renderContent = () => {
        // Removed loading check

        // Future date
        if (dateStatus === 'future') {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyIcon}>🌱</Text>
                    <Text style={styles.emptyTitle}>Not yet...</Text>
                    <Text style={styles.emptySubtitle}>This day hasn't arrived.</Text>
                    <Text style={styles.emptyHint}>Come back on {formattedDate}</Text>
                    <TouchableOpacity style={styles.returnButton} onPress={handleGoBack}>
                        <Text style={styles.returnButtonText}>Return to Garden</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Past day with no entry
        // NOTE: This might flash "No Memory" for a split second if loading a past entry.
        // But for "Today" (the primary use case), it falls through to JournalEditor immediately.
        if (dateStatus === 'past-empty' && date !== new Date().toISOString().split('T')[0]) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyIcon}>🍂</Text>
                    <Text style={styles.emptyTitle}>No memory planted</Text>
                    <Text style={styles.emptySubtitle}>{formattedDate}</Text>
                    <Text style={styles.emptyHint}>This moment has passed</Text>
                    <TouchableOpacity style={styles.returnButton} onPress={handleGoBack}>
                        <Text style={styles.returnButtonText}>Return to Garden</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Past day with entry (read-only) or Today (editable)
        return (
            <JournalEditor
                date={date!}
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
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                        <BackArrow />
                    </TouchableOpacity>
                    <View style={styles.headerSpacer} />
                </View>

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backButton: {
        padding: 8,
    },
    headerSpacer: {
        flex: 1,
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
    returnButton: {
        backgroundColor: Colors.dark.backgroundElevated,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    returnButtonText: {
        color: Colors.dark.text,
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
});
