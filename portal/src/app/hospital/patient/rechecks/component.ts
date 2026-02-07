import { Component, Input } from '@angular/core';
import {
  getRecheckRoles,
  getWeightUnit,
  ListRecheck,
  Patient,
  PatientStatus,
  Task,
} from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { addRecheck, removeRecheck, updateRecheck } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import { selectAddRecheck, selectRemoveRecheck } from '../../selectors';

@Component({
  selector: 'hospital-patient-rechecks',
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
export class HospitalPatientRechecksComponent {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  addTask$: Observable<Task>;
  removeTask$: Observable<Task>;

  constructor(private store: Store) {
    this.addTask$ = this.store.select(selectAddRecheck);
    this.removeTask$ = this.store.select(selectRemoveRecheck);
  }

  PatientStatus = PatientStatus;

  maxIndex = 5;

  adding = false;
  editing: number | null = null;
  saving = false;
  attemptedSave = false;

  removing: number | null = null;

  recheckForm = new FormGroup({
    roles: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    due: new FormControl('', [Validators.required]),
    requireWeight: new FormControl(false, { nonNullable: true }),
  });

  prepareEdit(recheck: ListRecheck) {
    this.editing = recheck.id;
    this.recheckForm.patchValue({
      roles: String(recheck.roles),
      description: recheck.description,
      due: recheck.due,
      requireWeight: recheck.requireWeight,
    });
  }

  edit() {
    this.attemptedSave = true;
    if (!this.recheckForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      updateRecheck({
        id: this.editing!,
        patientId: this.patient.id,
        roles: Number(this.recheckForm.value.roles),
        description: this.recheckForm.value.description!,
        due: this.recheckForm.value.due!,
        requireWeight: this.recheckForm.value.requireWeight!,
      }),
    );
    this.reset();
  }

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
        requireWeight: this.recheckForm.value.requireWeight!,
      }),
    );
    this.reset();
  }

  reset() {
    this.adding = false;
    this.editing = null;
    this.attemptedSave = false;
    this.removing = null;
    this.saving = false;
    this.recheckForm.reset();
  }

  remove(patientRecheckId: number) {
    this.removing = patientRecheckId;
    this.store.dispatch(
      removeRecheck({
        patientId: this.patient.id,
        patientRecheckId,
      }),
    );
    this.reset();
  }

  getRecheckRoles = getRecheckRoles;
  getWeightUnit = getWeightUnit;
}
