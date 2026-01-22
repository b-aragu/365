import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { PlantIcons } from '@/assets/icons/plants';
import { Colors } from '@/constants/Colors';

const ICONS_TO_SHOW = ['tree', 'sprout', 'flower', 'cactus'];

export const PlantHighlightRow = () => {
    return (
        <View style={styles.container}>
            {ICONS_TO_SHOW.map((iconName, index) => {
                // @ts-ignore
                const Icon = PlantIcons[iconName];
                return (
                    <View key={index} style={styles.iconWrapper}>
                        {Icon && <Icon width={32} height={32} color={Colors.dark.textSecondary} />}
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32, // Increased from 24
        marginBottom: 20,
        opacity: 0.8,
    },
    iconWrapper: {
        // Optional: specific styling if needed
    }
});
