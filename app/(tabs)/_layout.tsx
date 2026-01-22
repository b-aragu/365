import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.dark.accent,
                headerShown: false,
                tabBarStyle: {
                    display: 'none', // Hide the tab bar completely
                }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Year',
                }}
            />
        </Tabs>
    );
}
