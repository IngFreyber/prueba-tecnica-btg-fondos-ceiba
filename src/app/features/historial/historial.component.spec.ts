import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { HistorialComponent } from './historial.component';
import { BalanceService } from '@app/core/services/balance.service';
import { Transaction } from '@app/core/models';

const transactionsMock: Transaction[] = [
  {
    id: '1',
    type: 'suscripcion',
    fundId: 1,
    fundName: 'Fondo A',
    amount: 100_000,
    date: new Date('2025-03-10'),
    notificationMethod: 'email',
    balanceAfter: 400_000,
  },
  {
    id: '2',
    type: 'cancelacion',
    fundId: 1,
    fundName: 'Fondo A',
    amount: 100_000,
    date: new Date('2025-03-12'),
    balanceAfter: 500_000,
  },
];

describe('HistorialComponent', () => {
  let balanceService: { transactionHistory: ReturnType<typeof signal> };

  beforeEach(async () => {
    balanceService = {
      currentBalance: jest.fn(() => 500_000),
      transactionHistory: signal([...transactionsMock]),
    };
    await TestBed.configureTestingModule({
      imports: [HistorialComponent],
      providers: [
        provideRouter([]),
        { provide: BalanceService, useValue: balanceService },
      ],
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(HistorialComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe mostrar transacciones ordenadas por fecha descendente', () => {
    const fixture = TestBed.createComponent(HistorialComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    const list = comp.transactions();
    expect(list.length).toBe(2);
    expect(new Date(list[0].date).getTime()).toBeGreaterThanOrEqual(
      new Date(list[1].date).getTime()
    );
    expect(list[0].type).toBe('cancelacion');
    expect(list[1].type).toBe('suscripcion');
  });

  it('debe mostrar enlace o título de historial', () => {
    const fixture = TestBed.createComponent(HistorialComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toMatch(/historial|transaccion|suscripcion|cancelacion/i);
  });
});
