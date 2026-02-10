import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import {
  PatientCounts,
  PatientStatus,
  ReadOnlyWrapper,
  TabCode,
} from '../../hospital/state';
import { Store } from '@ngrx/store';
import { selectPatientCounts } from '../../hospital/selectors';
import { getPatientCounts, setTab } from '../actions';
import { AsyncPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'hospital-patient-by-status',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, DecimalPipe],
})
export class HospitalPatientByStatusComponent implements OnInit, OnDestroy {
  patientCounts$: Observable<ReadOnlyWrapper<PatientCounts>>;

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.patientCounts$ = this.store.select(selectPatientCounts);
  }

  viewDashboard() {
    this.store.dispatch(
      setTab({
        tab: {
          code: 'DASHBOARD',
          title: 'Dashboard',
        },
      }),
    );
  }

  changeTab(status: PatientStatus) {
    let title = '...';
    switch (status) {
      case PatientStatus.PendingInitialExam:
        title = 'Patients pending intake exam';
        break;
      case PatientStatus.Inpatient:
        title = 'Patients in centre';
        break;
      case PatientStatus.PendingHomeCare:
        title = 'Patients pending home care';
        break;
      case PatientStatus.ReceivingHomeCare:
        title = 'Patients receiving home care';
        break;
      case PatientStatus.ReadyForRelease:
        title = 'Patients ready for release';
        break;
      case PatientStatus.Dispositioned:
        title = 'Patients dispositioned';
        break;
      default:
        break;
    }
    this.store.dispatch(
      setTab({
        tab: { code: 'LIST_PATIENTS_BY_STATUS', title, id: status },
      }),
    );
  }

  ngOnInit() {
    // Every 10 seconds, update patient counts
    this.subscription = timer(0, 1_000 * 10).subscribe(() => {
      this.store.dispatch(getPatientCounts());
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
