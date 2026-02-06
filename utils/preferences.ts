import AsyncStorage from '@react-native-async-storage/async-storage';

const HAPTIC_ENABLED_KEY = '@365_haptics_enabled';

let cachedHapticsEnabled: boolean | null = null;

export const getHapticsEnabled = async (): Promise<boolean> => {
    if (cachedHapticsEnabled !== null) return cachedHapticsEnabled;

    try {
        const value = await AsyncStorage.getItem(HAPTIC_ENABLED_KEY);
        cachedHapticsEnabled = value !== 'false';
        return cachedHapticsEnabled;
    } catch {
        cachedHapticsEnabled = true;
        return true;
    }
};

export const setHapticsEnabled = async (enabled: boolean): Promise<void> => {
    cachedHapticsEnabled = enabled;
    await AsyncStorage.setItem(HAPTIC_ENABLED_KEY, String(enabled));
};
