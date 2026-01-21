import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { DayDot } from './DayDot';
import { generateYearDays } from '@/utils/dateUtils';
import { JournalEntry } from '@/types';
import { Layout } from '@/constants/Layout';
import { Colors } from '@/constants/Colors';

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

        // Simple color logic for now, using a default if no plant color logic yet
        const plantColor = entry ? Colors.dark.plantGreen : undefined;

        return (
            <DayDot
                date={item.date}
                isFilled={!!entry}
                isToday={isToday}
                plantColor={plantColor}
                onPress={() => onDayPress(item.date)}
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
