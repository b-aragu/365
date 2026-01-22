import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, withRepeat, withSequence, useSharedValue } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface DayDotProps {
    date: string;
    isFilled: boolean;
    isToday: boolean;
    isFuture?: boolean;
    onPress: () => void;
    PlantIcon?: React.ComponentType<any>;
    disabled?: boolean;
}

const DayDotComponent: React.FC<DayDotProps> = ({
    isFilled,
    isToday,
    isFuture = false,
    onPress,
    PlantIcon,
    disabled = false
}) => {
    const pulseScale = useSharedValue(1);

    React.useEffect(() => {
        if (isToday) {
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.6, { duration: 1200 }),
                    withTiming(1, { duration: 1200 })
                ),
                -1,
                true
            );
        }
    }, [isToday]);

    const animatedDotStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: isToday ? pulseScale.value : 1 }
            ],
        };
    });

    // Render SVG plant icon for filled days
    if (isFilled && PlantIcon) {
        const iconSize = Layout.grid.dotSize + 4;
        return (
            <TouchableOpacity
                onPress={onPress}
                style={styles.container}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    <PlantIcon
                        width={iconSize}
                        height={iconSize}
                        color={Colors.dark.plantGreen}
                        strokeWidth={1.5}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    // Get dot appearance based on state
    const getDotStyle = () => {
        if (isToday) {
            return {
                backgroundColor: Colors.dark.dotHighlight,
                opacity: 1,
                width: Layout.grid.dotSize + 2,
                height: Layout.grid.dotSize + 2,
            };
        }
        if (isFuture) {
            return {
                backgroundColor: Colors.dark.dotFuture,
                opacity: 0.25,
                width: Layout.grid.dotSize - 2,
                height: Layout.grid.dotSize - 2,
            };
        }
        // Past empty
        return {
            backgroundColor: Colors.dark.dotPast,
            opacity: 0.5,
            width: Layout.grid.dotSize,
            height: Layout.grid.dotSize,
        };
    };

    const dotStyle = getDotStyle();

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
                    animatedDotStyle,
                    {
                        backgroundColor: dotStyle.backgroundColor,
                        opacity: dotStyle.opacity,
                        width: dotStyle.width,
                        height: dotStyle.height,
                        borderRadius: dotStyle.width / 2,
                    },
                    isToday && styles.todayDot,
                ]}
            />
        </TouchableOpacity>
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
    dot: {
        // Size set dynamically
    },
    todayDot: {
        shadowColor: Colors.dark.dotHighlight,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 12,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
