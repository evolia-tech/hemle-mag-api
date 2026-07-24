// src/modules/payments/interfaces/create-payment.input.ts

export interface CreatePaymentInput {
  currency: string; // Ex: 'eur' ou 'usd'

  // Le panier d'achat nettoyé et enrichi avec les données de ta BDD
  lineItems: Array<{
    title: string;          // Le titre du magazine extrait de ta BDD
    amount: number;         // Le prix réel extrait de ta BDD (Ex: 9.99)
    quantity: number;       // La quantité demandée par le frontend
    coverImage: string | null; // L'URL publique de la couverture (GCP)
  }>;

  // Les données techniques que Stripe doit conserver et nous renvoyer dans le Webhook
  metadata: {
    magazineIds: string;    // Le tableau des IDs de magazines converti en chaîne JSON (ex: '["uuid1", "uuid2"]')
    userId: string;         // Vaudra 'GUEST' dans ton cas
  };
}