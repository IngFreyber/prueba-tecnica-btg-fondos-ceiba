/**
 * Modelo de Fondo (FPV/FIC) según documento de prueba técnica BTG.
 */
export interface Fund {
  id: number;
  name: string;
  minimumAmount: number;
  category: 'FPV' | 'FIC';
}
