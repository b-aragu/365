import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

// Widget task handler function
export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
    const widgetInfo = props.widgetInfo;
    const Widget = await import('react-native-android-widget');
    const { FlexWidget, TextWidget } = Widget;

    if (widgetInfo.widgetName === 'YearWidget') {
        // Calculate days remaining
        const now = new Date();
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        const daysRemaining = Math.ceil((endOfYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));

        // Create dot rows
        const rows = [];
        for (let row = 0; row < 8; row++) {
            const dots = [];
            for (let col = 0; col < 10; col++) {
                const dotIndex = row * 10 + col;
                const isPast = dotIndex < dayOfYear;
                const isToday = dotIndex === dayOfYear;
                dots.push(
                    <FlexWidget
                        key={col}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: isToday
                                ? '#4CAF50'
                                : isPast
                                    ? '#666666'
                                    : '#333333',
                            marginRight: 4,
                        }}
                    />
                );
            }
            rows.push(
                <FlexWidget
                    key={row}
                    style={{
                        flexDirection: 'row',
                        marginBottom: 4,
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
                    backgroundColor: '#1a1a1a',
                    borderRadius: 20,
                    padding: 16,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
                clickAction="OPEN_APP"
            >
                <FlexWidget style={{ flexDirection: 'column' }}>
                    {rows}
                </FlexWidget>

                <TextWidget
                    text={`${daysRemaining} days left`}
                    style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: '#ffffff',
                    }}
                />
            </FlexWidget>
        );
    }
}
