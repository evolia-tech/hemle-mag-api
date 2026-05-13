/**
 * Interface abstraite pour le stockage cloud.
 * 
 * Cette interface permet de changer de provider (GCP, AWS, Local)
 * sans modifier le service Media.
 * 
 * Implémentations possibles :
 * - GcsStorageProvider (Google Cloud)
 * - S3StorageProvider (AWS)
 * - LocalStorageProvider (développement local)
 */
export interface StorageProvider {
  /**
   * Upload un fichier vers le stockage
   * @returns L'URL publique du fichier (si applicable)
   */
  upload(
    fileBuffer: Buffer,
    destination: string,
    mimeType: string,
    isPrivate: boolean
  ): Promise<{ publicUrl?: string }>;

  /**
   * Supprime un fichier du stockage
   */
  delete(destination: string): Promise<void>;

  /**
   * Génère une URL signée temporaire pour l'accès privé
   */
  generateSignedUrl(
    destination: string,
    expiresInSeconds?: number,
  ): Promise<string>;
}