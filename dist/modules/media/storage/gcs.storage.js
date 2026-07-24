"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GcsStorageProvider = void 0;
const storage_1 = require("@google-cloud/storage");
class GcsStorageProvider {
    storage;
    publicBucket;
    privateBucket;
    constructor(config) {
        this.storage = new storage_1.Storage({
            projectId: config.projectId,
            keyFilename: config.keyFile,
        });
        this.publicBucket = config.publicBucket;
        this.privateBucket = config.privateBucket;
    }
    async upload(fileBuffer, destination, mimeType, isPrivate = false) {
        const bucketName = isPrivate
            ? this.privateBucket
            : this.publicBucket;
        const bucket = this.storage.bucket(bucketName);
        const file = bucket.file(destination);
        await file.save(fileBuffer, {
            metadata: { contentType: mimeType },
            resumable: false,
        });
        if (!isPrivate) {
            return {
                publicUrl: `https://storage.googleapis.com/${bucketName}/${destination}`,
            };
        }
        return {};
    }
    async generateSignedUrl(destination, expiresInSeconds = 900) {
        const bucket = this.storage.bucket(this.privateBucket);
        const file = bucket.file(destination);
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + expiresInSeconds * 1000,
        });
        return url;
    }
    async delete(destination, isPrivate = false) {
        const bucketName = isPrivate
            ? this.privateBucket
            : this.publicBucket;
        await this.storage.bucket(bucketName).file(destination).delete();
    }
}
exports.GcsStorageProvider = GcsStorageProvider;
//# sourceMappingURL=gcs.storage.js.map