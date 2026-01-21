import React from 'react';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

export const PlantIcons = {
    sprout: (props: any) => (
        <Svg width= { 24} height={ 24} viewBox="0 0 24 24" fill="none" { ...props }>
            <Path
        d="M12 21V11M12 11C12 11 8 8 8 11C8 14 12 11 12 11ZM12 11C12 11 16 8 16 11C16 14 12 11 12 11Z"
stroke = { props.color || Colors.dark.plantGreenLight }
strokeWidth = { 2}
strokeLinecap = "round"
strokeLinejoin = "round"
    />
    </Svg>
  ),
flower: (props: any) => (
    <Svg width= { 24} height = { 24} viewBox = "0 0 24 24" fill = "none" {...props }>
        <Path
        d="M12 8V21M12 8C10 5 8 6 9 8C10 10 12 8 12 8ZM12 8C14 5 16 6 15 8C14 10 12 8 12 8ZM12 8C12 8 10 9 8 8C5 7 8 5 12 8ZM12 8C12 8 14 9 16 8C19 7 16 5 12 8Z"
stroke = { props.color || Colors.dark.accent }
strokeWidth = { 2}
strokeLinecap = "round"
strokeLinejoin = "round"
    />
    </Svg>
  ),
tree: (props: any) => (
    <Svg width= { 24} height = { 24} viewBox = "0 0 24 24" fill = "none" {...props }>
        <Path
        d="M12 21V12M12 12L7 17M12 12L17 17M12 12L8 8M12 12L16 8M12 8L10 6M12 8L14 6"
stroke = { props.color || Colors.dark.plantGreenDark }
strokeWidth = { 2}
strokeLinecap = "round"
strokeLinejoin = "round"
    />
    </Svg>
  ),
cactus: (props: any) => (
    <Svg width= { 24} height = { 24} viewBox = "0 0 24 24" fill = "none" {...props }>
        <Path
        d="M8 10V16M16 10V16M12 6V21"
stroke = { props.color || Colors.dark.plantGreen }
strokeWidth = { 2}
strokeLinecap = "round"
strokeLinejoin = "round"
    />
    <Path
        d="M8 13C6 13 6 10 8 10M16 13C18 13 18 10 16 10"
stroke = { props.color || Colors.dark.plantGreen }
strokeWidth = { 2}
strokeLinecap = "round"
strokeLinejoin = "round"
    />
    </Svg>
  ),
mushroom: (props: any) => (
    <Svg width= { 24} height = { 24} viewBox = "0 0 24 24" fill = "none" {...props }>
        <Path
         d="M12 21V14M8 14H16M6 14C6 10 8 6 12 6C16 6 18 10 18 14"
stroke = { props.color || Colors.dark.warning }
strokeWidth = { 2}
strokeLinecap = "round"
strokeLinejoin = "round"
    />
    </Svg>
  ),
};

export const PLANT_ICONS_LIST = [
    { id: 'sprout', name: 'Sprout', component: PlantIcons.sprout, category: 'Growth' },
    { id: 'flower', name: 'Flower', component: PlantIcons.flower, category: 'Flowers' },
    { id: 'tree', name: 'Pine Tree', component: PlantIcons.tree, category: 'Trees' },
    { id: 'cactus', name: 'Cactus', component: PlantIcons.cactus, category: 'Cacti' },
    { id: 'mushroom', name: 'Mushroom', component: PlantIcons.mushroom, category: 'Fungi' },
];
