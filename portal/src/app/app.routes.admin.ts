import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/dashboard/component';
import { AdminUsersComponent } from './admin/users/component';
import { AdminUsersUpdateInfoComponent } from './admin/users/update-info/component';
import { AdminUsersCreateComponent } from './admin/users/create/component';
import { AdminUsersSendInvitationsComponent } from './admin/users/send-invitations/component';
import { AdminRotaComponent } from './admin/rota/component';
import { AdminRotaConfigurationComponent } from './admin/rota/configuration/component';
import { AdminUsersUpdateRegularShiftsComponent } from './admin/rota/regular-shifts/component';
import { AdminRotaViewAttendanceComponent } from './admin/rota/view-attendance/component';
import { AdminNoticesComponent } from './admin/notices/component';
import { AdminNoticeCreateComponent } from './admin/notices/create/component';
import { AdminNoticeInteractionsComponent } from './admin/notices/interactions/component';
import { AdminNoticeDeleteComponent } from './admin/notices/delete/component';
import { AdminNoticeUpdateComponent } from './admin/notices/update/component';
import { AdminRotaViewClockingsComponent } from './admin/rota/clockings/component';

export const routes: Routes = [
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
        path: 'send-invitations',
        component: AdminUsersSendInvitationsComponent,
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
      { path: 'clockings', component: AdminRotaViewClockingsComponent },
    ],
  },
  {
    path: 'notices',
    children: [
      { path: '', pathMatch: 'full', component: AdminNoticesComponent },
      { path: 'create', component: AdminNoticeCreateComponent },
      {
        path: ':id',
        children: [
          {
            path: 'edit',
            component: AdminNoticeUpdateComponent,
          },
          {
            path: 'interactions',
            component: AdminNoticeInteractionsComponent,
          },
          {
            path: 'delete',
            component: AdminNoticeDeleteComponent,
          },
        ],
      },
    ],
  },
];
