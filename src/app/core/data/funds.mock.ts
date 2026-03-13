import { Fund } from '../models';

/**
 * Fondos disponibles según documento Prueba_Tecnica_Frontend_BTG.
 * Usuario único con saldo inicial COP $500.000.
 */
export const FUNDS_MOCK: Fund[] = [
  { id: 1, name: 'FPV_BTG_PACTUAL_RECAUDADORA', minimumAmount: 75000, category: 'FPV' },
  { id: 2, name: 'FPV_BTG_PACTUAL_ECOPETROL', minimumAmount: 125000, category: 'FPV' },
  { id: 3, name: 'DEUDAPRIVADA', minimumAmount: 50000, category: 'FIC' },
  { id: 4, name: 'FDO-ACCIONES', minimumAmount: 250000, category: 'FIC' },
  { id: 5, name: 'FPV_BTG_PACTUAL_DINAMICA', minimumAmount: 100000, category: 'FPV' },
];

/** Saldo inicial del usuario en COP (documento: COP $500.000). */
export const INITIAL_BALANCE = 500_000;
