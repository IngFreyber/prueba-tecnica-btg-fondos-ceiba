import { Injectable, signal } from '@angular/core';
import { Participation, Transaction } from '../models';
import { INITIAL_BALANCE } from '../data/funds.mock';

/**
 * Servicio de estado: saldo del usuario, participaciones y historial de transacciones (Angular 19).
 */
@Injectable({ providedIn: 'root' })
export class BalanceService {
  // Saldo actual en COP.
  private balance = signal<number>(INITIAL_BALANCE);

  // Participaciones activas (fondos en los que el usuario está suscrito).
  private participations = signal<Participation[]>([]);

  // Historial de transacciones (suscripciones y cancelaciones).
  private transactions = signal<Transaction[]>([]);

  readonly currentBalance = this.balance.asReadonly();
  readonly currentParticipations = this.participations.asReadonly();
  readonly transactionHistory = this.transactions.asReadonly();

  // Si el usuario puede suscribirse a un fondo (monto >= mínimo y saldo suficiente).
  canSubscribe(fundId: number, amount: number, minimumAmount: number): boolean {
    return amount >= minimumAmount && amount <= this.balance();
  }

  // Realiza una suscripción: deduce del saldo, agrega participación y registra transacción.
  subscribe(
    fundId: number,
    fundName: string,
    amount: number,
    notificationMethod: 'email' | 'sms'
  ): { success: boolean; error?: string } {
    const current = this.balance();
    if (amount > current) {
      return { success: false, error: 'Saldo insuficiente. No puede suscribirse con un monto mayor a su saldo disponible.' };
    }
    const participations = this.participations();
    const existing = participations.find(p => p.fundId === fundId);
    const newAmount = existing ? existing.amount + amount : amount;
    const newBalance = current - amount;

    this.balance.set(newBalance);
    this.participations.set(
      existing
        ? participations.map(p => (p.fundId === fundId ? { ...p, amount: newAmount } : p))
        : [...participations, { fundId, fundName, amount: newAmount }]
    );
    this.transactions.update(list => [
      ...list,
      {
        id: crypto.randomUUID(),
        type: 'suscripcion',
        fundId,
        fundName,
        amount,
        date: new Date(),
        notificationMethod,
        balanceAfter: newBalance,
      },
    ]);
    return { success: true };
  }

  // Cancela participación en un fondo: devuelve el monto al saldo y registra transacción.
  cancel(fundId: number): { success: boolean; error?: string } {
    const participations = this.participations();
    const part = participations.find(p => p.fundId === fundId);
    if (!part) {
      return { success: false, error: 'No tiene participación en este fondo.' };
    }
    const newBalance = this.balance() + part.amount;
    this.balance.set(newBalance);
    this.participations.set(participations.filter(p => p.fundId !== fundId));
    this.transactions.update(list => [
      ...list,
      {
        id: crypto.randomUUID(),
        type: 'cancelacion',
        fundId: part.fundId,
        fundName: part.fundName,
        amount: part.amount,
        date: new Date(),
        balanceAfter: newBalance,
      },
    ]);
    return { success: true };
  }

  // Obtiene la participación en un fondo (si existe).
  getParticipation(fundId: number): Participation | undefined {
    return this.participations().find(p => p.fundId === fundId);
  }
}
