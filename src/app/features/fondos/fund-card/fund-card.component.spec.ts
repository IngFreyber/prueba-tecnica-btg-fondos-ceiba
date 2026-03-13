import { TestBed } from '@angular/core/testing';
import { FundCardComponent } from './fund-card.component';
import { BalanceService } from '@app/core/services/balance.service';
import { Fund } from '@app/core/models';

const fundMock: Fund = {
  id: 1,
  name: 'Fondo Test',
  minimumAmount: 100_000,
  category: 'FIC',
};

describe('FundCardComponent', () => {
  let balanceService: Partial<BalanceService>;

  beforeEach(async () => {
    balanceService = {
      getParticipation: jest.fn(() => undefined),
    };
    await TestBed.configureTestingModule({
      imports: [FundCardComponent],
      providers: [{ provide: BalanceService, useValue: balanceService }],
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(FundCardComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe mostrar nombre del fondo y botón Suscribir cuando no hay participación', () => {
    (balanceService.getParticipation as jest.Mock).mockReturnValue(undefined);
    const fixture = TestBed.createComponent(FundCardComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Fondo Test');
    expect(el.textContent).toContain('Suscribir');
    expect(el.textContent).not.toContain('Cancelar suscripción');
  });

  it('debe mostrar botón Cancelar suscripción cuando hay participación', () => {
    (balanceService.getParticipation as jest.Mock).mockReturnValue({
      fundId: 1,
      fundName: 'Fondo Test',
      amount: 150_000,
    });
    const fixture = TestBed.createComponent(FundCardComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Cancelar suscripción');
  });

  it('debe emitir subscribe con el fondo al hacer clic en Suscribir', () => {
    (balanceService.getParticipation as jest.Mock).mockReturnValue(undefined);
    const fixture = TestBed.createComponent(FundCardComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.subscribe.subscribe(spy);
    const btn = (fixture.nativeElement as HTMLElement).querySelector('button');
    btn?.click();
    expect(spy).toHaveBeenCalledWith(fundMock);
  });

  it('debe emitir cancel con el fondo al hacer clic en Cancelar suscripción', () => {
    (balanceService.getParticipation as jest.Mock).mockReturnValue({
      fundId: 1,
      fundName: 'Fondo Test',
      amount: 150_000,
    });
    const fixture = TestBed.createComponent(FundCardComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.cancel.subscribe(spy);
    const btn = (fixture.nativeElement as HTMLElement).querySelector('button');
    btn?.click();
    expect(spy).toHaveBeenCalledWith(fundMock);
  });
});
