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
import { disposeUsage, setPage, useBatch } from '../actions';
import { Observable } from 'rxjs';
import { selectPage, selectStockError, selectStockLoading } from '../selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';

@Component({
  selector: 'hospital-stock-dispose-usage',
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
export class HospitalStockDisposeUsageComponent {
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

  save(usage: StockBatchUsage) {
    this.attemptedSave = true;
    if (!this.form.valid) return;
    this.store.dispatch(
      disposeUsage({
        usageId: usage.id,
        initials: this.form.value.initials!,
      })
    );
  }
}
