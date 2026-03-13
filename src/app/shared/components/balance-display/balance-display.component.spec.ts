import { TestBed } from '@angular/core/testing';
import { BalanceDisplayComponent } from './balance-display.component';
import { BalanceService } from '@app/core/services/balance.service';

describe('BalanceDisplayComponent', () => {
  let balanceService: jest.Mocked<Pick<BalanceService, 'currentBalance'>>;

  beforeEach(async () => {
    balanceService = {
      currentBalance: jest.fn(() => 500_000),
    };
    await TestBed.configureTestingModule({
      imports: [BalanceDisplayComponent],
      providers: [{ provide: BalanceService, useValue: balanceService }],
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(BalanceDisplayComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe mostrar el saldo disponible usando BalanceService', () => {
    const fixture = TestBed.createComponent(BalanceDisplayComponent);
    fixture.detectChanges();
    expect(balanceService.currentBalance).toHaveBeenCalled();
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Saldo disponible');
  });

  it('debe mostrar el saldo formateado cuando currentBalance retorna un valor', () => {
    (balanceService.currentBalance as jest.Mock).mockReturnValue(300_000);
    const fixture = TestBed.createComponent(BalanceDisplayComponent);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent;
    expect(text).toMatch(/\$?\s?300\.?000/);
  });
});
