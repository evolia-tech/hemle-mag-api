export interface StorageProvider {
    upload(fileBuffer: Buffer, destination: string, mimeType: string, isPrivate: boolean): Promise<{
        publicUrl?: string;
    }>;
    delete(destination: string): Promise<void>;
    generateSignedUrl(destination: string, expiresInSeconds?: number): Promise<string>;
}
