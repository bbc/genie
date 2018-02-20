declare interface ViewportMetrics {
    width: number;
    height: number;
    scale: number;
    borderPad: number;
    buttonMin: number;
    buttonPad: number;
    hitMin?: number;
    isMobile?: boolean;
    horizontals?: {
        left: number;
        center: number;
        right: number;
    };
    safeHorizontals?: {
        left: number;
        center: number;
        right: number;
    };
    verticals: {
        top: number;
        middle: number;
        bottom: number;
        [key: string]: number;
    };
}
