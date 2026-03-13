import { TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent],
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(ErrorMessageComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('no debe mostrar mensaje cuando message es null', () => {
    const fixture = TestBed.createComponent(ErrorMessageComponent);
    fixture.componentRef.setInput('message', null);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('debe mostrar el mensaje cuando message tiene valor', () => {
    const fixture = TestBed.createComponent(ErrorMessageComponent);
    fixture.componentRef.setInput('message', 'Error de conexión.');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const alert = el.querySelector('[role="alert"]');
    expect(alert).toBeTruthy();
    expect(alert?.textContent).toContain('Error de conexión.');
  });
});
