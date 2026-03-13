import { Component, inject, input, output } from '@angular/core';
import { Fund } from '../../../core/models';
import { Participation } from '../../../core/models';
import { BalanceService } from '../../../core/services/balance.service';
import { CopCurrencyPipe } from '../../../shared/pipes/cop-currency.pipe';

/**
 * Tarjeta reutilizable de un fondo: datos y acciones Suscribir / Cancelar.
 */
@Component({
  selector: 'app-fund-card',
  standalone: true,
  imports: [CopCurrencyPipe],
  templateUrl: './fund-card.component.html',
})
export class FundCardComponent {
  private balanceService = inject(BalanceService);

  fund = input.required<Fund>();
  subscribe = output<Fund>();
  cancel = output<Fund>();

  participation(): Participation | undefined {
    return this.balanceService.getParticipation(this.fund().id);
  }
}
