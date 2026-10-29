import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { loggingInterceptor } from './services/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable zone.js change detection with event coalescing
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Provide the router with the defined routes and enable component input binding
    provideRouter(routes, withComponentInputBinding()),
    // Provide the HTTP client with the logging interceptor
    provideHttpClient(withInterceptors([loggingInterceptor]))
  ]
};