import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
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
import { TokenProvider } from './shared/token.provider';
import { profilesReducer } from './admin/users/reducer';
import { ProfilesEffects } from './admin/users/effects';
import { rotaManagementReducer } from './admin/rota/reducer';
import { RotaManagementEffects } from './admin/rota/effects';
import { RotaEffects } from './volunteer/rota/effects';
import { rotaReducer } from './volunteer/rota/reducer';
import { ClockingEffects } from './clocking/effects';
import { clockingReducer } from './clocking/reducer';
import { noticeManagementReducer } from './admin/notices/reducer';
import { NoticeManagementEffects } from './admin/notices/effects';
import { NgxEditorModule } from 'ngx-editor';
import { noticesReducer } from './volunteer/notices/reducer';
import { NoticesEffects } from './volunteer/notices/effects';
import { AdminHospitalManagementEffects } from './admin/hospital/effects';
import { adminHospitalManagementReducer } from './admin/hospital/reducer';
import { HospitalEffects } from './hospital/effects';
import { hospitalReducer } from './hospital/reducer';
import { orphanFeederReducer } from './volunteer/home-care/reducer';
import { OrphanFeederEffects } from './volunteer/home-care/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgxEditorModule.forRoot({
        locals: {
          bold: 'Bold',
          italic: 'Italic',
          code: 'Code',
          blockquote: 'Blockquote',
          underline: 'Underline',
          strike: 'Strike',
          bullet_list: 'Bullet list',
          ordered_list: 'Numbered list',
          heading: 'Heading',
          h1: 'Header 1',
          h2: 'Header 2',
          h3: 'Header 3',
          h4: 'Header 4',
          h5: 'Header 5',
          h6: 'Header 6',
          align_left: 'Left align',
          align_center: 'Centre align',
          align_right: 'Right align',
          align_justify: 'Justify',
          text_color: 'Text colour',
          background_color: 'Background colour',
          url: 'URL',
          text: 'Text',
          openInNewTab: 'Open in new tab',
          insert: 'Insert',
          altText: 'Alt text',
          title: 'Title',
          remove: 'Remove',
          enterValidUrl: 'Please enter a valid URL',
          required: 'This is required',
        },
      })
    ),
    TokenProvider,
    provideHttpClient(withInterceptors([baseUrlInterceptor, tokenInterceptor])),
    provideStore<AppState>({
      login: loginReducer,
      forgotPassword: forgotPasswordReducer,
      resetPassword: resetPasswordReducer,

      // Volunteer
      profile: profileReducer,
      rota: rotaReducer,
      notices: noticesReducer,
      orphanFeeder: orphanFeederReducer,

      // Admin
      profiles: profilesReducer,
      rotaManagement: rotaManagementReducer,
      noticeManagement: noticeManagementReducer,
      adminHospitalManagement: adminHospitalManagementReducer,

      // Hospital
      hospital: hospitalReducer,

      // Clocking
      clocking: clockingReducer,
    }),
    provideEffects([
      LoginEffects,
      ForgotPasswordEffects,
      ResetPasswordEffects,

      // Volunteer
      ProfileEffects,
      RotaEffects,
      NoticesEffects,
      OrphanFeederEffects,

      // Admin
      ProfilesEffects,
      RotaManagementEffects,
      NoticeManagementEffects,
      AdminHospitalManagementEffects,

      // Hospital
      HospitalEffects,

      // Clocking
      ClockingEffects,
    ]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
