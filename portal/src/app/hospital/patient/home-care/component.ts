import { Component, Input, OnInit } from '@angular/core';
import {
  Area,
  getWeightUnit,
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
import { Store } from '@ngrx/store';
import {
  addNote,
  getAreas,
  homeCarerDropOff,
  sendHomeCareMessage,
} from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import {
  selectAddNote,
  selectAreas,
  selectDropOffHomeCare,
  selectMessageHomeCare,
} from '../../selectors';
import { HospitalPatientAutocompleteComponent } from '../autocomplete/component';

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
    HospitalPatientAutocompleteComponent,
  ],
})
export class HospitalPatientHomeCareComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  areas$: Observable<ReadOnlyWrapper<Area[]>>;

  dropOffAreaId = '';
  dropOffPenId = '';

  messageTask$: Observable<Task>;
  dropOffTask$: Observable<Task>;

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
    this.messageTask$ = this.store.select(selectMessageHomeCare);
    this.dropOffTask$ = this.store.select(selectDropOffHomeCare);
  }

  ngOnInit() {
    this.store.dispatch(getAreas());
  }

  droppingOff: number | null = null;
  saving = false;
  attemptedSave = false;

  PatientStatus = PatientStatus;

  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  dropOffForm = new FormGroup({
    areaId: new FormControl('', [Validators.required]),
    penId: new FormControl('', [Validators.required]),
  });

  homeCareDropOff(homeCareRequestId: number) {
    this.attemptedSave = true;
    if (!this.dropOffForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      homeCarerDropOff({
        patientId: this.patient.id,
        homeCareRequestId,
        penId: Number(this.dropOffForm.value.penId),
      }),
    );
    this.reset();
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
      }),
    );
    this.reset();
  }

  convertAreas(areas: Area[]) {
    return areas
      .filter((x) => !x.deleted)
      .map((area) => ({
        id: area.id,
        display: area.empty
          ? `🟩 [${area.code}] ${area.name} (empty pens)`
          : `🟨 [${area.code}] ${area.name} (all pens in use)`,
      }));
  }

  convertPens(areas: Area[]) {
    const area = areas
      .filter((x) => !x.deleted)
      .find((x) => String(x.id) == this.dropOffForm.value.areaId);
    if (!area) return [];
    return area.pens
      .filter((x) => !x.deleted)
      .map((pen) => ({
        id: pen.id,
        display: pen.empty
          ? `🟩 ${pen.reference} (empty)`
          : `🟨 ${pen.reference} (in use)`,
      }));
  }

  reset() {
    this.droppingOff = null;
    this.attemptedSave = false;
    this.saving = false;
    this.messageForm.reset();
    this.dropOffForm.reset();
  }
}
