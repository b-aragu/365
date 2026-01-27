import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withRepeat, withSequence, useSharedValue, FadeIn, ZoomIn } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface DayDotProps {
    date: string;
    isFilled: boolean;
    isToday: boolean;
    isFuture?: boolean;
    onPress: () => void;
    PlantIcon?: React.ComponentType<any>;
    plantColor?: string;
    disabled?: boolean;
    index?: number;
}

// 1. Separate Animated Dot for Today (Hook overhead only here)
const TodayDot: React.FC<{ size: number; color: string }> = ({ size, color }) => {
    const pulseScale = useSharedValue(1);

    React.useEffect(() => {
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.5, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    return (
        <Animated.View
            style={[
                styles.dot,
                animatedStyle,
                styles.todayDot,
                {
                    backgroundColor: color,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                }
            ]}
        />
    );
};

// 2. Main Component (Memoized)
const DayDotComponent: React.FC<DayDotProps> = ({
    isFilled,
    isToday,
    isFuture = false,
    onPress,
    PlantIcon,
    plantColor,
    disabled = false,
    index = 0
}) => {
    // Subtle staggered entry
    // Cap delay to avoid waiting too long for end of year items
    const maxDelay = 800;
    // Use a non-linear delay or batching effectively by clamping, or just a small multiplier
    // 365 * 2ms = 730ms total time for last dot to start. Acceptable.
    const delay = Math.min(index * 2, maxDelay);

    // Render colored SVG plant icon for filled days
    if (isFilled && PlantIcon) {
        const iconSize = Layout.grid.dotSize + 4;
        const color = plantColor || Colors.dark.plantGreen;
        return (
            <AnimatedTouchableOpacity
                entering={ZoomIn.delay(delay).springify().damping(12)}
                onPress={onPress}
                style={styles.container}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    <PlantIcon
                        width={iconSize}
                        height={iconSize}
                        color={color}
                        strokeWidth={1.5}
                    />
                </View>
            </AnimatedTouchableOpacity>
        );
    }

    // Determine styles
    let backgroundColor = Colors.dark.dotPast;
    let opacity = 0.5;
    let size = Layout.grid.dotSize;

    if (isToday) {
        backgroundColor = Colors.dark.dotHighlight;
        opacity = 1;
        size = Layout.grid.dotSize + 2;
    } else if (isFuture) {
        backgroundColor = Colors.dark.dotFuture;
        opacity = 0.2;
        size = Layout.grid.dotSize - 2;
    }

    return (
        <AnimatedTouchableOpacity
            entering={ZoomIn.delay(delay).springify().damping(12)}
            onPress={onPress}
            style={styles.container}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.7}
        >
            {isToday ? (
                <TodayDot size={size} color={backgroundColor} />
            ) : (
                <View
                    style={[
                        styles.dot,
                        {
                            backgroundColor,
                            opacity,
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                        }
                    ]}
                />
            )}
        </AnimatedTouchableOpacity>
    );
};

export const DayDot = memo(DayDotComponent);

const styles = StyleSheet.create({
    container: {
        width: Layout.grid.dotSize + Layout.grid.dotSpacing,
        height: Layout.grid.dotSize + Layout.grid.dotSpacing,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {},
    todayDot: {
        shadowColor: Colors.dark.dotHighlight,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 10,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
