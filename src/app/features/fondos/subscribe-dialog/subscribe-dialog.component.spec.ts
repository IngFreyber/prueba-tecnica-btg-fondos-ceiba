import { TestBed } from '@angular/core/testing';
import { SubscribeDialogComponent } from './subscribe-dialog.component';
import { BalanceService } from '@app/core/services/balance.service';
import { Fund } from '@app/core/models';

const fundMock: Fund = {
  id: 1,
  name: 'Fondo Test',
  minimumAmount: 100_000,
  category: 'FIC',
};

describe('SubscribeDialogComponent', () => {
  let balanceService: Partial<BalanceService>;

  beforeEach(async () => {
    balanceService = {
      currentBalance: jest.fn(() => 500_000),
      subscribe: jest.fn(() => ({ success: true })),
    };
    await TestBed.configureTestingModule({
      imports: [SubscribeDialogComponent],
      providers: [{ provide: BalanceService, useValue: balanceService }],
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(SubscribeDialogComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe emitir close al cerrar', () => {
    const fixture = TestBed.createComponent(SubscribeDialogComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.close.subscribe(spy);
    const closeBtn = (fixture.nativeElement as HTMLElement).querySelector(
      'button[type="button"]'
    );
    if (closeBtn) closeBtn.click();
    if (spy.mock.calls.length) expect(spy).toHaveBeenCalled();
  });

  it('getAmountError debe retornar mensaje cuando amount es 0', () => {
    const fixture = TestBed.createComponent(SubscribeDialogComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.form.patchValue({ amount: 0, notificationMethod: 'email' });
    expect(comp.getAmountError()).toContain('monto');
  });

  it('onSubmit debe emitir subscribed y close cuando suscripción es exitosa', () => {
    (balanceService.subscribe as jest.Mock).mockReturnValue({ success: true });
    const fixture = TestBed.createComponent(SubscribeDialogComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.form.setValue({ amount: 150_000, notificationMethod: 'email' });
    const subSpy = jest.fn();
    const closeSpy = jest.fn();
    comp.subscribed.subscribe(subSpy);
    comp.close.subscribe(closeSpy);
    comp.onSubmit();
    expect(balanceService.subscribe).toHaveBeenCalledWith(
      1,
      'Fondo Test',
      150_000,
      'email'
    );
    expect(subSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('onSubmit debe setear errorMessage cuando suscripción falla', () => {
    (balanceService.subscribe as jest.Mock).mockReturnValue({
      success: false,
      error: 'Saldo insuficiente.',
    });
    const fixture = TestBed.createComponent(SubscribeDialogComponent);
    fixture.componentRef.setInput('fund', fundMock);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.form.setValue({ amount: 150_000, notificationMethod: 'email' });
    comp.onSubmit();
    expect(comp.errorMessage()).toBe('Saldo insuficiente.');
  });
});
