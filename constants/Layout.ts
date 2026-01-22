import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
    window: {
        width,
        height,
    },
    grid: {
        padding: 20,
        dotSize: 10, // Smaller for 365 grid density
        dotSpacing: 8, // More spacing for airiness
        maxDotsPerRow: 18, // Adjust columns for phone width
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 24,
        xl: 32,
    },
};
