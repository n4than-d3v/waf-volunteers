import { Routes } from '@angular/router';
import { VetDashboardComponent } from './vet/dashboard/component';
import { VetHospitalComponent } from './vet/hospital/component';
import { AdminHospitalComponent } from './admin/hospital/component';
import { AdminHospitalDietsComponent } from './admin/hospital/diets/component';
import { AdminHospitalTagsComponent } from './admin/hospital/tags/component';
import { AdminHospitalDispositionReasonsComponent } from './admin/hospital/disposition-reasons/component';
import { AdminHospitalReleaseTypesComponent } from './admin/hospital/release-types/component';
import { AdminHospitalTransferLocationsComponent } from './admin/hospital/transfer-locations/component';
import { AdminHospitalMedicationsComponent } from './admin/hospital/medications/component';
import { AdminHospitalAreasComponent } from './admin/hospital/areas/component';
import { AdminHospitalSpeciesComponent } from './admin/hospital/species/component';
import { isVet } from './authentication/guards';
import { AuxDevPlanTasksComponent } from './vet/aux-dev-plans/tasks/component';
import { AuxDevPlanLearnersComponent } from './vet/aux-dev-plans/learners/component';
import { AdminHospitalBoardsComponent } from './admin/hospital/boards/component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: VetDashboardComponent },
  { path: 'hospital', component: VetHospitalComponent },
  {
    path: 'configuration',
    canActivate: [isVet],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AdminHospitalComponent,
      },
      {
        path: 'diets',
        component: AdminHospitalDietsComponent,
      },
      {
        path: 'tags',
        component: AdminHospitalTagsComponent,
      },
      {
        path: 'disposition-reasons',
        component: AdminHospitalDispositionReasonsComponent,
      },
      {
        path: 'release-types',
        component: AdminHospitalReleaseTypesComponent,
      },
      {
        path: 'transfer-locations',
        component: AdminHospitalTransferLocationsComponent,
      },
      {
        path: 'medications',
        component: AdminHospitalMedicationsComponent,
      },
      {
        path: 'areas',
        component: AdminHospitalAreasComponent,
      },
      {
        path: 'species',
        component: AdminHospitalSpeciesComponent,
      },
      {
        path: 'boards',
        component: AdminHospitalBoardsComponent,
      },
    ],
  },
  {
    path: 'aux',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tasks',
      },
      {
        path: 'tasks',
        component: AuxDevPlanTasksComponent,
      },
      {
        path: 'learners',
        component: AuxDevPlanLearnersComponent,
      },
    ],
  },
];
