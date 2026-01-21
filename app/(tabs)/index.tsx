import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { YearGrid } from '@/components/YearGrid';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { Colors } from '@/constants/Colors';
import { getDaysRemaining } from '@/utils/dateUtils';
import { FloatingDock } from '@/components/FloatingDock';

export default function HomeScreen() {
    const { entries } = useJournalEntries();
    const currentYear = new Date().getFullYear();
    const daysRemaining = getDaysRemaining();

    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'year' | 'journal' | 'settings'>('year');

    const handleDayPress = (date: string) => {
        router.push(`/journal/${date}`);
    };

    const handleTabPress = (tab: 'year' | 'journal' | 'settings') => {
        setActiveTab(tab);
        if (tab === 'journal') {
            // Navigate to today's journal or handle journal list logic
            // For now, let's open today's entry as a shortcut
            const today = new Date().toISOString().split('T')[0];
            router.push(`/journal/${today}`);
            // Reset tab after navigation so 'year' remains the main view context or update state accordingly
            setTimeout(() => setActiveTab('year'), 500);
        }
        // Settings/Menu logic to be added
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.daysRemaining}>{daysRemaining}</Text>
                <Text style={styles.daysLabel}>days left in {currentYear}</Text>
            </View>

            <View style={styles.gridContainer}>
                <YearGrid
                    year={currentYear}
                    entries={entries}
                    onDayPress={handleDayPress}
                />
            </View>

            {/* Bottom Quote moved or removed for cleaner look, keeping minimal for now */}
            <View style={styles.footer}>
                <Text style={styles.quote}>"Growth is a process."</Text>
            </View>

            <FloatingDock activeTab={activeTab} onTabPress={handleTabPress} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        marginTop: 40,
        alignItems: 'center',
        marginBottom: 20,
    },
    daysRemaining: {
        color: Colors.dark.text,
        fontSize: 48,
        fontFamily: 'Inter_700Bold', // Using new font
        fontWeight: 'bold',
        marginBottom: 4,
    },
    daysLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    gridContainer: {
        flex: 1,
        justifyContent: 'center', // Center vertically
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 110, // Above the dock
        width: '100%',
        alignItems: 'center',
    },
    quote: {
        color: Colors.dark.textTertiary,
        fontStyle: 'italic',
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
    },
});
