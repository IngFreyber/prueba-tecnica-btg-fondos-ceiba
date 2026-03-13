import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fund } from '../../../core/models';
import { BalanceService } from '../../../core/services/balance.service';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { CopCurrencyPipe } from '../../../shared/pipes/cop-currency.pipe';

// Diálogo de suscripción: monto y método de notificación (email o SMS).
@Component({
  selector: 'app-subscribe-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CopCurrencyPipe,
    CurrencyInputDirective,
    ErrorMessageComponent,
  ],
  templateUrl: './subscribe-dialog.component.html',
})
export class SubscribeDialogComponent {
  private fb = inject(FormBuilder);
  private balanceService = inject(BalanceService);

  fund = input<Fund | null>(null);
  close = output<void>();
  subscribed = output<void>();

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(1)]],
    notificationMethod: ['email' as 'email' | 'sms', Validators.required],
  });

  //Metodo para las validaciones del formulario
  getAmountError(): string {
    const c = this.form.get('amount');
    if (c?.hasError('required') || c?.value === 0) return 'Ingrese un monto.';
    if (c?.hasError('min')) return 'El monto debe ser mayor a 0.';
    const min = this.fund()?.minimumAmount ?? 0;
    if (c && c.value < min) return `El monto mínimo es ${min.toLocaleString('es-CO')} COP.`;
    if (c && c.value > this.balanceService.currentBalance()) return 'Saldo insuficiente.';
    return 'Monto inválido.';
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    const fund = this.fund();
    if (!fund) return;
    const amount = this.form.getRawValue().amount;
    const notificationMethod = this.form.getRawValue().notificationMethod as 'email' | 'sms';
    if (amount < fund.minimumAmount) {
      this.errorMessage.set(`El monto mínimo para este fondo es ${fund.minimumAmount.toLocaleString('es-CO')} COP.`);
      return;
    }
    this.loading.set(true);
    const result = this.balanceService.subscribe(fund.id, fund.name, amount, notificationMethod);
    this.loading.set(false);
    if (result.success) {
      this.subscribed.emit();
      this.close.emit();
    } else {
      this.errorMessage.set(result.error ?? 'Error al suscribir.');
    }
  }
}
