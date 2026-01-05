import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import {
  Attitude,
  BodyCondition,
  Dehydration,
  DispositionReason,
  MucousMembraneColour,
  MucousMembraneTexture,
  Patient,
  PatientStatus,
  ReadOnlyWrapper,
  Species,
} from '../../hospital/state';
import { Store } from '@ngrx/store';
import {
  selectAttitudes,
  selectBodyConditions,
  selectDehydrations,
  selectDispositionReasons,
  selectMucousMembraneColours,
  selectMucousMembraneTextures,
  selectPatient,
  selectSpecies,
} from '../../hospital/selectors';
import {
  getAttitudes,
  getBodyConditions,
  getDehydrations,
  getDispositionReasons,
  getMucousMembraneColours,
  getMucousMembraneTextures,
  getPatient,
  getSpecies,
} from '../actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'hospital-patient',
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
export class HospitalPatientComponent implements OnInit {
  @Input() set id(id: number) {
    this._id = id;
    this.store.dispatch(getPatient({ id }));
  }

  _id: number | null = null;

  PatientStatus = PatientStatus;

  patient$: Observable<ReadOnlyWrapper<Patient>>;

  attitudes$: Observable<ReadOnlyWrapper<Attitude[]>>;
  bodyConditions$: Observable<ReadOnlyWrapper<BodyCondition[]>>;
  dehydrations$: Observable<ReadOnlyWrapper<Dehydration[]>>;
  mucousMembraneColours$: Observable<ReadOnlyWrapper<MucousMembraneColour[]>>;
  mucousMembraneTextures$: Observable<ReadOnlyWrapper<MucousMembraneTexture[]>>;

  species$: Observable<ReadOnlyWrapper<Species[]>>;
  dispositionReasons$: Observable<ReadOnlyWrapper<DispositionReason[]>>;

  outcome: null | 'alive' | 'deadOnArrival' | 'pts' = 'alive';
  dispositionReasonId: string | null = null;

  examForm = new FormGroup({
    speciesId: new FormControl(''),
    speciesAgeId: new FormControl(''),
    sex: new FormControl(''),
    weightValue: new FormControl(''),
    weightUnit: new FormControl(''),
    temperatureValue: new FormControl(''),
    temperatureUnit: new FormControl(''),
    attitudeId: new FormControl(''),
    bodyConditionId: new FormControl(''),
    dehydrationId: new FormControl(''),
    mucousMembraneColourId: new FormControl(''),
    mucousMembraneTextureId: new FormControl(''),
    treatmentInstructions: new FormArray<
      FormGroup<{
        instructions: FormControl<string | null>;
      }>
    >([]),
    treatmentMedications: new FormArray<
      FormGroup<{
        quantityValue: FormControl<string | null>;
        quantityUnit: FormControl<string | null>;
        medicationId: FormControl<string | null>;
        administrationMethodId: FormControl<string | null>;
        comments: FormControl<string | null>;
      }>
    >([]),
    comments: new FormControl(''),
  });

  constructor(private store: Store) {
    this.patient$ = this.store.select(selectPatient);
    this.attitudes$ = this.store.select(selectAttitudes);
    this.bodyConditions$ = this.store.select(selectBodyConditions);
    this.dehydrations$ = this.store.select(selectDehydrations);
    this.mucousMembraneColours$ = this.store.select(
      selectMucousMembraneColours
    );
    this.mucousMembraneTextures$ = this.store.select(
      selectMucousMembraneTextures
    );
    this.species$ = this.store.select(selectSpecies);
    this.dispositionReasons$ = this.store.select(selectDispositionReasons);
  }

  formatAdmissionReasons(patient: Patient) {
    return patient.admissionReasons.map((x) => x.description).join(', ');
  }

  ngOnInit() {
    this.store.dispatch(getAttitudes());
    this.store.dispatch(getBodyConditions());
    this.store.dispatch(getDehydrations());
    this.store.dispatch(getMucousMembraneColours());
    this.store.dispatch(getMucousMembraneTextures());
    this.store.dispatch(getSpecies());
    this.store.dispatch(getDispositionReasons());
  }
}
