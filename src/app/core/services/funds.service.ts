import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Fund } from '../models';
import { FUNDS_MOCK } from '../data/funds.mock';

/**
 * Servicio que simula API REST de fondos (mock local).
 * Cumple requisito: "Consumo de datos desde una API REST simulada".
 */
@Injectable({ providedIn: 'root' })
export class FundsService {
  // Obtiene la lista de fondos disponibles (simula GET /funds).
  getFunds(): Observable<Fund[]> {
    return of([...FUNDS_MOCK]).pipe(delay(400));
  }
}
