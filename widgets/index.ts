import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './YearWidget';

// Register the widget task handler
registerWidgetTaskHandler(widgetTaskHandler);

export { widgetTaskHandler };
