import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { useJournalEntries } from '@/hooks/useJournalEntries';

// Back Arrow Icon
const BackIcon = ({ size = 24, color = Colors.dark.text }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default function SettingsScreen() {
    const router = useRouter();
    const { entries } = useJournalEntries();
    const [hapticEnabled, setHapticEnabled] = useState(true);

    const handleBack = () => {
        router.back();
    };

    // Calculate total words
    const totalWords = entries.reduce((acc, e) => acc + (e.wordCount || 0), 0);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Stats Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Garden</Text>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{entries.length}</Text>
                                <Text style={styles.statLabel}>Memories</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{totalWords}</Text>
                                <Text style={styles.statLabel}>Words</Text>
                            </View>
                        </View>
                    </View>

                    {/* Preferences Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preferences</Text>

                        <View style={styles.settingRow}>
                            <View>
                                <Text style={styles.settingLabel}>Haptic Feedback</Text>
                                <Text style={styles.settingDescription}>Vibration when planting</Text>
                            </View>
                            <Switch
                                value={hapticEnabled}
                                onValueChange={setHapticEnabled}
                                trackColor={{ false: Colors.dark.border, true: Colors.dark.plantGreen }}
                                thumbColor={Colors.dark.text}
                            />
                        </View>
                    </View>

                    {/* About Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <View style={styles.aboutRow}>
                            <Text style={styles.aboutLabel}>Version</Text>
                            <Text style={styles.aboutValue}>1.0.0</Text>
                        </View>
                        <View style={styles.aboutRow}>
                            <Text style={styles.aboutLabel}>Made with</Text>
                            <Text style={styles.aboutValue}>💚</Text>
                        </View>
                    </View>

                    <View style={styles.bottomPadding} />
                </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    backButton: {
        padding: 8,
    },
    title: {
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 28,
    },
    sectionTitle: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flex: 1,
        backgroundColor: Colors.dark.backgroundElevated,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    statNumber: {
        color: Colors.dark.text,
        fontSize: 28,
        fontFamily: 'Inter_700Bold',
        marginBottom: 4,
    },
    statLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 13,
        fontFamily: 'Inter_400Regular',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.dark.backgroundElevated,
        padding: 16,
        borderRadius: 12,
    },
    settingLabel: {
        color: Colors.dark.text,
        fontSize: 15,
        fontFamily: 'Inter_500Medium',
    },
    settingDescription: {
        color: Colors.dark.textTertiary,
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        marginTop: 2,
    },
    aboutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    aboutLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    aboutValue: {
        color: Colors.dark.text,
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    bottomPadding: {
        height: 40,
    },
});
