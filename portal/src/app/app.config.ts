import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore } from '@ngrx/store';
import { loginReducer } from './authentication/login/reducer';
import { AppState } from './state';
import { provideEffects } from '@ngrx/effects';
import { LoginEffects } from './authentication/login/effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './baseurl.interceptor';
import { tokenInterceptor } from './token.interceptor';
import { forgotPasswordReducer } from './authentication/forgot-password/reducer';
import { ForgotPasswordEffects } from './authentication/forgot-password/effects';
import { resetPasswordReducer } from './authentication/reset-password/reducer';
import { ResetPasswordEffects } from './authentication/reset-password/effects';
import { profileReducer } from './volunteer/profile/reducer';
import { ProfileEffects } from './volunteer/profile/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([baseUrlInterceptor, tokenInterceptor])),
    provideStore<AppState>({
      login: loginReducer,
      forgotPassword: forgotPasswordReducer,
      resetPassword: resetPasswordReducer,
      profile: profileReducer,
    }),
    provideEffects([
      LoginEffects,
      ForgotPasswordEffects,
      ResetPasswordEffects,
      ProfileEffects,
    ]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
