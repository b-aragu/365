import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, withRepeat, withSequence, useSharedValue } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface DayDotProps {
    date: string;
    isFilled: boolean;
    isToday: boolean;
    isFuture?: boolean;
    isPast?: boolean;
    onPress: () => void;
    plantColor?: string;
    disabled?: boolean;
}

export const DayDot: React.FC<DayDotProps> = ({
    isFilled,
    isToday,
    isFuture = false,
    onPress,
    plantColor,
    disabled = false
}) => {
    const pulseScale = useSharedValue(1);

    React.useEffect(() => {
        if (isToday) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.3, { duration: 1200 }),
                    withTiming(1, { duration: 1200 })
                ),
                -1,
                true
            );
        }
    }, [isToday]);

    const animatedStyle = useAnimatedStyle(() => {
        // Future dates are very faded
        const futureOpacity = 0.15;
        const filledOpacity = 1;
        const emptyOpacity = 0.4;

        return {
            transform: [
                { scale: isToday ? pulseScale.value : withSpring(isFilled ? 1 : 0.85) }
            ],
            opacity: isFuture ? futureOpacity : withTiming(isFilled ? filledOpacity : emptyOpacity),
            backgroundColor: isToday
                ? Colors.dark.dotHighlight
                : (isFilled ? (plantColor || Colors.dark.plantGreen) : Colors.dark.dotEmpty),
            // Glow effect for today
            shadowColor: isToday ? Colors.dark.dotHighlight : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isToday ? 0.9 : 0,
            shadowRadius: isToday ? 10 : 0,
            elevation: isToday ? 12 : 0,
        };
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
        >
            <Animated.View style={[styles.dot, animatedStyle]} />
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
