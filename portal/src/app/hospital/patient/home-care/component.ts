import { Component, Input } from '@angular/core';
import { getWeightUnit, Patient, PatientStatus, Task } from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { addNote, homeCarerDropOff, sendHomeCareMessage } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import {
  selectAddNote,
  selectDropOffHomeCare,
  selectMessageHomeCare,
} from '../../selectors';

@Component({
  selector: 'hospital-patient-home-care',
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
export class HospitalPatientHomeCareComponent {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  messageTask$: Observable<Task>;
  dropOffTask$: Observable<Task>;

  constructor(private store: Store) {
    this.messageTask$ = this.store.select(selectMessageHomeCare);
    this.dropOffTask$ = this.store.select(selectDropOffHomeCare);
  }

  saving = false;
  attemptedSave = false;

  PatientStatus = PatientStatus;

  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  homeCareDropOff(homeCareRequestId: number) {
    this.store.dispatch(
      homeCarerDropOff({
        patientId: this.patient.id,
        homeCareRequestId,
      })
    );
  }

  sendMessage(homeCareRequestId: number) {
    this.attemptedSave = true;
    if (!this.messageForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      sendHomeCareMessage({
        patientId: this.patient.id,
        homeCareRequestId,
        message: this.messageForm.value.message || '',
      })
    );
    this.reset();
  }

  reset() {
    this.attemptedSave = false;
    this.saving = false;
    this.messageForm.reset();
  }
}
