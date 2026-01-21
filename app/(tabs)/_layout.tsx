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
                    backgroundColor: Colors.dark.backgroundSecondary,
                    borderTopColor: Colors.dark.border,
                }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Year',
                    // Icon would go here
                }}
            />
        </Tabs>
    );
}
