import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/component';
import { ForgotPasswordComponent } from './authentication/forgot-password/component';
import { ResetPasswordComponent } from './authentication/reset-password/component';
import { VolunteerDashboardComponent } from './volunteer/dashboard/component';
import { VolunteerRotaComponent } from './volunteer/rota/component';
import { VolunteerProfileComponent } from './volunteer/profile/component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'volunteer',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        component: VolunteerDashboardComponent,
      },
      {
        path: 'rota',
        component: VolunteerRotaComponent,
      },
      {
        path: 'profile',
        component: VolunteerProfileComponent,
      },
    ],
  },
];
