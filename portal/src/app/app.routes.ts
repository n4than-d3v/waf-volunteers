import { Routes } from '@angular/router';
import {
  isAdmin,
  isAuthenticated,
  isBoards,
  isClocking,
  isVetOrAux,
} from './authentication/guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./authentication/login/component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./authentication/forgot-password/component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./authentication/reset-password/component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'install',
    loadComponent: () =>
      import('./installation/component').then((m) => m.InstallationComponent),
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
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./clocking/component').then((m) => m.ClockingComponent),
      },
    ],
  },
  {
    path: 'boards',
    canActivate: [isAuthenticated, isBoards],
    loadComponent: () =>
      import('./hospital/patient-board/component').then(
        (m) => m.HospitalPatientBoardComponent,
      ),
  },
  {
    path: 'admin',
    canActivate: [isAuthenticated, isAdmin],
    loadChildren: () => import('./app.routes.admin').then((m) => m.routes),
  },
  {
    path: 'vet',
    canActivate: [isAuthenticated, isVetOrAux],
    loadChildren: () => import('./app.routes.vet').then((m) => m.routes),
  },
];
