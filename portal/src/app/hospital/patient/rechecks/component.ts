import { Component, Input } from '@angular/core';
import {
  getRecheckRoles,
  getWeightUnit,
  Patient,
  PatientStatus,
} from '../../state';
import { DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { addNote, addRecheck } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';

@Component({
  selector: 'hospital-patient-rechecks',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [DatePipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
})
export class HospitalPatientRechecksComponent {
  @Input({ required: true }) patient!: Patient;

  constructor(private store: Store) {}

  adding = false;
  saving = false;
  attemptedSave = false;

  recheckForm = new FormGroup({
    roles: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    due: new FormControl('', [Validators.required]),
  });

  add() {
    this.attemptedSave = true;
    if (!this.recheckForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      addRecheck({
        patientId: this.patient.id,
        roles: Number(this.recheckForm.value.roles),
        description: this.recheckForm.value.description!,
        due: this.recheckForm.value.due!,
      })
    );
  }

  reset() {
    this.recheckForm.reset();
    this.adding = false;
  }

  getRecheckRoles = getRecheckRoles;
}
