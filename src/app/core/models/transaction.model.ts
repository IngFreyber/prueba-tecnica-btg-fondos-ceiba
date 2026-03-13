/**
 * Tipos de transacción: suscripción o cancelación.
 */
export type TransactionType = 'suscripcion' | 'cancelacion';

/**
 * Modelo de transacción para el historial.
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  fundId: number;
  fundName: string;
  amount: number;
  date: Date;
  notificationMethod?: 'email' | 'sms';
  balanceAfter?: number;
}
