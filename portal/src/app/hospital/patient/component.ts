import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient, PatientStatus, ReadOnlyWrapper } from '../../hospital/state';
import { Store } from '@ngrx/store';
import { selectPatient } from '../../hospital/selectors';
import { getPatient } from '../actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import { HospitalPatientExamComponent } from './exam/component';

@Component({
  selector: 'hospital-patient',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    HospitalPatientExamComponent,
  ],
})
export class HospitalPatientComponent implements OnInit {
  @Input() set id(id: number) {
    this._id = id;
    this.store.dispatch(getPatient({ id }));
  }

  _id: number | null = null;

  PatientStatus = PatientStatus;

  patient$: Observable<ReadOnlyWrapper<Patient>>;

  constructor(private store: Store) {
    this.patient$ = this.store.select(selectPatient);
  }

  formatAdmissionReasons(patient: Patient) {
    return patient.admissionReasons.map((x) => x.description).join(', ');
  }

  ngOnInit() {}
}
