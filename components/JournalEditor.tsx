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
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

                {/* Header: Edit Pill (Top Center) */}
                <View style={styles.topArea}>
                    <TouchableOpacity style={styles.editPill}>
                        <Text style={styles.editPillText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* Inline Plant Selector (Subtle, delicately placed below header or integrated)
                    User's image shows "Edit" at top, and previous images showed icons. 
                    We will place them subtly below top area or keep them invisible until interaction? 
                    Based on Image 0, they are visible. We'll keep them but style delicately under the pill.
                */}
                <View style={styles.plantSelectorContainer}>
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
                                    width={32}
                                    height={32}
                                    color={isSelected ? Colors.dark.text : Colors.dark.textTertiary}
                                    strokeWidth={1.5}
                                    opacity={isSelected ? 1 : 0.3}
                                />
                                {/* No glow/dot, just opacity change for minimal zen feel */}
                            </TouchableOpacity>
                        );
                    })}
                </View>


                {/* Massive Whitespace Spacer */}
                <View style={styles.spacer} />

                {/* Input Area (Centered/Bottom-ish) */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder="plant memory.."
                        placeholderTextColor="rgba(255,255,255,0.2)" // Very subtle
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical="center" // Center vertically in its container
                        selectionColor={Colors.dark.accent}
                    />
                </View>

                {/* Bottom Spacer to push input up a bit */}
                <View style={styles.bottomSpacer} />

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
        alignItems: 'center', // Center the Edit pill
        marginTop: 10,
        marginBottom: 20,
    },
    plantSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        width: 44,
    },
    editPill: {
        backgroundColor: Colors.dark.text, // White pill
        paddingVertical: 8, // Slightly taller
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    editPillText: {
        color: Colors.dark.background,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 12,
    },
    spacer: {
        flex: 1,
    },
    inputContainer: {
        height: 150, // Fixed height for input area
        justifyContent: 'center',
        marginBottom: 100, // Leave room for Dock
    },
    input: {
        color: Colors.dark.text,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        lineHeight: 24,
        textAlign: 'center', // Center text alignment "plant memory.."
    },
    bottomSpacer: {
        height: 80, // Space for Dock
    },
    selectionGlow: {
        // Unused now
        position: 'absolute',
    },
    sparkleContainer: {
        // Moved to external
    }
});
