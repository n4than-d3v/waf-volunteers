import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/component';
import { ForgotPasswordComponent } from './authentication/forgot-password/component';
import { ResetPasswordComponent } from './authentication/reset-password/component';
import { VolunteerDashboardComponent } from './volunteer/dashboard/component';
import { VolunteerRotaComponent } from './volunteer/rota/component';
import { VolunteerProfileComponent } from './volunteer/profile/component';
import { isAdmin, isAuthenticated, isClocking } from './authentication/guards';
import { AdminDashboardComponent } from './admin/dashboard/component';
import { AdminUsersComponent } from './admin/users/component';
import { AdminUsersUpdateInfoComponent } from './admin/users/update-info/component';
import { AdminUsersCreateComponent } from './admin/users/create/component';
import { AdminRotaComponent } from './admin/rota/component';
import { AdminRotaConfigurationComponent } from './admin/rota/configuration/component';
import { AdminUsersUpdateRegularShiftsComponent } from './admin/rota/regular-shifts/component';
import { AdminRotaViewAttendanceComponent } from './admin/rota/view-attendance/component';
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
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: AdminDashboardComponent },
      {
        path: 'users',
        children: [
          { path: '', pathMatch: 'full', component: AdminUsersComponent },
          {
            path: 'create',
            component: AdminUsersCreateComponent,
          },
          {
            path: ':userId',
            children: [
              { path: 'update-info', component: AdminUsersUpdateInfoComponent },
              {
                path: 'update-regular-shifts',
                component: AdminUsersUpdateRegularShiftsComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'rota',
        children: [
          { path: '', pathMatch: 'full', component: AdminRotaComponent },
          { path: 'configuration', component: AdminRotaConfigurationComponent },
          { path: 'attendance', component: AdminRotaViewAttendanceComponent },
        ],
      },
    ],
  },
];
