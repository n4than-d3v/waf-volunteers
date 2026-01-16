import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getMeasurement, Page, Stock, StockBatch } from '../state';
import {
  selectPage,
  selectStock,
  selectStockError,
  selectStockLoading,
} from '../selectors';
import { setPage, viewStock } from '../actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { HospitalStockIncomingComponent } from '../incoming/component';
import { HospitalStockSignOutComponent } from '../sign-out/component';
import { HospitalStockViewBatchesComponent } from '../view-batches/component';
import { HospitalStockDisposeUsageComponent } from '../dispose-usage/component';
import { HospitalStockDisposeBatchComponent } from '../dispose-batch/component';

@Component({
  selector: 'hospital-stock-list',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    HospitalStockIncomingComponent,
    HospitalStockViewBatchesComponent,
    HospitalStockSignOutComponent,
    HospitalStockDisposeUsageComponent,
    HospitalStockDisposeBatchComponent,
  ],
})
export class HospitalStockListComponent implements OnInit {
  page$: Observable<Page>;

  stock$: Observable<Stock[]>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  constructor(private store: Store) {
    this.page$ = this.store.select(selectPage);
    this.stock$ = this.store.select(selectStock);
    this.loading$ = this.store.select(selectStockLoading);
    this.error$ = this.store.select(selectStockError);
  }

  getMeasurement = getMeasurement;

  incoming() {
    this.store.dispatch(
      setPage({
        page: { pageType: 'delivery' },
      })
    );
  }

  viewBatches(item: Stock) {
    this.store.dispatch(
      setPage({
        page: { pageType: 'viewBatches', item },
      })
    );
  }

  ngOnInit() {
    this.store.dispatch(viewStock());
  }
}
