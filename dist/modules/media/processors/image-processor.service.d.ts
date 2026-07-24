export declare class ImageProcessorService {
    process(buffer: Buffer, config?: {
        maxWidth?: number;
        maxHeight?: number;
        quality?: number;
    }): Promise<{
        buffer: Buffer<ArrayBufferLike>;
        mimeType: string;
        format: string;
    }>;
}
