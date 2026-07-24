import { StorageProvider } from './storage.interface';
export declare class GcsStorageProvider implements StorageProvider {
    private storage;
    private publicBucket;
    private privateBucket;
    constructor(config: {
        projectId: string;
        publicBucket: string;
        privateBucket: string;
        keyFile?: string;
    });
    upload(fileBuffer: Buffer, destination: string, mimeType: string, isPrivate?: boolean): Promise<{
        publicUrl?: string;
    }>;
    generateSignedUrl(destination: string, expiresInSeconds?: number): Promise<string>;
    delete(destination: string, isPrivate?: boolean): Promise<void>;
}
