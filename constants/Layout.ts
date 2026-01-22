import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
    window: {
        width,
        height,
    },
    grid: {
        padding: 16,
        dotSize: 14, // Larger for better visibility
        dotSpacing: 6, // Tighter spacing
        maxDotsPerRow: 18,
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
