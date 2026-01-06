import { Component, Input, OnInit } from '@angular/core';
import { AdministrationMethod, Patient, ReadOnlyWrapper } from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { getAdministrationMethods } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { HospitalPatientMedicationSelectorComponent } from '../medication-selector/component';
import { Observable } from 'rxjs';
import { selectAdministrationMethods } from '../../selectors';

@Component({
  selector: 'hospital-patient-prescriptions',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    HospitalPatientMedicationSelectorComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HospitalPatientPrescriptionsComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;

  administrationMethods$: Observable<ReadOnlyWrapper<AdministrationMethod[]>>;

  constructor(private store: Store) {
    this.administrationMethods$ = this.store.select(
      selectAdministrationMethods
    );
  }

  ngOnInit() {
    this.store.dispatch(getAdministrationMethods());
  }

  addingInstruction = false;
  addingMedication = false;

  saving = false;
  attemptedSave = false;

  prescriptionInstructionForm = new FormGroup({
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
    instructions: new FormControl('', [Validators.required]),
    frequency: new FormControl('', [Validators.required]),
  });

  prescriptionMedicationForm = new FormGroup({
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
    quantityValue: new FormControl('', [Validators.required]),
    quantityUnit: new FormControl('', [Validators.required]),
    medicationId: new FormControl('', [Validators.required]),
    administrationMethodId: new FormControl('', [Validators.required]),
    comments: new FormControl(''),
    frequency: new FormControl('', [Validators.required]),
  });

  reset() {
    this.prescriptionInstructionForm.reset();
    this.prescriptionMedicationForm.reset();
    this.addingInstruction = false;
    this.addingMedication = false;
  }

  addMedication() {
    this.attemptedSave = true;
    if (!this.prescriptionMedicationForm.valid) return;
    this.saving = true;
    // Dispatch action to add medication
  }

  addInstruction() {
    this.attemptedSave = true;
    if (!this.prescriptionInstructionForm.valid) return;
    this.saving = true;
    // Dispatch action to add instruction
  }
}
