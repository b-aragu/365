import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Svg, Path, Rect } from 'react-native-svg';

// Simple Grid Icon (Year)
const GridIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M3 3H10V10H3V3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14 3H21V10H14V3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14 14H21V21H14V14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 14H10V21H3V14Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Edit/Pencil Icon (Journal)
const EditIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M18.5 2.50001C18.8978 2.10218 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10218 21.5 2.50001C21.8978 2.89783 22.1213 3.4374 22.1213 4.00001C22.1213 4.56261 21.8978 5.10218 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Settings/Menu Icon
const MenuIcon = ({ color }: { color: string }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path d="M3 12H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 6H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 18H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

interface FloatingDockProps {
    activeTab: 'year' | 'journal' | 'settings';
    onTabPress: (tab: 'year' | 'journal' | 'settings') => void;
}

export const FloatingDock = ({ activeTab, onTabPress }: FloatingDockProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.blurContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'year' && styles.activeTab]}
                    onPress={() => onTabPress('year')}
                >
                    <GridIcon color={activeTab === 'year' ? Colors.dark.text : Colors.dark.textTertiary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'journal' && styles.activeTab]}
                    onPress={() => onTabPress('journal')}
                >
                    <EditIcon color={activeTab === 'journal' ? Colors.dark.text : Colors.dark.textTertiary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
                    onPress={() => onTabPress('settings')}
                >
                    <MenuIcon color={activeTab === 'settings' ? Colors.dark.text : Colors.dark.textTertiary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    blurContainer: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 20,
        gap: 24,
        backgroundColor: 'rgba(20, 20, 20, 0.7)', // Fallback / Base color
    },
    tab: {
        padding: 8,
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
});
