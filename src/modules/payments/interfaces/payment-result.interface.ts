// payments/interfaces/payment-result.interface.ts

export interface PaymentResult {
  paymentUrl: string;       // L'URL de Stripe ou PayPal où le client va taper sa carte
  providerReference: string; // L'ID de la session (ex: cs_test_...) pour ta base de données
}