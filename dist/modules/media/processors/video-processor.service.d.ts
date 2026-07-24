export declare class VideoProcessorService {
    process(buffer: Buffer, config?: {
        maxWidth?: number;
        crf?: number;
    }): Promise<{
        buffer: NonSharedBuffer;
        mimeType: string;
        format: string;
    }>;
}
