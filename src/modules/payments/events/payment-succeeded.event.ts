
/**
 * Payload de l'événement payment.succeeded.
 * Contient les informations nécessaires pour envoyer l'email de confirmation
 * et générer les liens de téléchargement.
 */
export interface PaymentSucceededPayload {
  orderId: string;
  customerEmail: string;
  firstName: string;
  lastName: string;
  phone?: string;
  //items: OrderItem[];
}

export class PaymentSucceededEvent {
  constructor(public readonly payload: PaymentSucceededPayload) { }
}