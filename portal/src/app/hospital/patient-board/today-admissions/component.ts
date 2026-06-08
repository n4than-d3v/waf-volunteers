import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription, timer } from 'rxjs';
import { viewTodayAdmissions } from '../../actions';
import { selectTodayAdmissions } from '../../selectors';
import {
  Disposition,
  ListPatient,
  PatientStatus,
  ReadOnlyWrapper,
} from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'patient-board-today-admissions',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, DatePipe],
})
export class HospitalPatientBoardTodayAdmissionsComponent
  implements OnInit, OnDestroy
{
  patients$: Observable<ListPatient[]>;

  subscription: Subscription | null = null;

  PatientStatus = PatientStatus;
  Disposition = Disposition;

  constructor(private store: Store) {
    this.patients$ = this.store
      .select(selectTodayAdmissions)
      .pipe(map((patients) => patients.data || []));
  }

  formatDispositionReasons(patient: ListPatient) {
    if (!patient.dispositionReasons) return '';
    return patient.dispositionReasons.map((x) => x.description).join(', ');
  }

  ngOnInit() {
    this.subscription = new Subscription();
    this.subscription.add(
      timer(0, 10_000).subscribe(() => {
        this.store.dispatch(viewTodayAdmissions());
      }),
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
