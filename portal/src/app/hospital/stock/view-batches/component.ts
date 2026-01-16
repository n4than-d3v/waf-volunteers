import { Component, Input } from '@angular/core';
import {
  getMeasurement,
  Page,
  Stock,
  StockBatch,
  StockBatchUsage,
} from '../state';
import { Store } from '@ngrx/store';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { setPage, useBatch } from '../actions';
import { Observable } from 'rxjs';
import { selectPage, selectStockError, selectStockLoading } from '../selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';

@Component({
  selector: 'hospital-stock-view-batches',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, DatePipe],
})
export class HospitalStockViewBatchesComponent {
  page$: Observable<Page>;

  constructor(private store: Store) {
    this.page$ = this.store.select(selectPage);
  }

  back() {
    this.store.dispatch(setPage({ page: { pageType: 'dashboard' } }));
  }

  signOut(item: Stock, batch: StockBatch) {
    this.store.dispatch(
      setPage({
        page: {
          pageType: 'use',
          item,
          batch,
        },
      })
    );
  }

  disposeUsage(item: Stock, batch: StockBatch, usage: StockBatchUsage) {
    this.store.dispatch(
      setPage({
        page: {
          pageType: 'disposeUsage',
          item,
          batch,
          usage,
        },
      })
    );
  }

  disposeBatch(item: Stock, batch: StockBatch) {
    this.store.dispatch(
      setPage({
        page: {
          pageType: 'disposeBatch',
          item,
          batch,
        },
      })
    );
  }

  getMeasurement = getMeasurement;
}
