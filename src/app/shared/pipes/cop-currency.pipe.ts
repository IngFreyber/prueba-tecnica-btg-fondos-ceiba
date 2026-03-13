import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea un número como moneda COP (pesos colombianos).
 */
@Pipe({ name: 'copCurrency', standalone: true })
export class CopCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || typeof value !== 'number' || isNaN(value)) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}
