import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '@/constants/Colors';
import { useJournalEntries } from '@/hooks/useJournalEntries';

// Icons
const BackIcon = ({ size = 24, color = Colors.dark.text }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const GithubIcon = ({ size = 20, color = Colors.dark.textSecondary }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.865 20.166 8.839 21.489C9.339 21.579 9.521 21.271 9.521 21.006C9.521 20.77 9.512 20.001 9.508 19.166C6.726 19.769 6.139 17.897 6.139 17.897C5.685 16.744 5.029 16.438 5.029 16.438C4.121 15.818 5.098 15.831 5.098 15.831C6.101 15.901 6.629 16.859 6.629 16.859C7.521 18.367 8.97 17.93 9.54 17.674C9.631 17.027 9.889 16.591 10.175 16.42C7.954 16.247 5.62 15.4 5.62 11.565C5.62 10.472 6.01 9.576 6.649 8.878C6.546 8.657 6.203 7.639 6.747 6.288C6.747 6.288 7.586 6.052 9.497 7.321C10.31 7.086 11.161 6.969 12.006 6.965C12.849 6.969 13.698 7.086 14.513 7.321C16.422 6.052 17.259 6.288 17.259 6.288C17.805 7.639 17.462 8.657 17.359 8.878C18 9.576 18.386 10.472 18.386 11.565C18.386 15.412 16.047 16.243 13.82 16.412C14.174 16.65 14.495 17.126 14.495 17.85C14.495 18.885 14.483 19.716 14.483 21.006C14.483 21.273 14.663 21.584 15.175 21.488C19.148 20.163 22 16.418 22 12C22 6.477 17.523 2 12 2Z" fill={color} />
    </Svg>
);

const MailIcon = ({ size = 20, color = Colors.dark.textSecondary }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default function SettingsScreen() {
    const router = useRouter();
    const { entries } = useJournalEntries();
    const [hapticEnabled, setHapticEnabled] = useState(true);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');

    const handleBack = () => router.back();
    const totalWords = entries.reduce((acc, e) => acc + (e.wordCount || 0), 0);

    const openGithub = () => Linking.openURL('https://github.com/b-aragu/365');

    const sendFeedback = () => {
        if (!feedbackText.trim()) {
            Alert.alert('Empty Feedback', 'Please write something before sending.');
            return;
        }
        const subject = encodeURIComponent('365 App Feedback');
        const body = encodeURIComponent(feedbackText);
        Linking.openURL(`mailto:baraguantonyy@gmail.com?subject=${subject}&body=${body}`);
        setFeedbackText('');
        setShowFeedback(false);
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Stats */}
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

                    {/* Preferences */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preferences</Text>

                        {/* Haptic */}
                        <View style={styles.settingRow}>
                            <View>
                                <Text style={styles.settingLabel}>Haptic Feedback</Text>
                                <Text style={styles.settingDesc}>Vibration when planting</Text>
                            </View>
                            <Switch
                                value={hapticEnabled}
                                onValueChange={setHapticEnabled}
                                trackColor={{ false: Colors.dark.border, true: Colors.dark.plantGreen }}
                                thumbColor={Colors.dark.text}
                            />
                        </View>
                    </View>

                    {/* Feedback */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Feedback</Text>
                        <TouchableOpacity style={styles.actionRow} onPress={() => setShowFeedback(!showFeedback)}>
                            <View style={styles.actionContent}>
                                <MailIcon />
                                <View>
                                    <Text style={styles.actionLabel}>Send Feedback</Text>
                                    <Text style={styles.actionDesc}>Help us improve</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {showFeedback && (
                            <View style={styles.feedbackContainer}>
                                <TextInput
                                    style={styles.feedbackInput}
                                    placeholder="What's on your mind?"
                                    placeholderTextColor={Colors.dark.textTertiary}
                                    value={feedbackText}
                                    onChangeText={setFeedbackText}
                                    multiline
                                    numberOfLines={4}
                                />
                                <TouchableOpacity style={styles.sendButton} onPress={sendFeedback}>
                                    <Text style={styles.sendButtonText}>Send Feedback</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* About */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>

                        <TouchableOpacity style={styles.actionRow} onPress={openGithub}>
                            <View style={styles.actionContent}>
                                <GithubIcon />
                                <View>
                                    <Text style={styles.actionLabel}>Source Code</Text>
                                    <Text style={styles.actionDesc}>github.com/b-aragu/365</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.aboutRow}>
                            <Text style={styles.aboutLabel}>Version</Text>
                            <Text style={styles.aboutValue}>1.0.0</Text>
                        </View>
                        <View style={styles.aboutRow}>
                            <Text style={styles.aboutLabel}>Made by</Text>
                            <Text style={styles.aboutValue}>baragu 💚</Text>
                        </View>
                    </View>

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
    backButton: { padding: 8 },
    title: { color: Colors.dark.text, fontSize: 18, fontFamily: 'Inter_600SemiBold' },
    placeholder: { width: 40 },
    content: { flex: 1, paddingHorizontal: 20 },
    section: { marginTop: 28 },
    sectionTitle: { color: Colors.dark.textSecondary, fontSize: 12, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    statsRow: { flexDirection: 'row', gap: 16 },
    statItem: { flex: 1, backgroundColor: Colors.dark.backgroundElevated, padding: 20, borderRadius: 16, alignItems: 'center' },
    statNumber: { color: Colors.dark.text, fontSize: 28, fontFamily: 'Inter_700Bold', marginBottom: 4 },
    statLabel: { color: Colors.dark.textSecondary, fontSize: 13, fontFamily: 'Inter_400Regular' },
    settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.dark.backgroundElevated, padding: 16, borderRadius: 12 },
    settingLabel: { color: Colors.dark.text, fontSize: 15, fontFamily: 'Inter_500Medium' },
    settingDesc: { color: Colors.dark.textTertiary, fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
    actionRow: { backgroundColor: Colors.dark.backgroundElevated, padding: 16, borderRadius: 12, marginBottom: 8 },
    actionContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    actionLabel: { color: Colors.dark.text, fontSize: 15, fontFamily: 'Inter_500Medium' },
    actionDesc: { color: Colors.dark.textTertiary, fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
    feedbackContainer: { backgroundColor: Colors.dark.backgroundElevated, padding: 16, borderRadius: 12, marginTop: 8 },
    feedbackInput: { color: Colors.dark.text, fontSize: 15, fontFamily: 'Inter_400Regular', backgroundColor: Colors.dark.background, borderRadius: 8, padding: 12, minHeight: 100, textAlignVertical: 'top' },
    sendButton: { backgroundColor: Colors.dark.plantGreen, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
    sendButtonText: { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
    aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
    aboutLabel: { color: Colors.dark.textSecondary, fontSize: 14, fontFamily: 'Inter_400Regular' },
    aboutValue: { color: Colors.dark.text, fontSize: 14, fontFamily: 'Inter_500Medium' },
    bottomPadding: { height: 40 },
});
