import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { FondosListComponent } from './fondos-list.component';
import { BalanceService } from '@app/core/services/balance.service';
import { FundsService } from '@app/core/services/funds.service';
import { Fund } from '@app/core/models';

const fundsMock: Fund[] = [
  { id: 1, name: 'Fondo A', minimumAmount: 75_000, category: 'FPV' },
];

describe('FondosListComponent', () => {
  let fundsService: { getFunds: jest.Mock };
  let balanceService: Partial<BalanceService>;
  let snackBar: { open: jest.Mock };

  beforeEach(async () => {
    fundsService = { getFunds: jest.fn(() => of(fundsMock)) };
    balanceService = {
      currentBalance: jest.fn(() => 500_000),
      getParticipation: jest.fn(() => undefined),
      cancel: jest.fn(() => ({ success: true })),
    };
    snackBar = { open: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [FondosListComponent],
      providers: [
        provideRouter([]),
        { provide: FundsService, useValue: fundsService },
        { provide: BalanceService, useValue: balanceService },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(FondosListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe cargar fondos en ngOnInit', fakeAsync(() => {
    const fixture = TestBed.createComponent(FondosListComponent);
    fixture.detectChanges();
    expect(fundsService.getFunds).toHaveBeenCalled();
    tick();
    expect(fixture.componentInstance.funds()).toEqual(fundsMock);
    expect(fixture.componentInstance.loading()).toBe(false);
  }));

  it('debe setear error cuando getFunds falla', fakeAsync(() => {
    fundsService.getFunds.mockReturnValue(throwError(() => new Error('Network')));
    const fixture = TestBed.createComponent(FondosListComponent);
    fixture.detectChanges();
    tick();
    expect(fixture.componentInstance.error()).toBe(
      'No se pudo cargar la lista de fondos.'
    );
    expect(fixture.componentInstance.loading()).toBe(false);
  }));

  it('openSubscribe debe abrir diálogo y setear selectedFund', () => {
    const fixture = TestBed.createComponent(FondosListComponent);
    fixture.detectChanges();
    fixture.componentInstance.openSubscribe(fundsMock[0]);
    expect(fixture.componentInstance.showSubscribeDialog()).toBe(true);
    expect(fixture.componentInstance.selectedFund()).toEqual(fundsMock[0]);
  });

  it('onSubscribed debe cerrar diálogo y mostrar snackbar de éxito', () => {
    const fixture = TestBed.createComponent(FondosListComponent);
    fixture.componentInstance.showSubscribeDialog.set(true);
    fixture.componentInstance.selectedFund.set(fundsMock[0]);
    fixture.componentInstance.onSubscribed();
    expect(fixture.componentInstance.showSubscribeDialog()).toBe(false);
    expect(fixture.componentInstance.selectedFund()).toBeNull();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Suscripción realizada correctamente.',
      'Cerrar',
      expect.objectContaining({ panelClass: ['toast-success'] })
    );
  });

  it('doCancel debe mostrar snackbar cuando cancelación es exitosa', () => {
    (balanceService.cancel as jest.Mock).mockReturnValue({ success: true });
    const fixture = TestBed.createComponent(FondosListComponent);
    fixture.componentInstance.fundToCancel.set(fundsMock[0]);
    fixture.componentInstance.doCancel();
    expect(snackBar.open).toHaveBeenCalledWith(
      expect.stringContaining('cancelada'),
      'Cerrar',
      expect.objectContaining({ panelClass: ['toast-cancel'] })
    );
  });

  it('doCancel debe setear error cuando cancelación falla', () => {
    (balanceService.cancel as jest.Mock).mockReturnValue({
      success: false,
      error: 'No tiene participación.',
    });
    const fixture = TestBed.createComponent(FondosListComponent);
    fixture.componentInstance.fundToCancel.set(fundsMock[0]);
    fixture.componentInstance.doCancel();
    expect(fixture.componentInstance.error()).toBe('No tiene participación.');
  });
});
