import { Routes } from '@angular/router';
import { VetDashboardComponent } from './vet/dashboard/component';
import { VetHospitalComponent } from './vet/hospital/component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: VetDashboardComponent },
  { path: 'hospital', component: VetHospitalComponent },
];
