import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import { triggerSelectionHaptic } from '@/utils/haptics';

// Grid Icon (4 dots in 2x2 pattern - matching target design)
const GridIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Circle cx="7" cy="7" r="2.5" fill={color} />
        <Circle cx="17" cy="7" r="2.5" fill={color} />
        <Circle cx="7" cy="17" r="2.5" fill={color} />
        <Circle cx="17" cy="17" r="2.5" fill={color} />
    </Svg>
);

// Plant Icon (Detailed potted plant - matching target design)
const PlantIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        {/* Pot */}
        <Path d="M8 17H16L17.5 22H6.5L8 17Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M7.5 17H16.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Stem */}
        <Path d="M12 17V11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Leaves */}
        <Path d="M12 11C12 11 8 9 8 6C8 4 10 4 12 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 11C12 11 16 9 16 6C16 4 14 4 12 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Small detail leaf */}
        <Path d="M12 8C12 8 10 7 9 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M12 8C12 8 14 7 15 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
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
    const handlePress = (tab: 'year' | 'journal' | 'settings') => {
        triggerSelectionHaptic().catch(() => { });
        onTabPress(tab);
    };

    return (
        <View style={styles.wrapper}>
            {/* The Dock (Centered) */}
            <View style={styles.container}>
                <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'year' && styles.activeTab]}
                        onPress={() => handlePress('year')}
                    >
                        <GridIcon color={activeTab === 'year' ? Colors.dark.text : Colors.dark.textTertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => handlePress('journal')}
                    >
                        {/* Using Plant Icon for the second tab instead of pencil */}
                        <PlantIcon color={activeTab === 'journal' ? Colors.dark.text : Colors.dark.textTertiary} />
                    </TouchableOpacity>
                </BlurView>
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
