import { CopCurrencyPipe } from './cop-currency.pipe';

describe('CopCurrencyPipe', () => {
  const pipe = new CopCurrencyPipe();

  it('debe crear el pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe formatear número como COP', () => {
    expect(pipe.transform(500000)).toMatch(/\$?\s?500\.?000/);
    expect(pipe.transform(1000)).toMatch(/\$?\s?1\.?000/);
  });

  it('debe retornar string vacío para null o undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('debe retornar string vacío para NaN', () => {
    expect(pipe.transform(NaN)).toBe('');
  });
});
