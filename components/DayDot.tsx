import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, withRepeat, withSequence, useSharedValue } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface DayDotProps {
    date: string;
    isFilled: boolean;
    isToday: boolean;
    onPress: () => void;
    plantColor?: string;
}

export const DayDot: React.FC<DayDotProps> = ({ isFilled, isToday, onPress, plantColor }) => {
    // Pulse animation for "Today"
    const pulseAnim = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: withSpring(isFilled ? 1 : 0.8) }, // Base scale logic
            ],
            opacity: withTiming(isFilled ? 1 : 0.6),
        };
    });

    // Let's stick to Reanimated for consistency
    const pulseScale = useSharedValue(1);

    React.useEffect(() => {
        if (isToday) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1, // Infinite
                true // Reverse
            );
        }
    }, [isToday]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: isToday ? pulseScale.value : withSpring(isFilled ? 1 : 0.8) }
            ],
            opacity: withTiming(isFilled ? 1 : 0.6),
            backgroundColor: isToday ? Colors.dark.dotHighlight : (isFilled ? (plantColor || Colors.dark.plantGreen) : Colors.dark.dotEmpty),
            borderColor: 'transparent',
            borderWidth: 0,
            shadowColor: isToday ? Colors.dark.dotHighlight : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isToday ? 0.8 : 0,
            shadowRadius: isToday ? 8 : 0,
            elevation: isToday ? 10 : 0,
        };
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Animated.View
                style={[
                    styles.dot,
                    animatedStyle
                ]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Layout.grid.dotSize + Layout.grid.dotSpacing,
        height: Layout.grid.dotSize + Layout.grid.dotSpacing,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: Layout.grid.dotSize,
        height: Layout.grid.dotSize,
        borderRadius: Layout.grid.dotSize / 2,
    },
});
