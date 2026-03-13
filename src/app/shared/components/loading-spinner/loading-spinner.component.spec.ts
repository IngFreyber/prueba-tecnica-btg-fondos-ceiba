import { TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(LoadingSpinnerComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('debe renderizar spinner con rol status y aria-label Cargando', () => {
    const fixture = TestBed.createComponent(LoadingSpinnerComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const status = el.querySelector('[role="status"][aria-label="Cargando"]');
    expect(status).toBeTruthy();
  });
});
