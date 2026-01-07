import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Tab } from '../../hospital/state';
import { Store } from '@ngrx/store';
import { selectTab } from '../../hospital/selectors';
import { HospitalPatientByStatusComponent } from '../../hospital/patient-by-status/component';
import { AsyncPipe } from '@angular/common';
import { HospitalListPatientByStatusComponent } from '../../hospital/list-patients-by-status/component';
import { HospitalPatientComponent } from '../../hospital/patient/component';
import { HospitalPatientSearchComponent } from '../../hospital/patient-search/component';

@Component({
  selector: 'vet-hospital',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    HospitalPatientByStatusComponent,
    HospitalListPatientByStatusComponent,
    HospitalPatientComponent,
    HospitalPatientSearchComponent,
  ],
})
export class VetHospitalComponent {
  tab$: Observable<Tab>;

  constructor(private store: Store) {
    this.tab$ = this.store.select(selectTab);
  }
}
