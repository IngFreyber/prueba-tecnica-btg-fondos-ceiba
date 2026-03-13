import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Directiva que formatea el valor del input como moneda mientras el usuario escribe.
@Directive({
  selector: 'input[appCurrencyInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputDirective),
      multi: true,
    },
  ],
})
export class CurrencyInputDirective implements ControlValueAccessor, OnInit {
  private el = inject(ElementRef<HTMLInputElement>);

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  // Máximo de decimales (por defecto 2).
  private readonly maxDecimals = 2;

  ngOnInit(): void {
    const value = this.getValueFromElement();
    if (value !== null) this.formatAndSetDisplay(value);
  }

  writeValue(value: number | null): void {
    const num = value != null && !isNaN(value) ? value : 0;
    this.formatAndSetDisplay(num);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const raw = input.value;
    const num = this.parseToNumber(raw);
    this.formatAndSetDisplay(num);
    this.onChange(num);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
    const num = this.parseToNumber(this.el.nativeElement.value);
    if (num > 0) this.formatAndSetDisplay(num);
  }

  private getValueFromElement(): number | null {
    const raw = this.el.nativeElement.value;
    if (!raw || raw.trim() === '') return null;
    const n = this.parseToNumber(raw);
    return isNaN(n) ? null : n;
  }

  // Parsea el texto a número. Formato es-CO: miles con (.) y decimales con (,).
  private parseToNumber(value: string): number {
    if (!value || value.trim() === '') return 0;
    const normalized = value.trim().replace(/\s/g, '').replace(/[^\d.,]/g, '');
    const hasComma = normalized.includes(',');
    let numStr: string;
    if (hasComma) {
      numStr = normalized.replace(/\./g, '').replace(',', '.');
    } else {
      const dotCount = (normalized.match(/\./g) || []).length;
      if (dotCount === 0) {
        numStr = normalized;
      } else if (dotCount >= 2) {
        numStr = normalized.replace(/\./g, '');
      } else {
        const [before, after = ''] = normalized.split('.');
        const digitsAfter = after.replace(/\D/g, '').length;
        if (digitsAfter > 2) {
          numStr = normalized.replace('.', '');
        } else {
          numStr = normalized;
        }
      }
    }
    const cleaned = numStr.replace(/[^\d.]/g, '');
    const parts = cleaned.split('.');
    const integerPart = parts[0] || '0';
    const decimalPart = parts.length > 1 ? parts.slice(1).join('').slice(0, this.maxDecimals) : '';
    const combined = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    const num = parseFloat(combined);
    return isNaN(num) ? 0 : num;
  }

  // Formatea el número para mostrar (es-CO: miles con ., decimales con ,)
  private formatForDisplay(num: number): string {
    if (num === 0) return '';
    const isInteger = num % 1 === 0;
    const fixed = isInteger ? num.toString() : num.toFixed(this.maxDecimals);
    const [intPart, decPart] = fixed.split('.');
    const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return decPart && parseFloat(decPart) > 0 ? `${withDots},${decPart}` : withDots;
  }

  private formatAndSetDisplay(num: number): void {
    const input = this.el.nativeElement;
    const formatted = num === 0 ? '' : this.formatForDisplay(num);
    input.value = formatted;
  }
}
