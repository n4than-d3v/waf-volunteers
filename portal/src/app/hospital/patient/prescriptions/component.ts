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
import {
  addPrescriptionInstruction,
  addPrescriptionMedication,
  getAdministrationMethods,
} from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { HospitalPatientMedicationSelectorComponent } from '../medication-selector/component';
import { Observable } from 'rxjs';
import { selectAdministrationMethods } from '../../selectors';
import { HospitalPatientPrescriptionsFrequencyComponent } from './frequency/component';

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
    HospitalPatientPrescriptionsFrequencyComponent,
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
    console.log(this.prescriptionMedicationForm.value);
    this.attemptedSave = true;
    if (!this.prescriptionMedicationForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      addPrescriptionMedication({
        patientId: this.patient.id,
        start: this.prescriptionMedicationForm.value.start!,
        end: this.prescriptionMedicationForm.value.end!,
        frequency: this.prescriptionMedicationForm.value.frequency!,
        quantityValue: Number(
          this.prescriptionMedicationForm.value.quantityValue!
        ),
        quantityUnit: this.prescriptionMedicationForm.value.quantityUnit!,
        administrationMethodId: Number(
          this.prescriptionMedicationForm.value.administrationMethodId!
        ),
        medicationId: Number(
          this.prescriptionMedicationForm.value.medicationId!
        ),
        comments: this.prescriptionMedicationForm.value.comments || '',
      })
    );
  }

  addInstruction() {
    this.attemptedSave = true;
    if (!this.prescriptionInstructionForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      addPrescriptionInstruction({
        patientId: this.patient.id,
        start: this.prescriptionInstructionForm.value.start!,
        end: this.prescriptionInstructionForm.value.end!,
        frequency: this.prescriptionInstructionForm.value.frequency!,
        instructions: this.prescriptionInstructionForm.value.instructions || '',
      })
    );
  }
}
