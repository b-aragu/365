import * as Haptics from 'expo-haptics';
import { getHapticsEnabled } from './preferences';

export const triggerSelectionHaptic = async (): Promise<void> => {
    if (!(await getHapticsEnabled())) return;
    await Haptics.selectionAsync();
};

export const triggerSuccessHaptic = async (): Promise<void> => {
    if (!(await getHapticsEnabled())) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
