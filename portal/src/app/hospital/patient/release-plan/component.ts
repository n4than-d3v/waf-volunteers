import { Component, Input } from '@angular/core';
import { Patient, PatientStatus, Task } from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { updatePatientReleasePlan } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import { selectUpdateReleasePlan } from '../../selectors';
import moment from 'moment';

@Component({
  selector: 'hospital-patient-release-plan',
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
export class HospitalPatientReleasePlanComponent {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  updateTask$: Observable<Task>;

  constructor(private store: Store) {
    this.updateTask$ = this.store.select(selectUpdateReleasePlan);
  }

  PatientStatus = PatientStatus;

  updating = false;

  saving = false;
  attemptedSave = false;

  releasePlanForm = new FormGroup({
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  prepareEdit() {
    this.updating = true;

    if (!this.patient.plannedRelease) return;

    const plannedRelease = moment(this.patient.plannedRelease);

    this.releasePlanForm.patchValue({
      date: plannedRelease.format('YYYY-MM-DD'),
      time: plannedRelease.format('HH:mm'),
      notes: this.patient.plannedReleaseNotes || '',
    });
  }

  save() {
    this.attemptedSave = true;
    if (!this.releasePlanForm.valid) return;
    this.saving = true;

    const plannedRelease = moment(
      `${this.releasePlanForm.value.date} ${this.releasePlanForm.value.time}`,
    ).toISOString();

    this.store.dispatch(
      updatePatientReleasePlan({
        patientId: this.patient.id,
        plannedRelease,
        plannedReleaseNotes: this.releasePlanForm.value.notes || '',
      }),
    );
    this.cancel();
  }

  reset() {
    this.store.dispatch(
      updatePatientReleasePlan({
        patientId: this.patient.id,
        plannedRelease: null,
        plannedReleaseNotes: null,
      }),
    );
    this.cancel();
  }

  cancel() {
    this.updating = false;
    this.attemptedSave = false;
    this.saving = false;
    this.releasePlanForm.reset();
  }
}
