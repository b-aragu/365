import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { DayDot } from './DayDot';
import { generateYearDays } from '@/utils/dateUtils';
import { JournalEntry } from '@/types';
import { Layout } from '@/constants/Layout';
import { getPlantColor } from '@/constants/PlantColors';

interface YearGridProps {
    year: number;
    entries: JournalEntry[];
    onDayPress: (date: string) => void;
}

export const YearGrid: React.FC<YearGridProps> = ({ year, entries, onDayPress }) => {
    const days = generateYearDays(year);
    const today = new Date().toISOString().split('T')[0];

    const renderItem = ({ item }: { item: any }) => {
        const entry = entries.find(e => e.date === item.date);
        const isToday = item.date === today;
        const isFuture = item.date > today;
        const isPast = item.date < today;

        // Get plant-specific color if entry exists
        const plantColor = entry ? getPlantColor(entry.plantIconId) : undefined;

        return (
            <DayDot
                date={item.date}
                isFilled={!!entry}
                isToday={isToday}
                isFuture={isFuture}
                isPast={isPast}
                plantColor={plantColor}
                onPress={() => {
                    // Only allow press for today or past days with entries
                    if (!isFuture) {
                        onDayPress(item.date);
                    }
                }}
                disabled={isFuture}
            />
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={days}
                renderItem={renderItem}
                keyExtractor={item => item.date}
                numColumns={Layout.grid.maxDotsPerRow}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                initialNumToRender={50}
                maxToRenderPerBatch={30}
                windowSize={5}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    gridContent: {
        padding: Layout.grid.padding,
        alignItems: 'center',
    },
    row: {
        justifyContent: 'flex-start',
    },
});
