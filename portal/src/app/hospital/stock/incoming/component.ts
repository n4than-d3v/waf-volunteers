import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getMeasurement, Item, Stock } from '../state';
import {
  selectItems,
  selectStock,
  selectStockError,
  selectStockLoading,
} from '../selectors';
import {
  addBatchForExistingItem,
  addBatchForNewItem,
  getStockItems,
  setPage,
  viewStock,
} from '../actions';
import { AsyncPipe } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Medication, ReadOnlyWrapper } from '../../state';
import { selectMedications } from '../../selectors';
import { getMedications } from '../../actions';
import { HospitalPatientAutocompleteComponent } from '../../patient/autocomplete/component';
import { SpinnerComponent } from '../../../shared/spinner/component';

@Component({
  selector: 'hospital-stock-incoming',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    HospitalPatientAutocompleteComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HospitalStockIncomingComponent implements OnInit {
  stock$: Observable<Stock[]>;
  items$: Observable<Item[]>;
  medications$: Observable<ReadOnlyWrapper<Medication[]>>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  existingItem: Item | null = null;
  attemptedSave = false;

  form = new FormGroup({
    medicationId: new FormControl('', [Validators.required]),
    medicationConcentrationId: new FormControl('', [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    newBrand: new FormControl('', [this.newBrandRequiredIfNew()]),
    measurement: new FormControl('', [this.newItemBeingCreated()]),
    afterOpeningLifetimeDays: new FormControl('', [this.newItemBeingCreated()]),
    reorderQuantity: new FormControl('', [this.newItemBeingCreated()]),
    number: new FormControl('', [Validators.required]),
    expiry: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    initials: new FormControl('', [Validators.required]),
  });

  constructor(private store: Store) {
    this.stock$ = this.store.select(selectStock);
    this.items$ = this.store.select(selectItems);
    this.loading$ = this.store.select(selectStockLoading);
    this.error$ = this.store.select(selectStockError);
    this.medications$ = this.store.select(selectMedications);
  }

  back() {
    this.store.dispatch(
      setPage({
        page: { pageType: 'dashboard' },
      })
    );
  }

  convertMedications(medications: Medication[]) {
    return medications.map((x) => ({
      id: x.id,
      display: x.activeSubstance,
      aka: x.brands.join(', '),
    }));
  }

  newItemBeingCreated(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      if (this.existingItem == null && !control.value) {
        return { newItem: true };
      }
      return null;
    };
  }

  newBrandRequiredIfNew(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      const brand = control.parent.get('brand')?.value;
      if (brand === '(New)' && !control.value?.trim()) {
        return { newBrandRequired: true };
      }
      return null;
    };
  }

  attemptFindItem() {
    return (
      this.form.value.medicationId &&
      this.form.value.medicationConcentrationId &&
      this.form.value.brand
    );
  }

  findItem(items: Item[]) {
    this.existingItem = null;
    for (const item of items) {
      if (
        this.form.value.medicationId == String(item.medication.id) &&
        this.form.value.medicationConcentrationId ==
          String(item.medicationConcentration.id) &&
        this.form.value.brand == item.brand
      ) {
        this.existingItem = item;
        return this.existingItem;
      }
    }
    return null;
  }

  getMeasurement = getMeasurement;

  save() {
    this.attemptedSave = true;
    for (const control in this.form.controls)
      this.form.get(control)?.updateValueAndValidity();
    this.form.updateValueAndValidity();
    if (!this.form.valid) return;
    const batch = {
      number: this.form.value.number!,
      expiry: this.form.value.expiry!,
      quantity: Number(this.form.value.quantity!),
      initials: this.form.value.initials!,
    };
    if (this.existingItem) {
      this.store.dispatch(
        addBatchForExistingItem({
          itemId: this.existingItem.id,
          ...batch,
        })
      );
    } else {
      this.store.dispatch(
        addBatchForNewItem({
          medicationId: Number(this.form.value.medicationId!),
          medicationConcentrationId: Number(
            this.form.value.medicationConcentrationId!
          ),
          brand:
            this.form.value.brand === '(New)'
              ? this.form.value.newBrand!
              : this.form.value.brand!,
          measurement: Number(this.form.value.measurement),
          afterOpeningLifetimeDays: Number(
            this.form.value.afterOpeningLifetimeDays
          ),
          reorderQuantity: Number(this.form.value.reorderQuantity),
          ...batch,
        })
      );
    }
  }

  ngOnInit() {
    this.store.dispatch(viewStock());
    this.store.dispatch(getStockItems());
    this.store.dispatch(getMedications());
  }
}
