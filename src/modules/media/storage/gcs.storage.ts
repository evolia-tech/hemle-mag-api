import { Storage } from '@google-cloud/storage';
import { StorageProvider } from './storage.interface';

/**
 * Implémentation Google Cloud Storage.
 * 
 * Nécessite les variables d'environnement :
 * - GCP_PROJECT_ID
 * - GCP_BUCKET_NAME
 * - GCP_KEY_FILE (chemin vers le JSON service account)
 */

export class GcsStorageProvider implements StorageProvider {

  private storage: Storage;
  private publicBucket: string;
  private privateBucket: string;

  constructor(config: {
    projectId: string;
    publicBucket: string;
    privateBucket: string;
    keyFile?: string;
  }) {
    this.storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFile,
    });

    this.publicBucket = config.publicBucket;
    this.privateBucket = config.privateBucket;
  }

  async upload(
    fileBuffer: Buffer,
    destination: string,
    mimeType: string,
    isPrivate = false,
  ): Promise<{ publicUrl?: string }> {

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

  async generateSignedUrl(
    destination: string,
    expiresInSeconds = 900,
  ): Promise<string> {

    const bucket = this.storage.bucket(this.privateBucket);
    const file = bucket.file(destination);

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInSeconds * 1000,
    });

    return url;
  }

  async delete(destination: string, isPrivate = false): Promise<void> {

    const bucketName = isPrivate
      ? this.privateBucket
      : this.publicBucket;

    await this.storage.bucket(bucketName).file(destination).delete();
  }
}