import { Component, inject } from '@angular/core';
import { BalanceService } from '../../../core/services/balance.service';
import { CopCurrencyPipe } from '../../pipes/cop-currency.pipe';

/**
 * Componente reutilizable que muestra el saldo actual del usuario.
 */
@Component({
  selector: 'app-balance-display',
  standalone: true,
  imports: [CopCurrencyPipe],
  templateUrl: './balance-display.component.html',
})
export class BalanceDisplayComponent {
  readonly balanceService = inject(BalanceService);
}
