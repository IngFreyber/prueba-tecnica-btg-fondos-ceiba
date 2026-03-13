import { Component, input } from '@angular/core';

/**
 * Mensaje de error reutilizable (requisito: mensajes de error apropiados).
 */
@Component({
  selector: 'app-error-message',
  standalone: true,
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent {
  message = input<string | null>(null);
}
