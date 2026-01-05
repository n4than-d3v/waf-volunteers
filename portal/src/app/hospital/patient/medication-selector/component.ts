import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { getMedications } from '../../actions';
import { Observable } from 'rxjs';
import { Medication, ReadOnlyWrapper } from '../../state';
import { selectMedications } from '../../selectors';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'hospital-patient-medication-selector',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class HospitalPatientMedicationSelectorComponent {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) control!: string;
  @Input({ required: true }) formGroup!: FormGroup;

  search = '';
  open = false;

  medications$: Observable<ReadOnlyWrapper<Medication[]>>;

  medication: Medication | null = null;

  constructor(private store: Store) {
    this.medications$ = this.store.select(selectMedications);
  }

  debounceTimer: any;

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.performSearch(value);
    }, 300);
  }

  performSearch(search: string) {
    if (!search) return;
    console.log(`Searching for medication: ${search}`);
    this.open = true;
    this.store.dispatch(getMedications({ search }));
  }

  clearSelection(event: any) {
    if (event.keyCode && event.keyCode !== 13) return;
    this.medication = null;
    this.search = '';
    this.formGroup.controls[this.control].setValue('');
  }

  selectMedication(medication: Medication, event: any) {
    if (event.keyCode && event.keyCode !== 13) return;
    this.medication = medication;
    this.open = false;
    this.formGroup.controls[this.control].setValue(this.medication.id);
  }
}
