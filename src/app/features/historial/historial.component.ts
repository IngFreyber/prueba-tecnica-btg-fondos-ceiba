import { DatePipe } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BalanceService } from '../../core/services/balance.service';
import { BalanceDisplayComponent } from '../../shared/components/balance-display/balance-display.component';
import { CopCurrencyPipe } from '../../shared/pipes/cop-currency.pipe';

/**
 * Historial de transacciones: suscripciones y cancelaciones (Requisito 4).
 */
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [DatePipe, RouterLink, BalanceDisplayComponent, CopCurrencyPipe],
  templateUrl: './historial.component.html',
})
export class HistorialComponent {
  private balanceService = inject(BalanceService);

  /** Historial ordenado por fecha descendente (más reciente primero). */
  transactions = computed(() => {
    const list = this.balanceService.transactionHistory();
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
}
