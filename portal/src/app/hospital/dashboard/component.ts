import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getDashboard } from '../actions';
import { Observable } from 'rxjs';
import { Dashboard, ReadOnlyWrapper } from '../state';
import { selectDashboard } from '../selectors';
import { SpinnerComponent } from '../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import { HospitalDashboardChartAdmissionsComponent } from './daily-admissions/component';
import { HospitalDashboardAdmissionsByReasonComponent } from './admissions-by-reason/component';
import { HospitalDashboardAdmissionsBySpeciesSurvivalComponent } from './admissions-by-species-survival/component';
import { HospitalDashboardAdmissionsByDispositionComponent } from './admissions-by-disposition/component';
import { HospitalDashboardAdmissionsBySpeciesRescuesComponent } from './admissions-by-species-rescue/component';
import { HospitalDashboardAdmissionsBySpeciesEarlyLateMortalityComponent } from './admissions-by-species-early-late-mortality/component';
import { HospitalDashboardChartInCareComponent } from './daily-in-care/component';

@Component({
  selector: 'hospital-dashboard',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    HospitalDashboardChartAdmissionsComponent,
    HospitalDashboardChartInCareComponent,
    HospitalDashboardAdmissionsByDispositionComponent,
    HospitalDashboardAdmissionsByReasonComponent,
    HospitalDashboardAdmissionsBySpeciesRescuesComponent,
    HospitalDashboardAdmissionsBySpeciesSurvivalComponent,
    HospitalDashboardAdmissionsBySpeciesEarlyLateMortalityComponent,
  ],
})
export class HospitalDashboardComponent implements OnInit {
  dashboard$: Observable<ReadOnlyWrapper<Dashboard>>;

  constructor(private store: Store) {
    this.dashboard$ = this.store.select(selectDashboard);
  }

  ngOnInit() {
    this.store.dispatch(getDashboard());
  }
}
