import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const NOTIFICATION_KEY = 'notificationsEnabled';
const NOTIFICATION_ID = 'daily-reminder';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Request permission for notifications
export async function requestNotificationPermission(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return false;
    }

    // Android needs a channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily', {
            name: 'Daily Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
        });
    }

    return true;
}

// Schedule daily notification at 8 PM
export async function scheduleDailyReminder(): Promise<void> {
    // Cancel existing notification
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => { });

    // Schedule new one
    await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
            title: "🌱 Time to plant a memory",
            body: "What will you remember about today?",
            sound: true,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 20, // 8 PM
            minute: 0,
        },
    });
}

// Cancel daily reminder
export async function cancelDailyReminder(): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => { });
}

// Check if notifications are enabled
export async function areNotificationsEnabled(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(NOTIFICATION_KEY);
        return value === 'true';
    } catch {
        return false;
    }
}

// Toggle notification setting
export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(NOTIFICATION_KEY, enabled ? 'true' : 'false');

    if (enabled) {
        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
            await scheduleDailyReminder();
        }
    } else {
        await cancelDailyReminder();
    }
}

// Initialize notifications on app start
export async function initializeNotifications(): Promise<void> {
    const enabled = await areNotificationsEnabled();
    if (enabled) {
        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
            await scheduleDailyReminder();
        }
    }
}
