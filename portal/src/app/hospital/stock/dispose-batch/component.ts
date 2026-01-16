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
import { disposeBatch, disposeUsage, setPage, useBatch } from '../actions';
import { Observable } from 'rxjs';
import { selectPage, selectStockError, selectStockLoading } from '../selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';

@Component({
  selector: 'hospital-stock-dispose-batch',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HospitalStockDisposeBatchComponent {
  page$: Observable<Page>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  attemptedSave = false;

  form = new FormGroup({
    initials: new FormControl('', [Validators.required]),
  });

  constructor(private store: Store) {
    this.page$ = this.store.select(selectPage);
    this.loading$ = this.store.select(selectStockLoading);
    this.error$ = this.store.select(selectStockError);
  }

  back() {
    this.store.dispatch(setPage({ page: { pageType: 'viewBatches' } }));
  }

  getMeasurement = getMeasurement;

  save(batch: StockBatch) {
    this.attemptedSave = true;
    if (!this.form.valid) return;
    this.store.dispatch(
      disposeBatch({
        batchId: batch.id,
        quantity: batch.quantityInStock,
        initials: this.form.value.initials!,
      })
    );
  }
}
