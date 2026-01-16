import { Component, Input } from '@angular/core';
import { getMeasurement, Page, Stock, StockBatch } from '../state';
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
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';

@Component({
  selector: 'hospital-stock-sign-out',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
})
export class HospitalStockSignOutComponent {
  page$: Observable<Page>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  attemptedSave = false;

  form = new FormGroup({
    quantity: new FormControl('', [Validators.required, Validators.min(0)]),
    initials: new FormControl('', [Validators.required]),
  });

  constructor(private store: Store) {
    this.page$ = this.store.select(selectPage);
    this.loading$ = this.store.select(selectStockLoading);
    this.error$ = this.store.select(selectStockError);
  }

  back() {
    this.store.dispatch(setPage({ page: { pageType: 'dashboard' } }));
  }

  getMeasurement = getMeasurement;

  save(batch: StockBatch) {
    this.attemptedSave = true;
    this.form.controls.quantity.addValidators(
      Validators.max(batch.quantityInStock)
    );
    this.form.controls.quantity.updateValueAndValidity();
    this.form.updateValueAndValidity();
    if (!this.form.valid) return;
    this.store.dispatch(
      useBatch({
        batchId: batch.id,
        quantity: Number(this.form.value.quantity),
        initials: this.form.value.initials!,
      })
    );
  }
}
