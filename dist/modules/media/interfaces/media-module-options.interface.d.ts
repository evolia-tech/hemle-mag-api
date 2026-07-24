import { StorageProvider } from '../storage/storage.interface';
export interface MediaModuleOptions {
    storageProvider: StorageProvider;
    image?: {
        maxWidth?: number;
        maxHeight?: number;
        quality?: number;
    };
    video?: {
        maxWidth?: number;
        crf?: number;
    };
}
