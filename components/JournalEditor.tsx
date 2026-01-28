import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { DETAILED_PLANT_ICONS } from '@/assets/icons/plants';
import { getPlantColor } from '@/constants/PlantColors';

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
    const [iconId, setIconId] = useState<string>(initialIconId || DETAILED_PLANT_ICONS[0].id);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initialContentRef = useRef(initialContent);
    const initialIconRef = useRef(initialIconId || DETAILED_PLANT_ICONS[0].id);

    // Format date
    const formattedDate = React.useMemo(() => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    }, [date]);

    // Get selected plant
    const selectedPlant = DETAILED_PLANT_ICONS.find(p => p.id === iconId) || DETAILED_PLANT_ICONS[0];
    const SelectedIcon = selectedPlant.component;
    const selectedColor = getPlantColor(iconId);

    // Handle content change
    const handleContentChange = useCallback((text: string) => {
        setContent(text);
        if (text !== initialContentRef.current) {
            setHasUnsavedChanges(true);
        }
    }, []);

    // Handle plant selection
    const handlePlantSelect = useCallback((newIconId: string) => {
        setIconId(newIconId);
        if (newIconId !== initialIconRef.current || content !== initialContentRef.current) {
            setHasUnsavedChanges(true);
        }
    }, [content]);

    // Plant the memory
    const plantMemory = useCallback(async (isManual: boolean = true) => {
        if (readOnly || !content.trim()) return;

        await onSave(content, iconId);
        initialContentRef.current = content;
        initialIconRef.current = iconId;
        setHasUnsavedChanges(false);

        if (isManual) {
            setShowSaveConfirm(true);
            if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
            confirmTimeoutRef.current = setTimeout(() => {
                setShowSaveConfirm(false);
            }, 2000);
        }
    }, [content, iconId, onSave, readOnly]);

    // Auto-save after inactivity
    useEffect(() => {
        if (readOnly || !hasUnsavedChanges || !content.trim()) return;
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(() => {
            plantMemory(false);
        }, 3000);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [content, iconId, hasUnsavedChanges, readOnly, plantMemory]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, []);

    const dismissKeyboard = () => Keyboard.dismiss();

    // Read-only view
    if (readOnly) {
        return (
            <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                    <View style={[styles.plantBadge, { backgroundColor: `${selectedColor}20` }]}>
                        <SelectedIcon width={24} height={24} color={selectedColor} strokeWidth={1.5} />
                    </View>
                </View>

                <ScrollView
                    style={styles.readOnlyScroll}
                    contentContainerStyle={styles.readOnlyContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.memoryText}>{content || 'No words were written...'}</Text>
                </ScrollView>

                <View style={styles.bottomSpacer} />
            </Animated.View>
        );
    }

    // Use all 16 detailed plant icons
    const plantsRow1 = DETAILED_PLANT_ICONS.slice(0, 8);
    const plantsRow2 = DETAILED_PLANT_ICONS.slice(8, 16);

    // Edit view
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <Animated.View entering={FadeIn.duration(300)} style={styles.container}>

                {/* Confirmation Toast */}
                {showSaveConfirm && (
                    <Animated.View
                        entering={SlideInDown.duration(200)}
                        exiting={FadeOut.duration(150)}
                        style={styles.confirmToast}
                    >
                        <SelectedIcon width={16} height={16} color="#fff" strokeWidth={2} />
                        <Text style={styles.confirmText}>Planted!</Text>
                    </Animated.View>
                )}

                {/* Header: Date + Plant Selector */}
                <View style={styles.header}>
                    <Text style={styles.dateTextSmall}>{formattedDate}</Text>
                    <Text style={styles.selectorLabel}>Choose your plant</Text>

                    {/* Plant Selector - 2 rows of 8 */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.plantScrollContent}
                    >
                        <View style={styles.plantSelectorContainer}>
                            <View style={styles.plantSelectorRow}>
                                {plantsRow1.map((plant) => {
                                    const isSelected = iconId === plant.id;
                                    const Icon = plant.component;
                                    const color = getPlantColor(plant.id);
                                    return (
                                        <TouchableOpacity
                                            key={plant.id}
                                            onPress={() => handlePlantSelect(plant.id)}
                                            style={[
                                                styles.plantOption,
                                                isSelected && [styles.plantOptionSelected, { borderColor: color }]
                                            ]}
                                        >
                                            <Icon
                                                width={18}
                                                height={18}
                                                color={isSelected ? color : Colors.dark.textTertiary}
                                                strokeWidth={isSelected ? 2 : 1.5}
                                                opacity={isSelected ? 1 : 0.6}
                                            />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <View style={styles.plantSelectorRow}>
                                {plantsRow2.map((plant) => {
                                    const isSelected = iconId === plant.id;
                                    const Icon = plant.component;
                                    const color = getPlantColor(plant.id);
                                    return (
                                        <TouchableOpacity
                                            key={plant.id}
                                            onPress={() => handlePlantSelect(plant.id)}
                                            style={[
                                                styles.plantOption,
                                                isSelected && [styles.plantOptionSelected, { borderColor: color }]
                                            ]}
                                        >
                                            <Icon
                                                width={18}
                                                height={18}
                                                color={isSelected ? color : Colors.dark.textTertiary}
                                                strokeWidth={isSelected ? 2 : 1.5}
                                                opacity={isSelected ? 1 : 0.6}
                                            />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {/* Text Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        placeholder="What will you remember about today?"
                        placeholderTextColor="rgba(255,255,255,0.25)"
                        value={content}
                        onChangeText={handleContentChange}
                        textAlignVertical="top"
                        selectionColor={selectedColor}
                        autoFocus={!initialContent}
                    />
                </View>

                {/* Plant Button */}
                {content.trim().length > 0 && (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.plantButton, { backgroundColor: selectedColor }]}
                            onPress={() => plantMemory(true)}
                            activeOpacity={0.8}
                        >
                            <SelectedIcon width={18} height={18} color="#fff" strokeWidth={2} />
                            <Text style={styles.plantButtonText}>Plant Memory</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.bottomSpacer} />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Layout.spacing.lg,
    },
    // Header
    header: {
        paddingTop: Layout.spacing.sm,
        alignItems: 'center',
        gap: 8,
    },
    dateText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
    },
    dateTextSmall: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    selectorLabel: {
        color: Colors.dark.textTertiary,
        fontSize: 11,
        fontFamily: 'Inter_500Medium',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    plantBadge: {
        padding: 12,
        borderRadius: 20,
    },
    plantScrollContent: {
        paddingHorizontal: 8,
    },
    plantSelectorContainer: {
        gap: 6,
    },
    plantSelectorRow: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
    },
    plantOption: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    plantOptionSelected: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    // Input
    inputContainer: {
        flex: 1,
        paddingTop: Layout.spacing.lg,
    },
    textInput: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        lineHeight: 28,
    },
    // Button
    buttonContainer: {
        alignItems: 'center',
        paddingVertical: Layout.spacing.md,
    },
    plantButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 28,
    },
    plantButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    bottomSpacer: {
        height: 90,
    },
    // Confirmation
    confirmToast: {
        position: 'absolute',
        top: 10,
        left: 20,
        right: 20,
        zIndex: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        backgroundColor: Colors.dark.success,
        borderRadius: 10,
    },
    confirmText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
    },
    // Read-only
    readOnlyScroll: {
        flex: 1,
        marginTop: Layout.spacing.lg,
    },
    readOnlyContent: {
        paddingHorizontal: Layout.spacing.sm,
    },
    memoryText: {
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        lineHeight: 28,
    },
});
