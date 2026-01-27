import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { PLANT_ICONS_LIST } from '@/assets/icons/plants';

interface IconSelectorProps {
    visible: boolean;
    onSelect: (iconId: string) => void;
    onClose: () => void;
    selectedIconId?: string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({ visible, onSelect, onClose, selectedIconId }) => {
    const handleSelect = (id: string) => {
        Haptics.selectionAsync();
        onSelect(id);
    };

    const renderItem = useCallback(({ item }: { item: typeof PLANT_ICONS_LIST[0] }) => {
        const IconComponent = item.component;
        const isSelected = selectedIconId === item.id;
        return (
            <TouchableOpacity
                style={[styles.iconItem, isSelected && styles.selectedIconItem]}
                onPress={() => handleSelect(item.id)}
            >
                <IconComponent width={32} height={32} />
                <Text style={styles.iconName}>{item.name}</Text>
            </TouchableOpacity>
        );
    }, [selectedIconId, onSelect]);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Choose a Plant</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={PLANT_ICONS_LIST}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        numColumns={3}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: Colors.dark.backgroundElevated,
        borderTopLeftRadius: Layout.borderRadius.lg,
        borderTopRightRadius: Layout.borderRadius.lg,
        maxHeight: '60%',
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Layout.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
    },
    closeButton: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
    },
    listContent: {
        padding: Layout.spacing.md,
    },
    iconItem: {
        flex: 1,
        alignItems: 'center',
        margin: Layout.spacing.sm,
        padding: Layout.spacing.md,
        borderRadius: Layout.borderRadius.md,
        backgroundColor: Colors.dark.backgroundSecondary,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedIconItem: {
        borderColor: Colors.dark.accent,
        backgroundColor: 'rgba(124, 77, 255, 0.1)',
    },
    iconName: {
        marginTop: Layout.spacing.xs,
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
});
