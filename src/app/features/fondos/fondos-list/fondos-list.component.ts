import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fund } from '../../../core/models';
import { BalanceService } from '../../../core/services/balance.service';
import { FundsService } from '../../../core/services/funds.service';
import { BalanceDisplayComponent } from '../../../shared/components/balance-display/balance-display.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { FundCardComponent } from '../fund-card/fund-card.component';
import { SubscribeDialogComponent } from '../subscribe-dialog/subscribe-dialog.component';

// Vista principal: lista de fondos disponibles (Requisito 1).
@Component({
  selector: 'app-fondos-list',
  standalone: true,
  templateUrl: './fondos-list.component.html',
  imports: [
    RouterLink,
    BalanceDisplayComponent,
    LoadingSpinnerComponent,
    FundCardComponent,
    SubscribeDialogComponent,
  ],
})
export class FondosListComponent implements OnInit {
  private fundsService = inject(FundsService);
  private balanceService = inject(BalanceService);
  private snackBar = inject(MatSnackBar);

  funds = signal<Fund[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  showSubscribeDialog = signal(false);
  selectedFund = signal<Fund | null>(null);
  showCancelConfirm = signal(false);
  fundToCancel = signal<Fund | null>(null);

  ngOnInit(): void {
    this.fundsService.getFunds().subscribe({
      next: (list) => {
        this.funds.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudo cargar la lista de fondos.');
        this.loading.set(false);
      },
    });
  }

  openSubscribe(fund: Fund): void {
    this.selectedFund.set(fund);
    this.showSubscribeDialog.set(true);
  }

  closeSubscribe(): void {
    this.showSubscribeDialog.set(false);
    this.selectedFund.set(null);
  }

  onSubscribed(): void {
    this.closeSubscribe();
    this.snackBar.open('Suscripción realizada correctamente.', 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['toast-success'],
    });
  }

  confirmCancel(fund: Fund): void {
    this.fundToCancel.set(fund);
    this.showCancelConfirm.set(true);
  }

  closeCancelConfirm(): void {
    this.showCancelConfirm.set(false);
    this.fundToCancel.set(null);
  }

  doCancel(): void {
    const fund = this.fundToCancel();
    if (!fund) return;
    const result = this.balanceService.cancel(fund.id);
    this.closeCancelConfirm();
    if (result.success) {
      this.snackBar.open('Suscripción cancelada. Su saldo ha sido actualizado.', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['toast-cancel'],
      });
    } else if (result.error) {
      this.error.set(result.error);
    }
  }
}
