import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutUp, useAnimatedStyle, withSpring, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { PLANT_ICONS_LIST } from '@/assets/icons/plants';
import { getPlantColor } from '@/constants/PlantColors';

// Plant ID to Emoji mapping
const PLANT_EMOJI: Record<string, string> = {
    'tree-pine': '🌲',
    'seedling': '🌱',
    'potted-soil': '🪴',
    'potted-leaf': '🌿',
    'flower-daisy': '🌼',
    'rose-tulip': '🌷',
    'lavender': '💜',
    'bush-cloud': '☁️',
    'monstera': '🍃',
    'fern': '🌾',
    'cactus-pot': '🌵',
    'succulent': '🪷',
    'herb-basil': '🌿',
    'watering-plant': '💧',
    'hands-plant': '🤲',
    'leaf-branch': '🍂',
};

interface JournalEditorProps {
    date: string;
    initialContent?: string;
    initialIconId?: string;
    onSave: (content: string, iconId: string) => Promise<void>;
    onDelete: () => Promise<void>;
    isNewEntry: boolean;
    readOnly?: boolean;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
    date,
    initialContent = '',
    initialIconId,
    onSave,
    readOnly = false,
}) => {
    const [content, setContent] = useState(initialContent);
    const [iconId, setIconId] = useState<string | undefined>(initialIconId || PLANT_ICONS_LIST[0].id);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Format date for display
    const formattedDate = React.useMemo(() => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    }, [date]);

    // Get selected plant emoji
    const selectedEmoji = iconId ? (PLANT_EMOJI[iconId] || '🌱') : '🌱';

    // Perform save with confirmation
    const performSave = useCallback(async () => {
        if (readOnly || !content.trim()) return;

        setIsSaving(true);
        await onSave(content, iconId || PLANT_ICONS_LIST[0].id);
        setIsSaving(false);

        // Show confirmation
        setShowSaveConfirm(true);
        if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
        confirmTimeoutRef.current = setTimeout(() => {
            setShowSaveConfirm(false);
        }, 2000);
    }, [content, iconId, onSave, readOnly]);

    // Auto-save logic
    useEffect(() => {
        if (readOnly) return;
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        if (content.trim()) {
            saveTimeoutRef.current = setTimeout(() => {
                performSave();
            }, 2000);
        }

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [content, iconId, readOnly, performSave]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
        };
    }, []);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const selectedPlantColor = getPlantColor(iconId);

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <Animated.View entering={FadeIn.duration(400)} style={styles.container}>

                {/* Save Confirmation Toast */}
                {showSaveConfirm && (
                    <Animated.View
                        entering={SlideInUp.duration(300)}
                        exiting={FadeOut.duration(200)}
                        style={styles.saveToast}
                    >
                        <Text style={styles.saveToastEmoji}>{selectedEmoji}</Text>
                        <Text style={styles.saveToastText}>Memory planted!</Text>
                    </Animated.View>
                )}

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.dateText}>{formattedDate}</Text>

                    {!readOnly && (
                        <View style={[styles.statusBadge, isSaving && styles.savingBadge]}>
                            <Text style={styles.statusEmoji}>{selectedEmoji}</Text>
                            <Text style={[styles.statusText, isSaving && styles.savingText]}>
                                {isSaving ? 'Planting...' : 'Ready'}
                            </Text>
                        </View>
                    )}

                    {readOnly && (
                        <View style={styles.memoryBadge}>
                            <Text style={styles.statusEmoji}>{selectedEmoji}</Text>
                            <Text style={styles.memoryText}>Memory</Text>
                        </View>
                    )}
                </View>

                {/* Plant Selector (hidden in read-only mode) */}
                {!readOnly && (
                    <View style={styles.plantSelectorContainer}>
                        <Text style={styles.selectorLabel}>Choose your plant</Text>
                        <View style={styles.plantRow}>
                            {PLANT_ICONS_LIST.slice(0, 4).map((plant) => {
                                const isSelected = iconId === plant.id;
                                const emoji = PLANT_EMOJI[plant.id] || '🌱';
                                return (
                                    <TouchableOpacity
                                        key={plant.id}
                                        onPress={() => setIconId(plant.id)}
                                        style={[
                                            styles.emojiButton,
                                            isSelected && styles.emojiButtonSelected
                                        ]}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.emojiOption,
                                            !isSelected && styles.emojiOptionFaded
                                        ]}>
                                            {emoji}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Content Area */}
                <View style={styles.contentArea}>
                    {readOnly ? (
                        <ScrollView
                            contentContainerStyle={styles.readOnlyContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={styles.memoryContentText}>
                                {content || 'No words were written...'}
                            </Text>
                        </ScrollView>
                    ) : (
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="What will you remember about today?"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            value={content}
                            onChangeText={setContent}
                            textAlignVertical="top"
                            selectionColor={selectedPlantColor}
                            autoFocus={!initialContent}
                        />
                    )}
                </View>

                {/* Bottom Spacer */}
                <View style={styles.bottomSpacer} />

            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Layout.spacing.lg,
        paddingTop: Layout.spacing.md,
    },
    saveToast: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        backgroundColor: 'rgba(76, 175, 80, 0.95)',
        borderRadius: 0,
    },
    saveToastEmoji: {
        fontSize: 20,
    },
    saveToastText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    dateText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    savingBadge: {
        backgroundColor: 'rgba(156, 39, 176, 0.3)',
    },
    statusEmoji: {
        fontSize: 16,
    },
    statusText: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    savingText: {
        color: '#CE93D8',
    },
    memoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    memoryText: {
        color: Colors.dark.textTertiary,
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    plantSelectorContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    selectorLabel: {
        color: Colors.dark.textTertiary,
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
        marginBottom: 12,
    },
    plantRow: {
        flexDirection: 'row',
        gap: 16,
    },
    emojiButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    emojiButtonSelected: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    emojiOption: {
        fontSize: 24,
    },
    emojiOptionFaded: {
        opacity: 0.5,
    },
    contentArea: {
        flex: 1,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        lineHeight: 28,
        paddingHorizontal: 4,
    },
    readOnlyContent: {
        flexGrow: 1,
        paddingHorizontal: 4,
    },
    memoryContentText: {
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        lineHeight: 28,
    },
    bottomSpacer: {
        height: 100,
    },
});
