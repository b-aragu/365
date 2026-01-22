import React, { memo, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { DayDot } from './DayDot';
import { generateYearDays } from '@/utils/dateUtils';
import { JournalEntry } from '@/types';
import { Layout } from '@/constants/Layout';
import { PLANT_ICONS_LIST } from '@/assets/icons/plants';

interface YearGridProps {
    year: number;
    entries: JournalEntry[];
    onDayPress: (date: string) => void;
}

// Get plant component by ID
const getPlantComponent = (plantId?: string) => {
    if (!plantId) return PLANT_ICONS_LIST[0]?.component;
    const found = PLANT_ICONS_LIST.find(p => p.id === plantId);
    return found?.component || PLANT_ICONS_LIST[0]?.component;
};

// Memoized DayDot for performance
const MemoizedDayDot = memo(DayDot);

export const YearGrid: React.FC<YearGridProps> = ({ year, entries, onDayPress }) => {
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const days = useMemo(() => generateYearDays(year), [year]);

    // Create a map for O(1) entry lookup
    const entryMap = useMemo(() => {
        const map = new Map<string, JournalEntry>();
        entries.forEach(e => map.set(e.date, e));
        return map;
    }, [entries]);

    const handleDayPress = useCallback((date: string, isFuture: boolean) => {
        if (!isFuture) {
            onDayPress(date);
        }
    }, [onDayPress]);

    const renderItem = useCallback(({ item }: { item: any }) => {
        const entry = entryMap.get(item.date);
        const isToday = item.date === today;
        const isFuture = item.date > today;

        // Get SVG component for filled days
        const PlantComponent = entry ? getPlantComponent(entry.plantIconId) : undefined;

        return (
            <MemoizedDayDot
                date={item.date}
                isFilled={!!entry}
                isToday={isToday}
                isFuture={isFuture}
                PlantIcon={PlantComponent}
                onPress={() => handleDayPress(item.date, isFuture)}
                disabled={isFuture}
            />
        );
    }, [entryMap, today, handleDayPress]);

    const keyExtractor = useCallback((item: any) => item.date, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={days}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={Layout.grid.maxDotsPerRow}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                initialNumToRender={100}
                maxToRenderPerBatch={50}
                windowSize={10}
                getItemLayout={(data, index) => ({
                    length: Layout.grid.dotSize + Layout.grid.dotSpacing,
                    offset: (Layout.grid.dotSize + Layout.grid.dotSpacing) * Math.floor(index / Layout.grid.maxDotsPerRow),
                    index,
                })}
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
