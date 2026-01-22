import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { Svg, Path, Circle } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Simple plant icon
const PlantIcon = ({ size = 80 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 22V12" stroke={Colors.dark.plantGreen} strokeWidth={2} strokeLinecap="round" />
        <Path d="M12 12C12 12 8 9 8 6C8 3 12 3 12 6C12 3 16 3 16 6C16 9 12 12 12 12Z" fill={Colors.dark.plantGreen} stroke={Colors.dark.plantGreen} strokeWidth={1} />
        <Path d="M12 16C12 16 7 14 6 11C5 8 8 7 9 9C8 7 10 5 12 7C14 5 16 7 15 9C16 7 19 8 18 11C17 14 12 16 12 16Z" fill={Colors.dark.plantGreenLight} stroke={Colors.dark.plantGreenLight} strokeWidth={0.5} />
    </Svg>
);

// Calendar grid icon
const CalendarIcon = ({ size = 80 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {[...Array(16)].map((_, i) => (
            <Circle
                key={i}
                cx={5 + (i % 4) * 5}
                cy={5 + Math.floor(i / 4) * 5}
                r={1.5}
                fill={i < 10 ? Colors.dark.plantGreen : Colors.dark.dotPast}
                opacity={i < 10 ? 1 : 0.4}
            />
        ))}
    </Svg>
);

// Star icon
const StarIcon = ({ size = 80 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z"
            fill={Colors.dark.accent}
            stroke={Colors.dark.accent}
            strokeWidth={1}
        />
    </Svg>
);

const slides = [
    {
        id: 1,
        icon: PlantIcon,
        title: "Plant a Memory",
        subtitle: "One day, one thought, one moment.\nCapture what matters.",
    },
    {
        id: 2,
        icon: CalendarIcon,
        title: "365 Days",
        subtitle: "Watch your garden grow.\nEvery dot is a day, every plant is a memory.",
    },
    {
        id: 3,
        icon: StarIcon,
        title: "Build Your Streak",
        subtitle: "Stay consistent.\nYour future self will thank you.",
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasOnboarded', 'true');
            router.replace('/(tabs)');
        } catch (error) {
            console.log('Error saving onboarding state:', error);
            router.replace('/(tabs)');
        }
    };

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleSkip = () => {
        completeOnboarding();
    };

    const slide = slides[currentSlide];
    const IconComponent = slide.icon;
    const isLastSlide = currentSlide === slides.length - 1;

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.container}>
                {/* Skip button */}
                {!isLastSlide && (
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                )}
                {isLastSlide && <View style={styles.skipButton} />}

                {/* Content */}
                <Animated.View
                    key={slide.id}
                    entering={SlideInRight.duration(300)}
                    exiting={SlideOutLeft.duration(300)}
                    style={styles.content}
                >
                    <View style={styles.iconContainer}>
                        <IconComponent size={100} />
                    </View>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.subtitle}>{slide.subtitle}</Text>
                </Animated.View>

                {/* Dots */}
                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentSlide && styles.dotActive
                            ]}
                        />
                    ))}
                </View>

                {/* Button */}
                <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
                    <Text style={styles.buttonText}>
                        {isLastSlide ? "Get Started" : "Next"}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingHorizontal: 24,
    },
    skipButton: {
        alignSelf: 'flex-end',
        padding: 12,
        minHeight: 48,
    },
    skipText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontFamily: 'Inter_500Medium',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        marginBottom: 40,
    },
    title: {
        color: Colors.dark.text,
        fontSize: 28,
        fontFamily: 'Inter_700Bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        textAlign: 'center',
        lineHeight: 24,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.dark.border,
    },
    dotActive: {
        backgroundColor: Colors.dark.plantGreen,
        width: 24,
    },
    button: {
        backgroundColor: Colors.dark.plantGreen,
        paddingVertical: 16,
        borderRadius: 28,
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Inter_600SemiBold',
    },
});
