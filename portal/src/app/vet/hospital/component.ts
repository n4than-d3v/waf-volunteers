import { Component } from '@angular/core';
import { Observable, timeInterval } from 'rxjs';
import { Tab } from '../../hospital/state';
import { Store } from '@ngrx/store';
import { selectTab } from '../../hospital/selectors';
import { HospitalPatientByStatusComponent } from '../../hospital/patient-by-status/component';
import { AsyncPipe } from '@angular/common';
import { HospitalListPatientByStatusComponent } from '../../hospital/list-patients-by-status/component';
import { HospitalPatientComponent } from '../../hospital/patient/component';
import { HospitalPatientSearchComponent } from '../../hospital/patient-search/component';
import { setTab } from '../../hospital/actions';
import { HospitalStockListComponent } from '../../hospital/stock/list/component';
import { setPage } from '../../hospital/stock/actions';
import { HospitalDailyTasksComponent } from '../../hospital/daily-tasks/component';
import { HospitalPatientBoardComponent } from '../../hospital/patient-board/component';

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
    HospitalDailyTasksComponent,
    HospitalStockListComponent,
    HospitalPatientBoardComponent,
  ],
})
export class VetHospitalComponent {
  tab$: Observable<Tab>;

  constructor(private store: Store) {
    this.tab$ = this.store.select(selectTab);
  }

  viewPatientBoards() {
    this.store.dispatch(
      setTab({
        tab: {
          code: 'VIEW_BOARDS',
          title: 'Patient boards',
        },
      }),
    );
  }

  viewDailyTasks() {
    this.store.dispatch(
      setTab({
        tab: {
          code: 'VIEW_DAILY_TASKS',
          title: 'Daily tasks',
        },
      }),
    );
  }

  viewStock() {
    this.store.dispatch(
      setPage({
        page: { pageType: 'dashboard' },
      }),
    );
    this.store.dispatch(
      setTab({
        tab: {
          code: 'VIEW_STOCK',
          title: 'Stock',
        },
      }),
    );
  }
}
