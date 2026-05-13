import { StorageProvider } from '../storage/storage.interface';

/**
 * Options de configuration du MediaModule.
 * 
 * Cette interface définit tous les paramètres nécessaires
 * pour configurer le comportement du module.
 */
export interface MediaModuleOptions {
  /**
   * Provider de stockage (obligatoire)
   * Exemple : new GcsStorageProvider({...})
   */
  storageProvider: StorageProvider;

  /**
   * Configuration de traitement des images
   */
  image?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 1-100
  };

  /**
   * Configuration de traitement des vidéos
   */
  video?: {
    maxWidth?: number;
    crf?: number; // 18-28, plus bas = meilleure qualité
  };
}