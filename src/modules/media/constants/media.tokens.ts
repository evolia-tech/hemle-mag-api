/**
 * Token d'injection pour la configuration du module Media.
 * 
 * On utilise un Symbol pour éviter les collisions de noms
 * et garantir l'unicité du token dans l'application.
 */
export const MEDIA_OPTIONS = Symbol('MEDIA_OPTIONS');