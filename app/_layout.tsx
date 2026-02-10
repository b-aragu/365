import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase } from '@/utils/storage';
// Register widget task handler
import '@/widgets';
import { refreshWidgetsWithRetry } from '@/utils/widgets';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => { });

// Fast screen transition config
const screenOptions = {
    headerShown: false,
    animation: 'fade' as const,
    animationDuration: 150,
    gestureEnabled: true,
    fullScreenGestureEnabled: true,
};

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });
    const [appReady, setAppReady] = useState(false);
    const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
    const router = useRouter();
    const initDone = useRef(false);
    const navigationDone = useRef(false);

    // Fast initialization with reduced timeout
    useEffect(() => {
        if (initDone.current) return;
        initDone.current = true;

        const initialize = async () => {
            try {
                // Run init tasks with short timeout for snappy startup
                const timeout = new Promise<void>((resolve) => setTimeout(resolve, 1500));

                const initTasks = Promise.all([
                    initDatabase().catch(() => { }),
                    AsyncStorage.getItem('hasOnboarded').then(val => {
                        setHasOnboarded(val === 'true');
                    }).catch(() => {
                        setHasOnboarded(false);
                    }),
                ]);

                await Promise.race([initTasks, timeout]);
            } catch (error) {
                setHasOnboarded(false);
            }

            setAppReady(true);

            // Trigger widget updates to ensure they are fresh and visible on launcher
            refreshWidgetsWithRetry().catch(() => { });
        };

        initialize();
    }, []);

    // Navigate ONCE based on onboarding status
    useEffect(() => {
        if (loaded && appReady && hasOnboarded !== null && !navigationDone.current) {
            navigationDone.current = true;
            SplashScreen.hideAsync().catch(() => { });

            if (!hasOnboarded) {
                router.replace('/onboarding');
            }
        }
    }, [loaded, appReady, hasOnboarded, router]);

    // Force show after shorter timeout
    useEffect(() => {
        const forceShow = setTimeout(() => {
            if (!appReady) {
                setAppReady(true);
                if (hasOnboarded === null) {
                    setHasOnboarded(false);
                }
            }
        }, 3000);
        return () => clearTimeout(forceShow);
    }, [appReady, hasOnboarded]);

    if (!loaded && !appReady) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={DarkTheme}>
                <Stack screenOptions={screenOptions}>
                    <Stack.Screen name="onboarding" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="journal/[date]" options={{ animation: 'slide_from_right' }} />
                </Stack>
                <StatusBar style="light" />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

