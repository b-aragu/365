// Plant Icon to Color Mapping
// Each plant type gets a unique, harmonious color for visual variety on the grid

import { Colors } from './Colors';

export const PLANT_COLORS: Record<string, string> = {
    // Greens (various shades)
    'tree-pine': '#4A7C59',      // Forest green
    'seedling': '#7CB342',       // Light green
    'potted-soil': '#558B2F',    // Olive green
    'potted-leaf': '#66BB6A',    // Mint green

    // Warm tones
    'flower-daisy': '#FFB74D',   // Soft orange
    'rose-tulip': '#F48FB1',     // Soft pink
    'lavender': '#B39DDB',       // Lavender purple

    // Cool tones
    'bush-cloud': '#4FC3F7',     // Sky blue
    'monstera': '#26A69A',       // Teal
    'fern': '#2E7D32',           // Deep green

    // Earthy tones
    'cactus-pot': '#A1887F',     // Warm brown
    'succulent': '#8BC34A',      // Lime green
    'herb-basil': '#689F38',     // Herb green

    // Special
    'watering-plant': '#81D4FA', // Light blue
    'hands-plant': '#C5E1A5',    // Pale green
    'leaf-branch': '#AED581',    // Yellow-green
};

// Default fallback color
export const DEFAULT_PLANT_COLOR = Colors.dark.plantGreen;

// Get color for a plant icon ID
export const getPlantColor = (iconId: string | undefined): string => {
    if (!iconId) return DEFAULT_PLANT_COLOR;
    return PLANT_COLORS[iconId] || DEFAULT_PLANT_COLOR;
};
