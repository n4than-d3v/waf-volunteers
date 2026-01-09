import { Component, Input } from '@angular/core';
import { getWeightUnit, Patient, PatientStatus, Task } from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { addNote } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import { selectAddNote } from '../../selectors';

@Component({
  selector: 'hospital-patient-notes',
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
export class HospitalPatientNotesComponent {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  task$: Observable<Task>;

  constructor(private store: Store) {
    this.task$ = this.store.select(selectAddNote);
  }

  PatientStatus = PatientStatus;

  adding = false;
  saving = false;

  noteForm = new FormGroup({
    weightValue: new FormControl(''),
    weightUnit: new FormControl(''),
    comments: new FormControl(''),
    files: new FormControl<File[] | null>(null),
  });

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    this.noteForm.controls.files.setValue(Array.from(files));
  }

  add() {
    this.saving = true;
    this.store.dispatch(
      addNote({
        patientId: this.patient.id,
        weightValue: this.noteForm.value.weightValue
          ? Number(this.noteForm.value.weightValue)
          : null,
        weightUnit: this.noteForm.value.weightUnit
          ? Number(this.noteForm.value.weightUnit)
          : null,
        comments: this.noteForm.value.comments || '',
        files: this.noteForm.value.files || [],
      })
    );
    this.reset();
  }

  reset() {
    this.saving = false;
    this.adding = false;
    this.noteForm.reset();
  }

  getWeightUnit = getWeightUnit;
}
