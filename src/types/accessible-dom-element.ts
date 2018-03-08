declare interface AccessibleDomElement {
    el: HTMLDivElement;
    hide: () => void;
    show: () => void;
    visible: () => boolean;
    remove: () => void;
    position: (positionOptions: { x: number; y: number; width: number; height: number }) => void;
}
