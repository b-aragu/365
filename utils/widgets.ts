import { requestWidgetUpdate } from 'react-native-android-widget';
import { getWidget } from '@/widgets/YearWidget';

export const WIDGETS_TO_UPDATE = ['YearWidget', 'PlantGrowthWidget', 'CircularProgressWidget', 'DaysStripWidget'];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const updateAllWidgets = async (): Promise<void> => {
    await Promise.all(
        WIDGETS_TO_UPDATE.map(async (widgetName) => {
            try {
                await requestWidgetUpdate({
                    widgetName,
                    renderWidget: async () => await getWidget(widgetName),
                });
            } catch (err) {
                console.log(`Failed to update widget ${widgetName}:`, err);
            }
        })
    );
};

export const refreshWidgetsWithRetry = async (): Promise<void> => {
    await updateAllWidgets();

    // Some launchers initialize widgets a bit later after app start.
    // Retry to improve reliability when widgets appear blank/delayed.
    await delay(1500);
    await updateAllWidgets();

    await delay(4000);
    await updateAllWidgets();
};
