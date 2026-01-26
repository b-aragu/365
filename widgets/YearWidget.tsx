import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

// ============================================
// TYPES & UTILS
// ============================================

interface YearProgress {
    dayOfYear: number;
    daysRemaining: number;
    percentComplete: number;
    totalDays: number;
    currentYear: number;
}

function getYearProgress(): YearProgress {
    const now = new Date();
    const currentYear = now.getFullYear();
    const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
    const totalDays = isLeapYear ? 366 : 365;

    // Use UTC to avoid DST issues when calculating difference in days
    const utc1 = Date.UTC(currentYear, 0, 1);
    const utc2 = Date.UTC(currentYear, now.getMonth(), now.getDate());

    const dayOfYear = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1;

    // ensure daysRemaining doesn't go below 0
    const daysRemaining = Math.max(0, totalDays - dayOfYear);
    const percentComplete = Math.min(100, Math.round((dayOfYear / totalDays) * 100));

    return { dayOfYear, daysRemaining, percentComplete, totalDays, currentYear };
}

// ============================================
// WIDGET BUILDERS (Return JSX)
// ============================================

async function getMinimalGridWidget() {
    const Widget = await import('react-native-android-widget');
    const { FlexWidget, TextWidget } = Widget;
    const { dayOfYear, daysRemaining, percentComplete } = getYearProgress();

    const COLS = 20;
    const ROWS = 19;
    const DOT_SIZE = 5;
    const DOT_GAP = 1.5;

    const COLOR_BG = '#00000000'; // TRANSPARENT
    const COLOR_PAST = '#333333';
    const COLOR_TODAY = '#4CAF50';
    const COLOR_FUTURE = '#151515';

    const rows = [];
    for (let r = 0; r < ROWS; r++) {
        const dots = [];
        for (let c = 0; c < COLS; c++) {
            const index = r * COLS + c + 1;
            if (index > 366) break;

            const isPast = index < dayOfYear;
            const isToday = index === dayOfYear;

            let bgColor = COLOR_FUTURE;
            if (isPast) bgColor = COLOR_PAST;
            if (isToday) bgColor = COLOR_TODAY;

            dots.push(
                <FlexWidget
                    key={`d-${r}-${c}`}
                    style={{
                        width: DOT_SIZE,
                        height: DOT_SIZE,
                        borderRadius: DOT_SIZE / 2,
                        backgroundColor: bgColor,
                        marginRight: c < COLS - 1 ? DOT_GAP : 0,
                    }}
                />
            );
        }
        rows.push(
            <FlexWidget
                key={`r-${r}`}
                style={{
                    flexDirection: 'row',
                    marginBottom: r < ROWS - 1 ? DOT_GAP : 0
                }}
            >
                {dots}
            </FlexWidget>
        );
    }

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: COLOR_BG,
                borderRadius: 22,
                padding: 12,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            clickAction="OPEN_APP"
        >
            <FlexWidget style={{ flexDirection: 'column', alignItems: 'center' }}>
                {rows}
            </FlexWidget>

            <FlexWidget
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: 129,
                    marginTop: 2
                }}
            >
                <TextWidget
                    text={`${percentComplete}%`}
                    style={{ fontSize: 11, color: '#ffffff', fontWeight: 'bold' }}
                />
                <TextWidget
                    text={`${daysRemaining} left`}
                    style={{ fontSize: 11, color: '#ffffff', fontWeight: 'bold' }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}

async function getPlantGrowthWidget() {
    const Widget = await import('react-native-android-widget');
    const { FlexWidget, TextWidget } = Widget;
    const { daysRemaining, percentComplete } = getYearProgress();

    const stages = [
        { min: 0, emoji: '🌰', label: 'Seed', color: '#BCAAA4' },
        { min: 10, emoji: '🌱', label: 'Sprouts', color: '#A5D6A7' },
        { min: 25, emoji: '🪴', label: 'Growing', color: '#81C784' },
        { min: 50, emoji: '🌿', label: 'Thriving', color: '#66BB6A' },
        { min: 75, emoji: '🌳', label: 'Mature', color: '#4CAF50' },
        { min: 95, emoji: '🎄', label: 'Complete', color: '#2E7D32' },
    ];

    let currentStage = stages[0];
    for (const stage of stages) {
        if (percentComplete >= stage.min) currentStage = stage;
    }

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#00000000',
                borderRadius: 22,
                padding: 16,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            clickAction="OPEN_APP"
        >
            <FlexWidget
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#151515',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 4
                }}
            >
                <TextWidget
                    text={currentStage.emoji}
                    style={{ fontSize: 16 }}
                />
            </FlexWidget>

            <TextWidget
                text={currentStage.label}
                style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: 6
                }}
            />

            {/* Progress Bar with Correct Flex Weights */}
            <FlexWidget
                style={{
                    width: 'match_parent',
                    height: 4,
                    backgroundColor: '#222222',
                    borderRadius: 2,
                    marginBottom: 4,
                    overflow: 'hidden',
                    flexDirection: 'row'
                }}
            >
                <FlexWidget
                    style={{
                        width: 0,
                        flex: Math.max(1, percentComplete),
                        height: 4,
                        backgroundColor: currentStage.color,
                        borderRadius: 2,
                    }}
                />
                <FlexWidget
                    style={{
                        width: 0,
                        flex: Math.max(1, 100 - percentComplete),
                        height: 4,
                        backgroundColor: '#00000000',
                    }}
                />
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', width: 'match_parent' }}>
                <TextWidget
                    text={`${percentComplete}%`}
                    style={{ fontSize: 10, color: '#ffffff' }}
                />
                <TextWidget
                    text={`${daysRemaining}d`}
                    style={{ fontSize: 10, color: '#ffffff' }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}

async function getDaysStripWidget() {
    const Widget = await import('react-native-android-widget');
    const { FlexWidget, TextWidget } = Widget;

    const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date(); // Widget runs in background, new Date() is correct

    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(d);
    }

    const dayViews = days.map((date, index) => {
        const dayLabel = DAY_LABELS[date.getDay()];
        const dayNum = date.getDate();
        const isToday = index === 6;

        const COLOR_TODAY = '#4CAF50';
        const COLOR_BG_EMPTY = '#151515';
        const COLOR_BORDER = '#222222';

        return (
            <FlexWidget
                key={`day-${index}`}
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1
                }}
            >
                <TextWidget
                    text={dayLabel}
                    style={{
                        fontSize: 10,
                        color: isToday ? COLOR_TODAY : '#ffffff',
                        fontWeight: isToday ? 'bold' : 'normal',
                        marginBottom: 4
                    }}
                />

                <FlexWidget
                    style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: isToday ? COLOR_TODAY : COLOR_BG_EMPTY,
                        borderWidth: isToday ? 0 : 1,
                        borderColor: COLOR_BORDER,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <TextWidget
                        text={`${dayNum}`}
                        style={{
                            fontSize: 10,
                            color: isToday ? '#000000' : '#ffffff',
                            fontWeight: 'bold'
                        }}
                    />
                </FlexWidget>
            </FlexWidget>
        );
    });

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#00000000',
                borderRadius: 22,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
            clickAction="OPEN_APP"
        >
            {dayViews}
        </FlexWidget>
    );
}

async function getCircularProgressWidget() {
    const Widget = await import('react-native-android-widget');
    const { FlexWidget, TextWidget } = Widget;
    const { daysRemaining, percentComplete } = getYearProgress();

    const TOTAL_DOTS = 12;
    const FILLED_DOTS = Math.round((percentComplete / 100) * TOTAL_DOTS);

    const dots = [];
    for (let i = 0; i < TOTAL_DOTS; i++) {
        const active = i < FILLED_DOTS;
        dots.push(
            <FlexWidget
                key={i}
                style={{
                    width: 6, height: 6, borderRadius: 3,
                    backgroundColor: active ? '#4CAF50' : '#222222',
                    marginHorizontal: 2
                }}
            />
        )
    }

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#00000000',
                borderRadius: 22,
                padding: 16,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            clickAction="OPEN_APP"
        >
            <FlexWidget style={{ flexDirection: 'row', marginBottom: 12 }}>{dots}</FlexWidget>
            <TextWidget text={`${percentComplete}%`} style={{ fontSize: 32, fontWeight: 'bold', color: '#fff' }} />
            <TextWidget text={`${daysRemaining} days left`} style={{ fontSize: 10, color: '#ffffff', marginTop: 4 }} />
        </FlexWidget>
    );
}

// ============================================
// MAIN HANDLER & EXPORTS
// ============================================

export async function getWidget(widgetName: string) {
    switch (widgetName) {
        case 'YearWidget':
        case 'MinimalGridWidget': return await getMinimalGridWidget();
        case 'PlantGrowthWidget': return await getPlantGrowthWidget();
        case 'CircularProgressWidget': return await getCircularProgressWidget();
        case 'DaysStripWidget': return await getDaysStripWidget();
        default: return await getMinimalGridWidget();
    }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
    const widgetName = props.widgetInfo.widgetName;
    try {
        const widget = await getWidget(widgetName);
        props.renderWidget(widget);
    } catch (e) {
        console.error('Widget Error:', e);
    }
}
