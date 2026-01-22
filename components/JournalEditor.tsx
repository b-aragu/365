import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { PLANT_ICONS_LIST } from '@/assets/icons/plants';
import { Svg, Path } from 'react-native-svg';

// Decorative Sparkle Icon
const SparkleIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" fill={Colors.dark.textTertiary} opacity={0.5} />
    </Svg>
);

interface JournalEditorProps {
    date: string;
    initialContent?: string;
    initialIconId?: string;
    onSave: (content: string, iconId: string) => Promise<void>;
    onDelete: () => Promise<void>;
    isNewEntry: boolean;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
    initialContent = '',
    initialIconId,
    onSave,
}) => {
    const [content, setContent] = useState(initialContent);
    const [iconId, setIconId] = useState<string | undefined>(initialIconId || PLANT_ICONS_LIST[0].id);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-save logic
    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        // Save after 1 second of inactivity if content exists
        if (content.trim()) {
            saveTimeoutRef.current = setTimeout(() => {
                onSave(content, iconId || PLANT_ICONS_LIST[0].id);
            }, 1000);
        }

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [content, iconId]);

    // Cleanup save on unmount (ensure final state is saved)
    useEffect(() => {
        return () => {
            if (content.trim()) {
                onSave(content, iconId || PLANT_ICONS_LIST[0].id);
            }
        };
    }, []);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <Animated.View entering={FadeIn.duration(800)} style={styles.container}>

                {/* Header: Icons + Edit Pill */}
                <View style={styles.topArea}>
                    <View style={styles.plantSelector}>
                        {PLANT_ICONS_LIST.slice(0, 4).map((plant) => {
                            const isSelected = iconId === plant.id;
                            const Icon = plant.component;
                            return (
                                <TouchableOpacity
                                    key={plant.id}
                                    onPress={() => setIconId(plant.id)}
                                    style={styles.iconWrapper}
                                    activeOpacity={0.7}
                                >
                                    <Icon
                                        width={32} // Slightly larger
                                        height={32}
                                        color={isSelected ? Colors.dark.text : Colors.dark.textTertiary}
                                        strokeWidth={isSelected ? 2 : 1.5}
                                        opacity={isSelected ? 1 : 0.4} // Dim unselected
                                    />
                                    {/* Subtler glow for selected, NO dot */}
                                    {isSelected && <Animated.View entering={FadeIn} style={styles.selectionGlow} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity style={styles.editPill}>
                        <Text style={styles.editPillText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* Massive Whitespace - Push Input DOWN to bottom third */}
                <View style={styles.spacer} />

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder="plant memory.."
                        placeholderTextColor={Colors.dark.textTertiary}
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="bottom" // Typing starts at bottom
                        selectionColor={Colors.dark.accent}
                    />
                </View>

                {/* Bottom Decorative Area */}
                <View style={styles.bottomArea}>
                    <View style={styles.sparkleContainer}>
                        <SparkleIcon />
                    </View>
                </View>

            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Layout.spacing.lg,
        paddingTop: Layout.spacing.xl,
    },
    topArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    plantSelector: {
        flexDirection: 'row',
        gap: 32, // Generous spacing
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        width: 44,
    },
    selectionGlow: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.dark.text,
        opacity: 0.1, // Very subtle glow bloom behind
        zIndex: -1,
    },
    editPill: {
        backgroundColor: Colors.dark.backgroundElevated, // Less prominent
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        opacity: 0.8,
    },
    editPillText: {
        color: Colors.dark.text,
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
    },
    spacer: {
        flex: 3, // Push everything down more
    },
    inputContainer: {
        flex: 2, // Taller input area
        justifyContent: 'flex-end', // Align text to bottom of this section
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    input: {
        color: Colors.dark.text,
        fontSize: 18,
        fontFamily: 'Inter_400Regular',
        lineHeight: 28,
        minHeight: 120, // Taller touch target
    },
    bottomArea: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    sparkleContainer: {
        opacity: 0.8,
        padding: 8,
    }
});
