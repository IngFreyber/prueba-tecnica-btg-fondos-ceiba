# Prueba Técnica – Ingeniero de Desarrollo Front-End (BTG Fondos)

Aplicación web para el **manejo de Fondos (FPV/FIC)** que permite visualizar fondos, suscribirse, cancelar participación y consultar el historial de transacciones.

##Video de funcionamiento:
https://jam.dev/c/815fcfa2-5934-49b9-94cf-03eebee75b75

## Requisitos cubiertos

### Funcionales
- **1.** Visualizar la lista de fondos disponibles.
- **2.** Suscribirse a un fondo si se cumple el monto mínimo.
- **3.** Cancelar participación en un fondo y ver el saldo actualizado.
- **4.** Visualizar el historial de transacciones (suscripciones y cancelaciones).
- **5.** Seleccionar método de notificación (Email o SMS) al suscribirse.
- **6.** Mensajes de error cuando no hay saldo suficiente.

### Técnicos
- **Angular 19** con componentes **standalone**.
- **Tailwind CSS** para estilos y diseño responsivo.
- **Manejo de estado** con servicios y señales (BalanceService).
- **Validaciones de formularios** (Reactive Forms) en suscripción.
- **Datos mock** (API REST simulada con Observables y delay).
- **Loading**, manejo de errores y feedback visual.
- **Navegación** con Angular Router (lazy loading).
- **TypeScript** y código comentado y estructurado.

### Consideraciones del documento
- Usuario único con saldo inicial **COP $500.000**.
- Fondos según tabla del documento (FPV_BTG_PACTUAL_RECAUDADORA, FPV_BTG_PACTUAL_ECOPETROL, DEUDAPRIVADA, FDO-ACCIONES, FPV_BTG_PACTUAL_DINAMICA).
- Sin backend, autenticación ni despliegue.

## Cómo ejecutar

### Requisitos
- Node.js 18+ y npm.

### Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm start
```

Luego abrir en el navegador: **http://localhost:4200/**

- **Fondos**: listado de fondos, suscripción (monto + notificación) y cancelación.
- **Historial**: tabla de transacciones con fecha, tipo, fondo, monto, notificación y saldo después.

### Build de producción

```bash
npm run build
```

Los artefactos quedarán en `dist/btg-fondos/`.

### Pruebas unitarias (Jest)

```bash
npm test              # Ejecutar todas las pruebas
npm run test:watch    # Modo watch (re-ejecutar al cambiar archivos)
npm run test:coverage # Con reporte de cobertura
```

## Estructura del proyecto

```
src/app/
├── core/           # Modelos, datos mock y servicios (fondos, saldo, transacciones)
├── features/       # Módulos por funcionalidad
│   ├── fondos/     # Lista de fondos, tarjeta de fondo, diálogo de suscripción
│   └── historial/ # Vista de historial de transacciones
├── shared/         # Pipes (COP), componentes reutilizables (saldo, loading, errores)
├── app.config.ts
├── app.routes.ts
└── app.component.ts
```

## Tecnologías

- Angular 19 (standalone)
- Tailwind CSS 4
- Angular Material (tema opcional)
- RxJS
- TypeScript 5.7
