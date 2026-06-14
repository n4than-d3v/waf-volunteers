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
  pendingInitialExam$: Observable<ListPatient[]>;
  admitted$: Observable<ListPatient[]>;
  release$: Observable<ListPatient[]>;
  homeCare$: Observable<ListPatient[]>;
  died$: Observable<ListPatient[]>;

  subscription: Subscription | null = null;

  PatientStatus = PatientStatus;
  Disposition = Disposition;

  constructor(private store: Store) {
    const patients$ = this.store
      .select(selectTodayAdmissions)
      .pipe(map((patients) => patients.data || []));

    this.pendingInitialExam$ = patients$.pipe(
      map((patients) =>
        patients.filter(
          (patient) => patient.status === PatientStatus.PendingInitialExam,
        ),
      ),
    );

    this.admitted$ = patients$.pipe(
      map((patients) =>
        patients.filter(
          (patient) => patient.status === PatientStatus.Inpatient,
        ),
      ),
    );

    this.release$ = patients$.pipe(
      map((patients) =>
        patients.filter(
          (patient) =>
            patient.status === PatientStatus.ReadyForRelease ||
            (patient.status === PatientStatus.Dispositioned &&
              (patient.disposition === Disposition.Released ||
                patient.disposition === Disposition.Transferred)),
        ),
      ),
    );

    this.homeCare$ = patients$.pipe(
      map((patients) =>
        patients.filter(
          (patient) =>
            patient.status === PatientStatus.PendingHomeCare ||
            patient.status === PatientStatus.ReceivingHomeCare,
        ),
      ),
    );

    this.died$ = patients$.pipe(
      map((patients) =>
        patients.filter(
          (patient) =>
            patient.status === PatientStatus.Dispositioned &&
            patient.disposition !== Disposition.Released &&
            patient.disposition !== Disposition.Transferred,
        ),
      ),
    );
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
