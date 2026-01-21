import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
        <View style={styles.container}>
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
        </View>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    wordCount: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.dark.backgroundElevated,
        borderRadius: Layout.borderRadius.md,
        padding: Layout.spacing.md,
        color: Colors.dark.text,
        fontSize: 16,
        lineHeight: 24,
        marginBottom: Layout.spacing.lg,
    },
    iconSelectorTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.backgroundSecondary,
        padding: Layout.spacing.md,
        borderRadius: Layout.borderRadius.lg,
        marginBottom: Layout.spacing.lg,
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
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Layout.spacing.md,
    },
    saveButton: {
        backgroundColor: Colors.dark.accent,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        color: Colors.dark.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    deleteButtonText: {
        color: Colors.dark.error,
        fontSize: 16,
    },
});
