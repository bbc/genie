declare interface ViewportMetrics {
    width: number;
    height: number;
    scale: number;
    pad?: number;
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
    verticals?: {
        top: number;
        middle: number;
        bottom: number;
    };
}
