import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import {
  ListPatient,
  PatientStatus,
  ReadOnlyWrapper,
  TabCode,
} from '../../hospital/state';
import { Store } from '@ngrx/store';
import { selectPatientsByStatus } from '../../hospital/selectors';
import { getPatientsByStatus, setTab } from '../actions';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'hospital-list-patients-by-status',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, DatePipe],
})
export class HospitalListPatientByStatusComponent implements OnInit, OnDestroy {
  @Input() set status(status: PatientStatus) {
    this._status = status;
    this.store.dispatch(getPatientsByStatus({ status }));
  }

  _status: PatientStatus | null = null;

  PatientStatus = PatientStatus;

  patients$: Observable<ReadOnlyWrapper<ListPatient[]>>;

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.patients$ = this.store.select(selectPatientsByStatus);
  }

  formatAdmissionReasons(patient: ListPatient) {
    return patient.admissionReasons.map((x) => x.description).join(', ');
  }

  view(patient: ListPatient) {
    this.store.dispatch(
      setTab({
        tab: {
          code: 'VIEW_PATIENT',
          id: patient.id,
          title: `[${patient.reference}] ${
            patient.species?.name || patient.suspectedSpecies.description
          }`,
        },
      })
    );
  }

  ngOnInit() {
    // Every 10 seconds, update patients list
    this.subscription = timer(0, 1_000 * 10).subscribe(() => {
      if (!this._status) return;
      this.store.dispatch(getPatientsByStatus({ status: this._status }));
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
