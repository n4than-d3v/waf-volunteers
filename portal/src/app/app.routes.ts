import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/component';
import { ForgotPasswordComponent } from './authentication/forgot-password/component';
import { ResetPasswordComponent } from './authentication/reset-password/component';
import {
  isAdmin,
  isAuthenticated,
  isClocking,
  isVet,
} from './authentication/guards';
import { InstallationComponent } from './installation/component';
import { ClockingComponent } from './clocking/component';

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
    path: 'install',
    component: InstallationComponent,
  },
  {
    path: 'volunteer',
    canActivate: [isAuthenticated],
    loadChildren: () => import('./app.routes.volunteer').then((m) => m.routes),
  },
  {
    path: 'clocking',
    canActivate: [isAuthenticated, isClocking],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: ClockingComponent },
    ],
  },
  {
    path: 'admin',
    canActivate: [isAuthenticated, isAdmin],
    loadChildren: () => import('./app.routes.admin').then((m) => m.routes),
  },
  {
    path: 'vet',
    canActivate: [isAuthenticated, isVet],
    loadChildren: () => import('./app.routes.vet').then((m) => m.routes),
  },
];
