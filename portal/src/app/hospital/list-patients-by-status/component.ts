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
  HomeCareRequest,
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
import { formatFractionalNumber } from '../../admin/hospital/state';

@Component({
  selector: 'hospital-list-patients-by-status',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, DatePipe, SpinnerComponent, FormsModule],
})
export class HospitalListPatientByStatusComponent implements OnInit, OnDestroy {
  readonly LS_SORT_BY = 'hospital-list-sort-by';
  readonly LS_PAGE_SIZE = 'hospital-list-page-size';
  readonly LS_SEARCH = 'hospital-list-page-search';

  @Input() set status(status: PatientStatus) {
    this._status = status;
    this.useLocalStorage();
    this.dispatch(false);
  }

  _status: PatientStatus | null = null;

  showingMessage = '';
  search$: BehaviorSubject<string>;
  totalPages$: Observable<number>;
  pageSize$: BehaviorSubject<number>;
  sortBy$: BehaviorSubject<number>;
  page = 1;

  PatientStatus = PatientStatus;
  getDisposition = getDisposition;

  patientCounts$: Observable<ReadOnlyWrapper<PatientCounts>>;
  patients$: Observable<
    ReadOnlyWrapper<{ total: number; patients: ListPatient[] }>
  >;

  subscription: Subscription | null = null;

  constructor(private store: Store) {
    this.sortBy$ = new BehaviorSubject<number>(1);
    this.pageSize$ = new BehaviorSubject<number>(25);
    this.search$ = new BehaviorSubject<string>('');

    this.patients$ = this.store.select(selectPatientsByStatus);
    this.patientCounts$ = this.store.select(selectPatientCounts);

    this.totalPages$ = combineLatest([
      this.patients$,
      this.pageSize$,
      this.search$,
    ]).pipe(
      map(([patients, pageSize, _]) => {
        if (!patients?.data || !this._status) return 1;

        const total = patients.data.total;
        this.setShowingMessage(total);
        return Math.max(1, Math.ceil(total / pageSize));
      }),
    );
  }

  private useLocalStorage() {
    if (!this._status) return;

    const sortByLS = localStorage.getItem(this.LS_SORT_BY + this._status);
    const pageSizeLS = localStorage.getItem(this.LS_PAGE_SIZE + this._status);
    const searchLS = localStorage.getItem(this.LS_SEARCH + this._status);

    this.sortBy$.next(sortByLS ? Number(sortByLS) : 1);
    this.pageSize$.next(pageSizeLS ? Number(pageSizeLS) : 25);
    this.search$.next(searchLS ?? '');
  }

  getLatestHomeCareRequest(requests: HomeCareRequest[]) {
    if (!requests?.length) return null;

    const pickups = [...requests].filter((x) => x.pickup);
    if (pickups.length === 0) return null;

    return pickups.sort(
      (a, b) => new Date(b.pickup!).getTime() - new Date(a.pickup!).getTime(),
    )[0];
  }

  private setShowingMessage(total: number) {
    const pageSize = Number(this.pageSize$.getValue());
    const from = (this.page - 1) * pageSize + 1;
    const to = Math.min(total, from + pageSize - 1);
    this.showingMessage = `Showing ${formatFractionalNumber(from)} to ${formatFractionalNumber(to)} of ${formatFractionalNumber(total)}`;
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

    const sortBy = this.sortBy$.getValue();
    localStorage.setItem(this.LS_SORT_BY + this._status, sortBy.toString());

    const pageSize = this.pageSize$.getValue();
    localStorage.setItem(this.LS_PAGE_SIZE + this._status, pageSize.toString());

    const search = this.search$.getValue();
    localStorage.setItem(this.LS_SEARCH + this._status, search.toString());

    this.store.dispatch(
      getPatientsByStatus({
        status: this._status,
        search,
        page: this.page,
        pageSize,
        sortBy,
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
      this.sortBy$.pipe(skip(1)).subscribe((_) => {
        this.page = 1; // reset page
        console.log('sortBy');
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
