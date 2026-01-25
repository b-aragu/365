import React, { memo, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { DayDot } from './DayDot';
import { generateYearDays } from '@/utils/dateUtils';
import { JournalEntry } from '@/types';
import { Layout } from '@/constants/Layout';
import { PLANT_ICONS_LIST } from '@/assets/icons/plants';
import { getPlantColor } from '@/constants/PlantColors';

interface YearGridProps {
    year: number;
    entries: JournalEntry[];
    onDayPress: (date: string) => void;
}

// Get plant component and color by ID
const getPlantInfo = (plantId?: string) => {
    const defaultPlant = PLANT_ICONS_LIST[0];
    if (!plantId) return { component: defaultPlant?.component, color: getPlantColor(plantId) };
    const found = PLANT_ICONS_LIST.find(p => p.id === plantId);
    return {
        component: found?.component || defaultPlant?.component,
        color: getPlantColor(plantId)
    };
};

// Memoized DayDot
const MemoizedDayDot = memo(DayDot);

export const YearGrid: React.FC<YearGridProps> = ({ year, entries, onDayPress }) => {
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const days = useMemo(() => generateYearDays(year), [year]);

    // O(1) entry lookup
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

        // Get plant info for colored icon
        const plantInfo = entry ? getPlantInfo(entry.plantIconId) : null;

        return (
            <MemoizedDayDot
                date={item.date}
                isFilled={!!entry}
                isToday={isToday}
                isFuture={isFuture}
                PlantIcon={plantInfo?.component}
                plantColor={plantInfo?.color}
                onPress={() => handleDayPress(item.date, isFuture)}
                disabled={isFuture}
            />
        );
    }, [entryMap, today, handleDayPress]);

    const keyExtractor = useCallback((item: any) => item.date, []);

    // OPTIMIZATION: Use ScrollView + FlexWrap instead of FlatList for fixed grid (~365 items)
    // This removes virtualization overhead for a dataset that fits easily in memory
    return (
        <View style={styles.container}>
            <View style={styles.gridContent}>
                {days.map((item) => {
                    const entry = entryMap.get(item.date);
                    const isToday = item.date === today;
                    const isFuture = item.date > today;
                    const plantInfo = entry ? getPlantInfo(entry.plantIconId) : null;

                    return (
                        <MemoizedDayDot
                            key={item.date}
                            date={item.date}
                            isFilled={!!entry}
                            isToday={isToday}
                            isFuture={isFuture}
                            PlantIcon={plantInfo?.component}
                            plantColor={plantInfo?.color}
                            onPress={() => handleDayPress(item.date, isFuture)}
                            disabled={isFuture}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    gridContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: Layout.grid.padding,
    },
});
