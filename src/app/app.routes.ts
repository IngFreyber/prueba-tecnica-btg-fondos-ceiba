import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'fondos', pathMatch: 'full' },
  { path: 'fondos', loadComponent: () => import('./features/fondos/fondos-list/fondos-list.component').then(m => m.FondosListComponent) },
  { path: 'historial', loadComponent: () => import('./features/historial/historial.component').then(m => m.HistorialComponent) },
  { path: '**', redirectTo: 'fondos' },
];
