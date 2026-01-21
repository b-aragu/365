import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { formatDate } from '@/utils/dateUtils';
import { IconSelector } from '@/components/IconSelector';
import { PLANT_ICONS_LIST } from '@/assets/icons/plants';

interface JournalEditorProps {
    date: string;
    initialContent?: string;
    initialIconId?: string;
    onSave: (content: string, iconId: string) => Promise<void>;
    onDelete: () => Promise<void>;
    isNewEntry: boolean;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
    date,
    initialContent = '',
    initialIconId,
    onSave,
    onDelete,
    isNewEntry,
}) => {
    const [content, setContent] = useState(initialContent);
    const [iconId, setIconId] = useState<string | undefined>(initialIconId);
    const [isIconSelectorVisible, setIsIconSelectorVisible] = useState(false);
    const [charCount, setCharCount] = useState(initialContent.length);

    useEffect(() => {
        setCharCount(content.length);
    }, [content]);

    const handleSave = async () => {
        if (!content.trim()) return;
        const selectedIcon = iconId || PLANT_ICONS_LIST[0].id;
        await onSave(content, selectedIcon);
    };

    const selectedIcon = PLANT_ICONS_LIST.find(i => i.id === iconId);
    const IconComponent = selectedIcon?.component;

    return (
        <Animated.View entering={FadeIn.duration(600).delay(100)} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dateText}>{formatDate(date)}</Text>
                <Text style={styles.wordCount}>{content.trim().split(/\s+/).filter(w => w.length > 0).length} words</Text>
            </View>

            <TextInput
                style={styles.input}
                multiline
                placeholder="Write your thoughts for today..."
                placeholderTextColor={Colors.dark.textTertiary}
                value={content}
                onChangeText={setContent}
                textAlignVertical="top"
            />

            <TouchableOpacity
                style={styles.iconSelectorTrigger}
                onPress={() => setIsIconSelectorVisible(true)}
                activeOpacity={0.8}
            >
                <View style={styles.iconPreview}>
                    {IconComponent ? (
                        <IconComponent width={32} height={32} />
                    ) : (
                        <View style={styles.emptyIcon} />
                    )}
                </View>
                <Text style={styles.selectorText}>
                    {selectedIcon ? selectedIcon.name : 'Choose a plant'}
                </Text>
            </TouchableOpacity>

            <View style={styles.actions}>
                {!isNewEntry && (
                    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.saveButton, !content.trim() && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={!content.trim()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>Save Entry</Text>
                </TouchableOpacity>
            </View>

            <IconSelector
                visible={isIconSelectorVisible}
                onSelect={(id) => {
                    setIconId(id);
                    setIsIconSelectorVisible(false);
                }}
                onClose={() => setIsIconSelectorVisible(false)}
                selectedIconId={iconId}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Layout.spacing.md,
    },
    header: {
        marginBottom: Layout.spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    dateText: {
        fontSize: 28,
        fontFamily: 'Inter_700Bold',
        color: Colors.dark.text,
    },
    wordCount: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    input: {
        flex: 1,
        backgroundColor: Colors.dark.backgroundElevated,
        borderRadius: Layout.borderRadius.xl, // More rounded
        padding: Layout.spacing.lg,
        color: Colors.dark.text,
        fontSize: 18, // Slightly larger for comfort
        fontFamily: 'Inter_400Regular',
        lineHeight: 28,
        marginBottom: Layout.spacing.lg,
    },
    iconSelectorTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.backgroundSecondary,
        padding: Layout.spacing.md,
        borderRadius: Layout.borderRadius.xl,
        marginBottom: Layout.spacing.lg,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    iconPreview: {
        marginRight: Layout.spacing.md,
    },
    emptyIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.dark.textTertiary,
        borderStyle: 'dashed',
    },
    selectorText: {
        fontSize: 16,
        color: Colors.dark.text,
        fontFamily: 'Inter_500Medium',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Layout.spacing.md,
        marginBottom: 20
    },
    saveButton: {
        backgroundColor: Colors.dark.accent,
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderRadius: 30, // Pill shape
        shadowColor: Colors.dark.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonDisabled: {
        opacity: 0.5,
        shadowOpacity: 0,
    },
    saveButtonText: {
        color: Colors.dark.background, // Dark text on accent color usually looks better/poppier
        fontFamily: 'Inter_700Bold',
        fontSize: 16,
    },
    deleteButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    deleteButtonText: {
        color: Colors.dark.error,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
    },
});
