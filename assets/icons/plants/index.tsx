import React from 'react';
import { Svg, Path, Circle, Rect, G } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

interface IconProps {
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
    opacity?: number;
}

// ===== DETAILED PLANT ICONS =====
// Designed to match the target aesthetic: delicate line-art, decorative

// 1. Potted Plant with Large Leaf
export const PottedLeaf = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M8 22H16L17.5 17H6.5L8 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 17V12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 12C12 12 8 10 8 6C8 3 12 4 12 4C12 4 16 3 16 6C16 10 12 12 12 12Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 8C12 8 10 6 12 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// 2. Seedling/Sprout 
export const Seedling = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M12 22V14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 14C12 14 7 12 7 8C7 5 10 5 12 6C14 5 17 5 17 8C17 12 12 14 12 14Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 10L10 7M12 10L14 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M9 22H15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// 3. Potted Plant with Soil (potted cactus/succulent style)
export const PottedSoil = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M7 22H17L18 16H6L7 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8 16C8 16 8 14 12 14C16 14 16 16 16 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 14V8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M9 11H15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M10 8H14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Circle cx="12" cy="5" r="2" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
);

// 4. Small Leaves/Branch
export const LeafBranch = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M12 22V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 6C12 6 8 4 6 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 6C12 6 16 4 18 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 10C12 10 8 9 5 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 10C12 10 16 9 19 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 14C12 14 9 13 7 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 14C12 14 15 13 17 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 18C12 18 10 17 9 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 18C12 18 14 17 15 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// 5. Flower (Daisy/Sunflower style)
export const FlowerDaisy = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Circle cx="12" cy="8" r="3" stroke={color} strokeWidth={strokeWidth} />
        <Path d="M12 5V2M12 11V14M9 8H6M18 8H15M9.5 5.5L7 3M14.5 5.5L17 3M9.5 10.5L7 13M14.5 10.5L17 13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 14V22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M10 17C10 17 8 16 7 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M14 17C14 17 16 16 17 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// 6. Tree (Pine/Evergreen)
export const TreePine = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M12 2L6 10H8L4 16H10V22H14V16H20L16 10H18L12 2Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 7. Watering Can with Plant
export const WateringPlant = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M5 14H15L16 22H4L5 14Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M10 14V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M10 10C10 10 6 8 6 5C6 3 8 3 10 4C12 3 14 3 14 5C14 8 10 10 10 10Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M17 8L20 6V10L17 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="21" cy="8" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
);

// 8. Hands Holding Plant
export const HandsPlant = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M4 16C4 16 6 14 8 14C10 14 12 15 12 15C12 15 14 14 16 14C18 14 20 16 20 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M4 16L6 22M20 16L18 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 15V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 10C12 10 9 8 9 5C9 3 11 3 12 4C13 3 15 3 15 5C15 8 12 10 12 10Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// 9. Rose/Tulip
export const RoseTulip = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M12 22V12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M8 12C8 8 10 4 12 2C14 4 16 8 16 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8 12C8 12 10 13 12 13C14 13 16 12 16 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M10 16C10 16 8 15 7 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M14 16C14 16 16 15 17 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// 10. Cloud/Bush
export const BushCloud = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M12 22V16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 16C6 16 4 12 6 9C8 6 12 7 12 7C12 7 16 6 18 9C20 12 18 16 12 16Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 12H15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 9V15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// 11. Cactus in Pot
export const CactusPot = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M8 22H16L17 17H7L8 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 17V8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M10 9L10 6C10 5 9 5 8 6C7 7 7 9 8 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M14 11L14 8C14 7 15 7 16 8C17 9 17 11 16 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Circle cx="12" cy="6" r="2" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
);

// 12. Monstera Leaf
export const MonsteraLeaf = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M12 22V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 10C12 10 6 8 5 4C4 0 10 2 12 4C14 2 20 0 19 4C18 8 12 10 12 10Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 6L12 8L15 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M7 4L8 7M17 4L16 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// 13. Fern
export const Fern = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M12 22V4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 6L8 4M12 6L16 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 9L7 6M12 9L17 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 12L6 8M12 12L18 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 15L7 11M12 15L17 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 18L8 15M12 18L16 15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// 14. Succulent
export const Succulent = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M7 22H17L18 18H6L7 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 18C12 18 16 16 16 13C16 10 12 11 12 11C12 11 8 10 8 13C8 16 12 18 12 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 11C12 11 15 9 15 6C15 4 12 5 12 5C12 5 9 4 9 6C9 9 12 11 12 11Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 5L12 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// 15. Lavender
export const Lavender = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M12 22V12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M9 18L12 22L15 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="4" r="2" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="10" cy="7" r="1.5" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="14" cy="7" r="1.5" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="9" cy="10" r="1.5" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="15" cy="10" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
);

// 16. Herb/Basil
export const HerbBasil = ({ width = 24, height = 24, color = Colors.dark.textSecondary, strokeWidth = 1.5, opacity = 1 }: IconProps) => (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" opacity={opacity}>
        <Path d="M12 22V12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M8 22H16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 12C12 12 8 10 8 7C8 4 12 5 12 5C12 5 16 4 16 7C16 10 12 12 12 12Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 5C12 5 9 3 7 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 5C12 5 15 3 17 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 8C12 8 9 7 8 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <Path d="M12 8C12 8 15 7 16 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
);

// ===== LEGACY ICONS (for compatibility) =====
export const PlantIcons = {
    sprout: Seedling,
    flower: FlowerDaisy,
    tree: TreePine,
    cactus: CactusPot,
    mushroom: BushCloud, // Replaced with more botanical icon
};

// ===== NEW DETAILED ICONS LIST =====
export const DETAILED_PLANT_ICONS = [
    { id: 'potted-leaf', name: 'Potted Leaf', component: PottedLeaf, category: 'Potted' },
    { id: 'seedling', name: 'Seedling', component: Seedling, category: 'Growth' },
    { id: 'potted-soil', name: 'Potted Soil', component: PottedSoil, category: 'Potted' },
    { id: 'leaf-branch', name: 'Leaf Branch', component: LeafBranch, category: 'Leaves' },
    { id: 'flower-daisy', name: 'Daisy', component: FlowerDaisy, category: 'Flowers' },
    { id: 'tree-pine', name: 'Pine Tree', component: TreePine, category: 'Trees' },
    { id: 'watering-plant', name: 'Watering', component: WateringPlant, category: 'Actions' },
    { id: 'hands-plant', name: 'Hands Plant', component: HandsPlant, category: 'Actions' },
    { id: 'rose-tulip', name: 'Rose', component: RoseTulip, category: 'Flowers' },
    { id: 'bush-cloud', name: 'Bush', component: BushCloud, category: 'Trees' },
    { id: 'cactus-pot', name: 'Cactus', component: CactusPot, category: 'Cacti' },
    { id: 'monstera', name: 'Monstera', component: MonsteraLeaf, category: 'Leaves' },
    { id: 'fern', name: 'Fern', component: Fern, category: 'Leaves' },
    { id: 'succulent', name: 'Succulent', component: Succulent, category: 'Cacti' },
    { id: 'lavender', name: 'Lavender', component: Lavender, category: 'Flowers' },
    { id: 'herb-basil', name: 'Basil', component: HerbBasil, category: 'Herbs' },
];

// Backwards compatible list (first 4 for JournalEditor)
export const PLANT_ICONS_LIST = [
    { id: 'tree-pine', name: 'Tree', component: TreePine, category: 'Trees' },
    { id: 'seedling', name: 'Seedling', component: Seedling, category: 'Growth' },
    { id: 'potted-soil', name: 'Potted', component: PottedSoil, category: 'Potted' },
    { id: 'potted-leaf', name: 'Potted Leaf', component: PottedLeaf, category: 'Potted' },
    { id: 'flower-daisy', name: 'Flower', component: FlowerDaisy, category: 'Flowers' },
];
