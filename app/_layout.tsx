import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });
    const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
    const router = useRouter();
    const segments = useSegments();

    // Check onboarding status
    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                const value = await AsyncStorage.getItem('hasOnboarded');
                setHasOnboarded(value === 'true');
            } catch {
                setHasOnboarded(false);
            }
        };
        checkOnboarding();
    }, []);

    // Hide splash and navigate appropriately
    useEffect(() => {
        if (loaded && hasOnboarded !== null) {
            SplashScreen.hideAsync();

            // If not onboarded and not already on onboarding, redirect
            const isOnboardingRoute = segments[0] === 'onboarding';
            if (!hasOnboarded && !isOnboardingRoute) {
                router.replace('/onboarding');
            }
        }
    }, [loaded, hasOnboarded, segments]);

    if (!loaded || hasOnboarded === null) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={DarkTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="settings" options={{ headerShown: false }} />
                    <Stack.Screen name="journal/[date]" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="light" />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
