declare interface Pack {
    key: string;
    url: string;
}

declare interface PackList {
    [key: string]: { url: string; data?: string };
}

declare interface AssetPack {
    [key: string]: Array<{ [key: string]: any }>;
}
