import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
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
import { HospitalPatientHomeCareComponent } from './home-care/component';
import { TokenProvider } from '../../shared/token.provider';
import { HospitalPatientLabsComponent } from './labs/component';

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
    HospitalPatientHomeCareComponent,
    HospitalPatientViewExamComponent,
    HospitalPatientNotesComponent,
    HospitalPatientLabsComponent,
    HospitalPatientRechecksComponent,
    HospitalPatientPrescriptionsComponent,
  ],
})
export class HospitalPatientComponent implements OnInit, OnDestroy {
  @Input() set id(id: number) {
    this._id = id;
    this.store.dispatch(getPatient({ id }));
  }

  _id: number | null = null;

  isVet = false;

  PatientStatus = PatientStatus;

  patient$: Observable<ReadOnlyWrapper<Patient>>;

  subscription: Subscription | null = null;

  constructor(private store: Store, private tokenProvider: TokenProvider) {
    this.patient$ = this.store.select(selectPatient);
  }

  ngOnInit() {
    this.isVet = this.tokenProvider.isVet() || this.tokenProvider.isAdmin();
    // Every 10 seconds, update patient
    this.subscription = timer(10_000, 10_000).subscribe(() => {
      if (!this._id) return;
      this.store.dispatch(
        getPatient({
          id: this._id,
          silent: true,
        })
      );
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
