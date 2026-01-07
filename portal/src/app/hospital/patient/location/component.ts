import { Component, Input, OnInit } from '@angular/core';
import { Area, Patient, PatientStatus, ReadOnlyWrapper } from '../../state';
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
import { selectAreas } from '../../selectors';
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

  areas$: Observable<ReadOnlyWrapper<Area[]>>;

  PatientStatus = PatientStatus;

  moveForm = new FormGroup({
    areaId: new FormControl('', [Validators.required]),
    penId: new FormControl('', [Validators.required]),
  });

  moving = false;
  saving = false;
  attemptedSave = false;

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
  }

  ngOnInit() {
    this.store.dispatch(getAreas());
  }

  reset() {
    this.moving = false;
    this.attemptedSave = false;
    this.moveForm.reset();
  }

  move() {
    this.attemptedSave = true;
    if (!this.moveForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      movePatient({
        patientId: this.patient.id,
        penId: Number(this.moveForm.value.penId),
      })
    );
  }
}
