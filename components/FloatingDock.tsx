import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { Svg, Path } from 'react-native-svg';

// Grid Icon (4 squares)
const GridIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M3 3H10V10H3V3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14 3H21V10H14V3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14 14H21V21H14V14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 14H10V21H3V14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Plant Icon (Potted Plant Outline)
const PlantIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M12 22V12M12 12L17 7M12 12L7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 12C12 12 16 9 16 12C16 15 12 12 12 12ZM12 12C12 12 8 9 8 12C8 15 12 12 12 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M7 17H17L19 22H5L7 17Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Standalone Sparkle Icon
const SparkleIcon = () => (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" fill={Colors.dark.textTertiary} opacity={0.8} />
    </Svg>
);

interface FloatingDockProps {
    activeTab: 'year' | 'journal' | 'settings';
    onTabPress: (tab: 'year' | 'journal' | 'settings') => void;
}

export const FloatingDock = ({ activeTab, onTabPress }: FloatingDockProps) => {
    return (
        <View style={styles.wrapper}>
            {/* The Dock (Centered) */}
            <View style={styles.container}>
                <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'year' && styles.activeTab]}
                        onPress={() => onTabPress('year')}
                    >
                        <GridIcon color={activeTab === 'year' ? Colors.dark.text : Colors.dark.textTertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => onTabPress('journal')}
                    >
                        {/* Using Plant Icon for the second tab instead of pencil */}
                        <PlantIcon color={activeTab === 'journal' ? Colors.dark.text : Colors.dark.textTertiary} />
                    </TouchableOpacity>
                </BlurView>
            </View>

            {/* External Sparkle (Bottom Right) */}
            <View style={styles.sparkleContainer}>
                <SparkleIcon />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 40,
        height: 80, // Reservation area
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        borderRadius: 30, // Tighter pill
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    blurContainer: {
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 24, // Tighter
        gap: 32, // Increased spacing between icons
        backgroundColor: 'rgba(20, 20, 20, 0.8)',
    },
    tab: {
        // No background on active state requested, just icon color change? 
        // User said "Active icon (grid) should be brighter/white"
        // Keeping subtle background for hit area guidance but making it very subtle or removing
    },
    activeTab: {
        // Keeping subtle active indicator if desired, otherwise transparent
        // backgroundColor: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: 8,
    },
    sparkleContainer: {
        position: 'absolute',
        right: 32, // Distance from right edge
        bottom: 25, // Align with dock center visually
    }
});
