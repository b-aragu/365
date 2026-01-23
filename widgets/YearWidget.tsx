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

    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    // ensure daysRemaining doesn't go below 0
    const daysRemaining = Math.max(0, Math.ceil((endOfYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const percentComplete = Math.min(100, Math.round((dayOfYear / totalDays) * 100));

    return { dayOfYear, daysRemaining, percentComplete, totalDays, currentYear };
}

// ============================================
// WIDGET 1: MINIMAL GRID (COMPACT 2x2)
// Fits 365 days into a small 2x2 space
// ============================================
async function renderMinimalGrid(props: WidgetTaskHandlerProps) {
    const Widget = await import('react-native-android-widget');
    const { FlexWidget, TextWidget } = Widget;
    const { dayOfYear, daysRemaining, percentComplete } = getYearProgress();

    // Compact calculation
    // To fit ~366 dots in a square-ish 2x2 area (~150dp x 150dp available)
    // 19 x 19 = 361 (close)
    // 18 x 21 = 378
    // Let's use 19 rows x 20 cols = 380 dots
    // Dot size: 5dp + 1.5dp gap = 6.5dp
    // 20 * 6.5 = 130dp width (fits)
    // 19 * 6.5 = 123.5dp height (fits)

    const COLS = 20;
    const ROWS = 19;
    const DOT_SIZE = 5;
    const DOT_GAP = 1.5;

    // Colors
    const COLOR_BG = '#00000000'; // TRANSPARENT
    const COLOR_PAST = '#333333';
    const COLOR_TODAY = '#4CAF50';
    const COLOR_FUTURE = '#151515';

    const rows = [];
    for (let r = 0; r < ROWS; r++) {
        const dots = [];
        for (let c = 0; c < COLS; c++) {
            const index = r * COLS + c + 1;
            // Stop generating dots after 366
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

    props.renderWidget(
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: COLOR_BG,
                borderRadius: 22,
                padding: 12,
                flexDirection: 'column',
                justifyContent: 'center', // Changed from space-between to center
                alignItems: 'center',
            }}
            clickAction="OPEN_APP"
        >
            {/* The Grid */}
            <FlexWidget style={{ flexDirection: 'column', alignItems: 'center' }}>
                {rows}
            </FlexWidget>

            {/* Footer Stats - Closer to dots */}
            <FlexWidget
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: 2 // Tighter spacing
                }}
            >
                <TextWidget
                    text={`${percentComplete}%`}
                    style={{ fontSize: 11, color: '#888888', fontWeight: 'bold' }}
                />
                <TextWidget
                    text={`${daysRemaining} left`}
                    style={{ fontSize: 11, color: '#4CAF50', fontWeight: 'bold' }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}

// ============================================
// WIDGET 2: PLANT GROWTH (FIXED VISIBILITY)
// Simplified layout to ensure rendering
// ============================================
async function renderPlantGrowth(props: WidgetTaskHandlerProps) {
    const Widget = await import('react-native-android-widget');
    const { FlexWidget, TextWidget } = Widget;
    const { daysRemaining, percentComplete } = getYearProgress();

    // Stages
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

    // Force solid background color and standard flex props
    props.renderWidget(
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
            {/* Circle container for emoji - VERY SMALL */}
            <FlexWidget
                style={{
                    width: 32, // Further reduced from 48
                    height: 32, // Further reduced from 48
                    borderRadius: 16, // Further reduced from 24
                    backgroundColor: '#151515',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 4 // Reduced margin
                }}
            >
                <TextWidget
                    text={currentStage.emoji}
                    style={{ fontSize: 16 }} // Reduced from 24
                />
            </FlexWidget>

            {/* Text details */}
            <TextWidget
                text={currentStage.label}
                style={{
                    fontSize: 14, // Slightly smaller text
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: 6
                }}
            />

            {/* Progress Bar Track */}
            <FlexWidget
                style={{
                    width: '100%',
                    height: 4, // Thinner bar
                    backgroundColor: '#222222',
                    borderRadius: 2,
                    marginBottom: 4,
                    overflow: 'hidden'
                }}
            >
                {/* Progress Bar Fill */}
                <FlexWidget
                    style={{
                        width: `${Math.max(5, percentComplete)}%`,
                        height: 4,
                        backgroundColor: currentStage.color,
                        borderRadius: 2,
                    }}
                />
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <TextWidget
                    text={`${percentComplete}%`}
                    style={{ fontSize: 10, color: '#666666' }}
                />
                <TextWidget
                    text={`${daysRemaining}d`}
                    style={{ fontSize: 10, color: '#888888' }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}

// ============================================
// WIDGET 3: WEEK STRIP (NO FAKE DATA)
// Clean version with correct dates and no confusing highlights
// ============================================
async function renderDaysStrip(props: WidgetTaskHandlerProps) {
    const Widget = await import('react-native-android-widget');
    const { FlexWidget, TextWidget } = Widget;

    const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();

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

        // CLEANUP: Removed pseudoRandom entries to avoid user confusion ("idk why highlighted")
        // Now it just shows the days. Entries will be blank/gray until we implement real sync.
        // Today is highlighted to anchor the user.
        const hasEntry = false;

        const COLOR_TODAY = '#4CAF50';
        const COLOR_BG_EMPTY = '#151515';
        const COLOR_BORDER = '#222222';
        const COLOR_TEXT_MUTED = '#666666';

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
                        color: isToday ? COLOR_TODAY : COLOR_TEXT_MUTED,
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
                            color: isToday ? '#000000' : COLOR_TEXT_MUTED,
                            fontWeight: 'bold'
                        }}
                    />
                </FlexWidget>
            </FlexWidget>
        );
    });

    props.renderWidget(
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

// ============================================
// WIDGET 4: CIRCULAR (Clean Update)
// ============================================
async function renderCircularProgress(props: WidgetTaskHandlerProps) {
    const Widget = await import('react-native-android-widget');
    const { FlexWidget, TextWidget } = Widget;
    const { daysRemaining, percentComplete } = getYearProgress();

    // 12 dots is cleaner for small sizes than 16
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

    props.renderWidget(
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
            <TextWidget text={`${daysRemaining} days left`} style={{ fontSize: 10, color: '#4CAF50', marginTop: 4 }} />
        </FlexWidget>
    );
}

// ============================================
// MAIN TASK HANDLER
// ============================================
export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
    const widgetName = props.widgetInfo.widgetName;
    try {
        switch (widgetName) {
            case 'YearWidget':
            case 'MinimalGridWidget': await renderMinimalGrid(props); break;
            case 'PlantGrowthWidget': await renderPlantGrowth(props); break;
            case 'CircularProgressWidget': await renderCircularProgress(props); break;
            case 'DaysStripWidget': await renderDaysStrip(props); break;
            default: await renderMinimalGrid(props);
        }
    } catch (e) {
        console.error('Widget Error:', e);
    }
}
