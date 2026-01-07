import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Patient, PatientStatus, ReadOnlyWrapper } from '../../hospital/state';
import { Store } from '@ngrx/store';
import { selectPatient } from '../../hospital/selectors';
import { getPatient } from '../actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import { HospitalPatientExamComponent } from './exam/component';
import { HospitalPatientAdmissionComponent } from './admission/component';
import { HospitalPatientDetailsComponent } from './details/component';
import { HospitalPatientViewExamComponent } from './view-exam/component';
import { HospitalPatientNotesComponent } from './notes/component';
import { HospitalPatientRechecksComponent } from './rechecks/component';
import { HospitalPatientPrescriptionsComponent } from './prescriptions/component';
import { HospitalPatientLocationComponent } from './location/component';
import { HospitalPatientDietsComponent } from './diets/component';
import { HospitalPatientTagsComponent } from './tags/component';
import { HospitalPatientStatusComponent } from './status/component';

@Component({
  selector: 'hospital-patient',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    HospitalPatientExamComponent,
    HospitalPatientAdmissionComponent,
    HospitalPatientDetailsComponent,
    HospitalPatientStatusComponent,
    HospitalPatientLocationComponent,
    HospitalPatientDietsComponent,
    HospitalPatientTagsComponent,
    HospitalPatientViewExamComponent,
    HospitalPatientNotesComponent,
    HospitalPatientRechecksComponent,
    HospitalPatientPrescriptionsComponent,
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

  ngOnInit() {}
}
