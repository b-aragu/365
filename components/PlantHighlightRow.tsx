import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DETAILED_PLANT_ICONS } from '@/assets/icons/plants';
import { Colors } from '@/constants/Colors';

export const PlantHighlightRow = () => {
    // Display 2 rows of icons (8 icons each)
    const row1Icons = DETAILED_PLANT_ICONS.slice(0, 8);
    const row2Icons = DETAILED_PLANT_ICONS.slice(8, 16);

    return (
        <View style={styles.container}>
            {/* Row 1 */}
            <View style={styles.row}>
                {row1Icons.map((plant, index) => {
                    const Icon = plant.component;
                    return (
                        <View key={plant.id} style={styles.iconWrapper}>
                            <Icon width={24} height={24} color={Colors.dark.textSecondary} strokeWidth={1.2} />
                        </View>
                    );
                })}
            </View>
            {/* Row 2 */}
            <View style={styles.row}>
                {row2Icons.map((plant, index) => {
                    const Icon = plant.component;
                    return (
                        <View key={plant.id} style={styles.iconWrapper}>
                            <Icon width={24} height={24} color={Colors.dark.textSecondary} strokeWidth={1.2} />
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        opacity: 0.7,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    iconWrapper: {
        // Optional padding for touch targets if interactive
    }
});
