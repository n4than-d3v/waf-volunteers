import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import {
  getDisposition,
  ListPatient,
  PatientStatus,
  ReadOnlyWrapper,
  TabCode,
} from '../../hospital/state';
import { Store } from '@ngrx/store';
import { selectPatientsByStatus } from '../../hospital/selectors';
import { getPatientsByStatus, setTab } from '../actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import moment from 'moment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'hospital-list-patients-by-status',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, DatePipe, FormsModule],
})
export class HospitalListPatientByStatusComponent implements OnInit, OnDestroy {
  @Input() set status(status: PatientStatus) {
    this._status = status;
    this.store.dispatch(getPatientsByStatus({ status }));
  }

  _status: PatientStatus | null = null;

  search = '';

  PatientStatus = PatientStatus;
  getDisposition = getDisposition;

  patients$: Observable<ReadOnlyWrapper<ListPatient[]>>;

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.patients$ = this.store.select(selectPatientsByStatus);
  }

  showPatient(patient: ListPatient) {
    if (!this.search) return true;
    const filters = [
      patient.reference,
      patient.suspectedSpecies?.description,
      patient.initialLocation?.description,
      ...patient.admissionReasons?.map((x) => x.description),
      patient.species?.name,
      patient.speciesVariant?.name,
      patient.speciesVariant?.friendlyName,
      patient.pen?.reference,
      patient.area?.name,
      ...patient.homeCareRequests?.map(
        (x) => x.responder?.firstName + ' ' + x.responder?.lastName,
      ),
    ];
    return filters.some(
      (x) => x && x.toUpperCase().includes(this.search.toUpperCase()),
    );
  }

  duration(patient: ListPatient) {
    const start = moment(patient.admitted);
    const end = moment();

    const months = end.diff(start, 'months');
    start.add(months, 'months');

    const days = end.diff(start, 'days');

    const parts = [];
    if (months) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (days) parts.push(`${days} day${days !== 1 ? 's' : ''}`);

    return parts.join(', ') || '0 days';
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
      }),
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
