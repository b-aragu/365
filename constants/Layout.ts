import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
    window: {
        width,
        height,
    },
    grid: {
        padding: 20,
        dotSize: 14, // Slightly smaller than spec to fit phones better initially
        dotSpacing: 6,
        maxDotsPerRow: 20,
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
