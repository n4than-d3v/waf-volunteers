import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subject,
  Subscription,
  timer,
} from 'rxjs';
import {
  getDisposition,
  ListPatient,
  PatientCounts,
  PatientStatus,
  ReadOnlyWrapper,
} from '../../hospital/state';
import { Store } from '@ngrx/store';
import {
  selectPatientCounts,
  selectPatientsByStatus,
} from '../../hospital/selectors';
import { getPatientsByStatus, setTab } from '../actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, skip } from 'rxjs/operators';
import { SpinnerComponent } from '../../shared/spinner/component';

@Component({
  selector: 'hospital-list-patients-by-status',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, DatePipe, SpinnerComponent, FormsModule],
})
export class HospitalListPatientByStatusComponent implements OnInit, OnDestroy {
  @Input() set status(status: PatientStatus) {
    this._status = status;
    console.log('initial set status');
    this.dispatch(false);
  }

  _status: PatientStatus | null = null;

  search$ = new BehaviorSubject<string>('');
  totalPages$: Observable<number>;
  pageSize$ = new BehaviorSubject<number>(100);
  page = 1;

  PatientStatus = PatientStatus;
  getDisposition = getDisposition;

  patientCounts$: Observable<ReadOnlyWrapper<PatientCounts>>;
  patients$: Observable<ReadOnlyWrapper<ListPatient[]>>;

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.patients$ = this.store.select(selectPatientsByStatus);
    this.patientCounts$ = this.store.select(selectPatientCounts);
    this.totalPages$ = combineLatest([
      this.patientCounts$,
      this.pageSize$,
      this.search$,
    ]).pipe(
      map(([counts, pageSize, _]) => {
        if (!counts?.data || !this._status) return 1;

        const total = this.getTotalForStatus(counts.data, this._status);
        return Math.max(1, Math.ceil(total / pageSize));
      }),
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

  pages(totalPages: number): number[] {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, this.page - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we’re near the end
    start = Math.max(1, end - maxVisible + 1);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  private getTotalForStatus(
    counts: PatientCounts,
    status: PatientStatus,
  ): number {
    switch (status) {
      case PatientStatus.PendingInitialExam:
        return counts.pendingInitialExam;
      case PatientStatus.Inpatient:
        return counts.inpatient;
      case PatientStatus.PendingHomeCare:
        return counts.pendingHomeCare;
      case PatientStatus.ReceivingHomeCare:
        return counts.receivingHomeCare;
      case PatientStatus.ReadyForRelease:
        return counts.readyForRelease;
      case PatientStatus.Dispositioned:
        return counts.dispositioned;
      default:
        return 0;
    }
  }

  nextPage() {
    this.page++;
    console.log('nextPage');
    this.dispatch(false);
  }

  prevPage() {
    if (this.page === 1) return;
    this.page--;
    console.log('prevPage');
    this.dispatch(false);
  }

  goToPage(page: number) {
    this.page = page;
    console.log('goToPage');
    this.dispatch(false);
  }

  private dispatch(silent: boolean) {
    if (!this._status) return;

    this.store.dispatch(
      getPatientsByStatus({
        status: this._status,
        search: this.search$.getValue(),
        page: this.page,
        pageSize: this.pageSize$.getValue(),
        silent,
      }),
    );
  }

  ngOnInit() {
    // Debounced search
    this.subscription = new Subscription();

    this.subscription.add(
      this.search$
        .pipe(skip(1), debounceTime(300), distinctUntilChanged())
        .subscribe((_) => {
          if (!this._status) return;
          this.page = 1;
          console.log('search');
          this.dispatch(false);
        }),
    );

    this.subscription.add(
      this.pageSize$.pipe(skip(1)).subscribe((_) => {
        this.page = 1; // reset page
        console.log('pageSize');
        this.dispatch(false);
      }),
    );

    this.subscription.add(
      this.totalPages$.subscribe((totalPages) => {
        if (this.page > totalPages) {
          this.page = totalPages;
          console.log('totalPages');
          this.dispatch(false);
        }
      }),
    );

    // Auto-refresh every 10 seconds
    this.subscription.add(
      timer(10_000, 10_000).subscribe(() => {
        console.log('silent refresh');
        this.dispatch(true);
      }),
    );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
