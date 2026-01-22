import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
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
    const [iconId, setIconId] = useState<string | undefined>(initialIconId || PLANT_ICONS_LIST[0].id);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Auto-save logic (only when not read-only)
    useEffect(() => {
        if (readOnly) return;
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        if (content.trim()) {
            saveTimeoutRef.current = setTimeout(() => {
                onSave(content, iconId || PLANT_ICONS_LIST[0].id);
            }, 1500);
        }

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [content, iconId, readOnly]);

    // Cleanup save on unmount
    useEffect(() => {
        return () => {
            if (!readOnly && content.trim()) {
                onSave(content, iconId || PLANT_ICONS_LIST[0].id);
            }
        };
    }, []);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    // Get the selected plant color for visual feedback
    const selectedPlantColor = getPlantColor(iconId);

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <Animated.View entering={FadeIn.duration(600)} style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    {/* Date Display */}
                    <Text style={styles.dateText}>{formattedDate}</Text>

                    {/* Mode Indicator */}
                    <View style={[styles.modePill, readOnly && styles.readOnlyPill]}>
                        <Text style={[styles.modeText, readOnly && styles.readOnlyText]}>
                            {readOnly ? 'Memory' : 'Planting...'}
                        </Text>
                    </View>
                </View>

                {/* Plant Selector (hidden in read-only mode) */}
                {!readOnly && (
                    <View style={styles.plantSelectorContainer}>
                        {PLANT_ICONS_LIST.slice(0, 4).map((plant) => {
                            const isSelected = iconId === plant.id;
                            const Icon = plant.component;
                            const plantColor = getPlantColor(plant.id);
                            return (
                                <TouchableOpacity
                                    key={plant.id}
                                    onPress={() => setIconId(plant.id)}
                                    style={[
                                        styles.iconWrapper,
                                        isSelected && { backgroundColor: `${plantColor}20` }
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <Icon
                                        width={28}
                                        height={28}
                                        color={isSelected ? plantColor : Colors.dark.textTertiary}
                                        strokeWidth={isSelected ? 2 : 1.5}
                                        opacity={isSelected ? 1 : 0.4}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* Selected Plant Indicator (for read-only) */}
                {readOnly && iconId && (
                    <View style={styles.readOnlyPlantContainer}>
                        {(() => {
                            const plant = PLANT_ICONS_LIST.find(p => p.id === iconId);
                            if (!plant) return null;
                            const Icon = plant.component;
                            return (
                                <View style={[styles.readOnlyPlantBadge, { backgroundColor: `${selectedPlantColor}20` }]}>
                                    <Icon width={32} height={32} color={selectedPlantColor} strokeWidth={2} />
                                </View>
                            );
                        })()}
                    </View>
                )}

                {/* Content Area */}
                <View style={styles.contentArea}>
                    {readOnly ? (
                        // Read-only: Display as text
                        <ScrollView
                            contentContainerStyle={styles.readOnlyContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={styles.memoryText}>
                                {content || 'No words were written...'}
                            </Text>
                        </ScrollView>
                    ) : (
                        // Editable: TextInput
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="plant a memory..."
                            placeholderTextColor="rgba(255,255,255,0.25)"
                            value={content}
                            onChangeText={setContent}
                            textAlignVertical="top"
                            selectionColor={selectedPlantColor}
                        />
                    )}
                </View>

                {/* Bottom Spacer for Dock */}
                <View style={styles.bottomSpacer} />

            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Layout.spacing.lg,
        paddingTop: Layout.spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        gap: 8,
    },
    dateText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
        letterSpacing: 0.5,
    },
    modePill: {
        backgroundColor: Colors.dark.accent,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    readOnlyPill: {
        backgroundColor: Colors.dark.backgroundElevated,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modeText: {
        color: Colors.dark.background,
        fontSize: 12,
        fontFamily: 'Inter_600SemiBold',
    },
    readOnlyText: {
        color: Colors.dark.textSecondary,
    },
    plantSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 24,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        width: 48,
        borderRadius: 24,
    },
    readOnlyPlantContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    readOnlyPlantBadge: {
        padding: 16,
        borderRadius: 32,
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
        paddingHorizontal: 8,
    },
    readOnlyContent: {
        flexGrow: 1,
        paddingHorizontal: 8,
    },
    memoryText: {
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        lineHeight: 28,
        fontStyle: 'italic',
    },
    bottomSpacer: {
        height: 100,
    },
});
