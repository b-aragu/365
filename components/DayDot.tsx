import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming, withRepeat, withSequence, useSharedValue } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface DayDotProps {
    date: string;
    dayNumber: number;
    isFilled: boolean;
    isToday: boolean;
    isFuture?: boolean;
    brightness: 'past' | 'today' | 'future';
    onPress: () => void;
    plantEmoji?: string;
    disabled?: boolean;
}

const DayDotComponent: React.FC<DayDotProps> = ({
    isFilled,
    isToday,
    isFuture = false,
    brightness,
    onPress,
    plantEmoji,
    disabled = false
}) => {
    const pulseScale = useSharedValue(1);

    React.useEffect(() => {
        if (isToday) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.4, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1,
                true
            );
        }
    }, [isToday]);

    // Brightness values
    const opacityMap = {
        past: 0.6,      // Past days: visible but not bright
        today: 1,       // Today: full brightness
        future: 0.2,    // Future: very faded
    };

    const animatedStyle = useAnimatedStyle(() => {
        const baseOpacity = opacityMap[brightness];

        return {
            transform: [
                { scale: isToday ? pulseScale.value : withSpring(1) }
            ],
            opacity: isFilled ? 1 : baseOpacity,
        };
    });

    // If filled with a memory, show emoji
    if (isFilled && plantEmoji) {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={styles.container}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <Animated.View style={[styles.emojiContainer, animatedStyle]}>
                    <Text style={styles.emoji}>{plantEmoji}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    }

    // Empty dot styling
    const getDotColor = () => {
        if (isToday) return Colors.dark.dotHighlight; // Bright white for today
        if (isFuture) return Colors.dark.dotEmpty;
        return Colors.dark.dotEmpty;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
        >
            <Animated.View
                style={[
                    styles.dot,
                    animatedStyle,
                    { backgroundColor: getDotColor() },
                    isToday && styles.todayDot,
                ]}
            />
        </TouchableOpacity>
    );
};

// Memoize to prevent unnecessary re-renders
export const DayDot = memo(DayDotComponent);

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
    todayDot: {
        // Glow effect for today
        shadowColor: Colors.dark.dotHighlight,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 15,
    },
    emojiContainer: {
        width: Layout.grid.dotSize + 4,
        height: Layout.grid.dotSize + 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: Layout.grid.dotSize - 2,
        textAlign: 'center',
    },
});
