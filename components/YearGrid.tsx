import React, { memo, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { DayDot } from './DayDot';
import { generateYearDays } from '@/utils/dateUtils';
import { JournalEntry } from '@/types';
import { Layout } from '@/constants/Layout';

interface YearGridProps {
    year: number;
    entries: JournalEntry[];
    onDayPress: (date: string) => void;
}

// Plant ID to Emoji mapping
const PLANT_EMOJI: Record<string, string> = {
    'tree-pine': '🌲',
    'seedling': '🌱',
    'potted-soil': '🪴',
    'potted-leaf': '🌿',
    'flower-daisy': '🌼',
    'rose-tulip': '🌷',
    'lavender': '💜',
    'bush-cloud': '☁️',
    'monstera': '🍃',
    'fern': '🌾',
    'cactus-pot': '🌵',
    'succulent': '🪷',
    'herb-basil': '🌿',
    'watering-plant': '💧',
    'hands-plant': '🤲',
    'leaf-branch': '🍂',
};

const getPlantEmoji = (plantId?: string): string => {
    if (!plantId) return '🌱';
    return PLANT_EMOJI[plantId] || '🌱';
};

// Memoized DayDot for performance
const MemoizedDayDot = memo(DayDot);

export const YearGrid: React.FC<YearGridProps> = ({ year, entries, onDayPress }) => {
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const todayDayOfYear = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }, []);

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

    const renderItem = useCallback(({ item, index }: { item: any; index: number }) => {
        const entry = entryMap.get(item.date);
        const isToday = item.date === today;
        const isFuture = item.date > today;
        const dayNumber = index + 1;

        // Brightness based on position relative to today
        // Past: medium-bright, Today: full bright, Future: faded
        let brightness: 'past' | 'today' | 'future' = 'past';
        if (isToday) brightness = 'today';
        else if (isFuture) brightness = 'future';

        return (
            <MemoizedDayDot
                date={item.date}
                dayNumber={dayNumber}
                isFilled={!!entry}
                isToday={isToday}
                isFuture={isFuture}
                brightness={brightness}
                plantEmoji={entry ? getPlantEmoji(entry.plantIconId) : undefined}
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
                // Performance optimizations
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
