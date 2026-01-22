import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { PLANT_ICONS_LIST } from '@/assets/icons/plants';
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
    const [iconId, setIconId] = useState<string>(initialIconId || PLANT_ICONS_LIST[0].id);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showPlantSelector, setShowPlantSelector] = useState(false);

    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const initialContentRef = useRef(initialContent);
    const initialIconRef = useRef(initialIconId || PLANT_ICONS_LIST[0].id);

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
    const selectedPlant = PLANT_ICONS_LIST.find(p => p.id === iconId) || PLANT_ICONS_LIST[0];
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
        setShowPlantSelector(false);
        if (newIconId !== initialIconRef.current || content !== initialContentRef.current) {
            setHasUnsavedChanges(true);
        }
    }, [content]);

    // Plant the memory (explicit save)
    const plantMemory = useCallback(async () => {
        if (readOnly || !content.trim()) return;

        await onSave(content, iconId);
        initialContentRef.current = content;
        initialIconRef.current = iconId;
        setHasUnsavedChanges(false);

        setShowSaveConfirm(true);
        if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
        confirmTimeoutRef.current = setTimeout(() => {
            setShowSaveConfirm(false);
        }, 2000);
    }, [content, iconId, onSave, readOnly]);

    // Auto-save after inactivity
    useEffect(() => {
        if (readOnly || !hasUnsavedChanges || !content.trim()) return;
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(() => {
            plantMemory();
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
            <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.dateText}>{formattedDate}</Text>
                    <View style={styles.memoryBadge}>
                        <SelectedIcon width={20} height={20} color={selectedColor} strokeWidth={1.5} />
                        <Text style={styles.memoryBadgeText}>Memory</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.readOnlyContent}
                    contentContainerStyle={styles.readOnlyContentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.memoryText}>{content || 'No words were written...'}</Text>
                </ScrollView>

                <View style={styles.bottomSpacer} />
            </Animated.View>
        );
    }

    // Edit view - Centered layout
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <Animated.View entering={FadeIn.duration(400)} style={styles.container}>

                {/* Confirmation Toast */}
                {showSaveConfirm && (
                    <Animated.View
                        entering={SlideInDown.duration(200)}
                        exiting={FadeOut.duration(150)}
                        style={styles.confirmToast}
                    >
                        <SelectedIcon width={18} height={18} color="#fff" strokeWidth={2} />
                        <Text style={styles.confirmText}>Memory planted!</Text>
                    </Animated.View>
                )}

                {/* Top: Date */}
                <View style={styles.topSection}>
                    <Text style={styles.dateTextSubtle}>{formattedDate}</Text>
                </View>

                {/* Center: Input Area */}
                <View style={styles.centerSection}>
                    <TextInput
                        style={styles.centeredInput}
                        multiline
                        placeholder="plant a memory..."
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        value={content}
                        onChangeText={handleContentChange}
                        textAlignVertical="center"
                        selectionColor={selectedColor}
                    />
                </View>

                {/* Bottom: Plant Selector + Plant Button */}
                <View style={styles.bottomSection}>
                    {/* Current plant indicator - tap to change */}
                    <TouchableOpacity
                        style={styles.plantIndicator}
                        onPress={() => setShowPlantSelector(!showPlantSelector)}
                    >
                        <SelectedIcon width={28} height={28} color={selectedColor} strokeWidth={2} />
                        <Text style={styles.plantIndicatorText}>
                            {showPlantSelector ? 'Choose plant' : 'Tap to change'}
                        </Text>
                    </TouchableOpacity>

                    {/* Plant selector */}
                    {showPlantSelector && (
                        <Animated.View entering={FadeIn.duration(200)} style={styles.plantSelectorRow}>
                            {PLANT_ICONS_LIST.slice(0, 5).map((plant) => {
                                const isSelected = iconId === plant.id;
                                const Icon = plant.component;
                                const color = getPlantColor(plant.id);
                                return (
                                    <TouchableOpacity
                                        key={plant.id}
                                        onPress={() => handlePlantSelect(plant.id)}
                                        style={[styles.plantOption, isSelected && styles.plantOptionSelected]}
                                    >
                                        <Icon width={24} height={24} color={isSelected ? color : Colors.dark.textTertiary} strokeWidth={1.5} />
                                    </TouchableOpacity>
                                );
                            })}
                        </Animated.View>
                    )}

                    {/* Plant button - only visible when there's content */}
                    {content.trim().length > 0 && (
                        <TouchableOpacity
                            style={[styles.plantButton, { backgroundColor: selectedColor }]}
                            onPress={plantMemory}
                        >
                            <Text style={styles.plantButtonText}>Plant</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.dockSpacer} />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Layout.spacing.lg,
    },
    // Top
    topSection: {
        paddingTop: Layout.spacing.md,
        alignItems: 'center',
    },
    dateTextSubtle: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    // Center
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Layout.spacing.md,
    },
    centeredInput: {
        color: Colors.dark.text,
        fontSize: 20,
        fontFamily: 'Inter_400Regular',
        lineHeight: 32,
        textAlign: 'center',
        minHeight: 100,
    },
    // Bottom
    bottomSection: {
        alignItems: 'center',
        paddingBottom: Layout.spacing.md,
        gap: 12,
    },
    plantIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    plantIndicatorText: {
        color: Colors.dark.textTertiary,
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    },
    plantSelectorRow: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 8,
    },
    plantOption: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    plantOptionSelected: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    plantButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
    },
    plantButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
    dockSpacer: {
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
        gap: 8,
        paddingVertical: 12,
        backgroundColor: Colors.dark.success,
        borderRadius: 12,
    },
    confirmText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Inter_600SemiBold',
    },
    // Read-only
    header: {
        alignItems: 'center',
        paddingTop: Layout.spacing.lg,
        gap: 10,
    },
    dateText: {
        color: Colors.dark.text,
        fontSize: 16,
        fontFamily: 'Inter_500Medium',
    },
    memoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 14,
    },
    memoryBadgeText: {
        color: Colors.dark.textTertiary,
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
    },
    readOnlyContent: {
        flex: 1,
        marginTop: Layout.spacing.xl,
    },
    readOnlyContentContainer: {
        paddingHorizontal: Layout.spacing.md,
    },
    memoryText: {
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        lineHeight: 28,
        textAlign: 'center',
    },
    bottomSpacer: {
        height: 100,
    },
});
