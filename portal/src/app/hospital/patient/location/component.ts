import { Component, Input, OnInit } from '@angular/core';
import {
  Area,
  Patient,
  PatientStatus,
  ReadOnlyWrapper,
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
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAreas, selectMovePatient } from '../../selectors';
import { getAreas, movePatient } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';

@Component({
  selector: 'hospital-patient-location',
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
export class HospitalPatientLocationComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  areas$: Observable<ReadOnlyWrapper<Area[]>>;

  task$: Observable<Task>;

  PatientStatus = PatientStatus;

  moveForm = new FormGroup({
    areaId: new FormControl('', [Validators.required]),
    penId: new FormControl('', [Validators.required]),
    movingPenToAnotherArea: new FormControl(false),
    newAreaId: new FormControl(''),
  });

  moving = false;
  saving = false;
  attemptedSave = false;

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
    this.task$ = this.store.select(selectMovePatient);
  }

  ngOnInit() {
    this.store.dispatch(getAreas());
  }

  reset() {
    this.saving = false;
    this.moving = false;
    this.attemptedSave = false;
    this.moveForm.reset();
  }

  move() {
    this.attemptedSave = true;
    if (this.moveForm.value.movingPenToAnotherArea) {
      this.moveForm.controls.newAreaId.addValidators(Validators.required);
    }
    this.moveForm.controls.newAreaId.updateValueAndValidity();
    this.moveForm.updateValueAndValidity();
    if (!this.moveForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      movePatient({
        patientId: this.patient.id,
        penId: Number(this.moveForm.value.penId),
        newAreaId: this.moveForm.value.newAreaId
          ? Number(this.moveForm.value.newAreaId)
          : null,
      }),
    );
    this.reset();
  }
}
