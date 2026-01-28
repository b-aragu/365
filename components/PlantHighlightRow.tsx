import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withDelay } from 'react-native-reanimated';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { getDayOfYear } from '@/utils/dateUtils';
import { Colors } from '@/constants/Colors';

export const PlantHighlightRow = () => {
    const { entries } = useJournalEntries();

    // Calculate progress for the year
    const currentDayOfYear = getDayOfYear(new Date());
    const entriesThisYear = entries.filter(e => e.year === new Date().getFullYear()).length;
    const progressPercent = currentDayOfYear > 0 ? Math.round((entriesThisYear / currentDayOfYear) * 100) : 0;

    // Determine message based on progress
    const getMessage = () => {
        if (entriesThisYear === 0) return "Start your garden today";
        if (progressPercent >= 90) return "🌟 Amazing consistency!";
        if (progressPercent >= 70) return "🌿 Your garden is flourishing";
        if (progressPercent >= 50) return "🌱 Keep growing";
        return "🌱 Every memory counts";
    };

    const width = useSharedValue(0);

    React.useEffect(() => {
        width.value = withDelay(300, withTiming(progressPercent, { duration: 1000 }));
    }, [progressPercent]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${Math.min(width.value, 100)}%`,
        };
    });

    return (
        <View style={styles.container}>
            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <Animated.View style={[styles.progressFill, animatedStyle]} />
                </View>
            </View>

            {/* Clear label: "X memories planted out of Y days" */}
            <Text style={styles.progressText}>
                {entriesThisYear} {entriesThisYear === 1 ? 'memory' : 'memories'} planted in {currentDayOfYear} days
            </Text>

            {/* Motivational message */}
            <Text style={styles.message}>{getMessage()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 6,
    },
    progressContainer: {
        width: '100%',
    },
    progressBar: {
        height: 4,
        backgroundColor: Colors.dark.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.dark.plantGreen,
        borderRadius: 2,
    },
    progressText: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        fontFamily: 'Inter_500Medium',
        textAlign: 'center',
    },
    message: {
        color: Colors.dark.textTertiary,
        fontSize: 11,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
    },
});
