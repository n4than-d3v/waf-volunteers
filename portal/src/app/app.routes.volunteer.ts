import { Routes } from '@angular/router';
import { VolunteerDashboardComponent } from './volunteer/dashboard/component';
import { VolunteerRotaComponent } from './volunteer/rota/component';
import { VolunteerProfileComponent } from './volunteer/profile/component';
import { VolunteerNoticesComponent } from './volunteer/notices/component';
import { VolunteerNoticeViewComponent } from './volunteer/notices/view/component';

export const routes: Routes = [
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
  {
    path: 'notices',
    children: [
      { path: '', pathMatch: 'full', component: VolunteerNoticesComponent },
      { path: ':id/view', component: VolunteerNoticeViewComponent },
    ],
  },
];
