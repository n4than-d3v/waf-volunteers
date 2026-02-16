import { Component, Input, OnInit } from '@angular/core';
import {
  DispositionReason,
  getDisposition,
  getWeightUnit,
  Patient,
  PatientStatus,
  ReadOnlyWrapper,
  ReleaseType,
  Task,
  TransferLocation,
} from '../../state';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectDispositionReasons,
  selectReleaseTypes,
  selectRequestHomeCare,
  selectSetDisposition,
  selectTransferLocations,
} from '../../selectors';
import {
  getDispositionReasons,
  getReleaseTypes,
  getTransferLocations,
  markPatientDead,
  markPatientInCentre,
  markPatientReadyForRelease,
  markPatientReleased,
  markPatientTransferred,
  requestHomeCare,
} from '../../actions';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HospitalPatientAutocompleteComponent } from '../autocomplete/component';

@Component({
  selector: 'hospital-patient-status',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    CommonModule,
    SpinnerComponent,
    HospitalPatientAutocompleteComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HospitalPatientStatusComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  dispositionReasons$: Observable<ReadOnlyWrapper<DispositionReason[]>>;
  releaseTypes$: Observable<ReadOnlyWrapper<ReleaseType[]>>;
  transferLocations$: Observable<ReadOnlyWrapper<TransferLocation[]>>;

  setDispositionTask$: Observable<Task>;
  requestHomeCareTask$: Observable<Task>;

  PatientStatus = PatientStatus;
  getDisposition = getDisposition;

  deadForm = new FormGroup({
    dispositionReasonIds: new FormArray<
      FormGroup<{ reason: FormControl<string | null> }>
    >([]),
  });

  releaseForm = new FormGroup({
    releaseTypeId: new FormControl('', [Validators.required]),
  });

  transferForm = new FormGroup({
    transferLocationId: new FormControl('', [Validators.required]),
  });

  // Next steps: allow home care requests to be created from here
  homeCareForm = new FormGroup({
    notes: new FormControl(''),
  });

  updating:
    | ''
    | 'release'
    | 'readyToRelease'
    | 'die'
    | 'pts'
    | 'transfer'
    | 'requestHomeCare' = '';
  attemptedSave = false;
  saving = false;

  constructor(private store: Store) {
    this.dispositionReasons$ = this.store.select(selectDispositionReasons);
    this.releaseTypes$ = this.store.select(selectReleaseTypes);
    this.transferLocations$ = this.store.select(selectTransferLocations);
    this.setDispositionTask$ = this.store.select(selectSetDisposition);
    this.requestHomeCareTask$ = this.store.select(selectRequestHomeCare);
  }

  ngOnInit() {
    this.store.dispatch(getDispositionReasons());
    this.store.dispatch(getReleaseTypes());
    this.store.dispatch(getTransferLocations());
    this.addDispositionReason();
  }

  addDispositionReason() {
    this.deadForm.controls.dispositionReasonIds.push(
      new FormGroup({
        reason: new FormControl<string | null>(null, Validators.required),
      }),
    );
  }

  removeDispositionReason(id: number) {
    this.deadForm.controls.dispositionReasonIds.removeAt(id);
  }

  formatDispositionReasons(reason: DispositionReason[]) {
    return reason.map((r) => r.description).join(', ');
  }

  convertDispositionReasons(dispositionReasons: DispositionReason[]) {
    return dispositionReasons.map((x) => ({
      id: x.id,
      display: x.description,
    }));
  }

  getStatus() {
    switch (this.patient.status) {
      case PatientStatus.PendingInitialExam:
        return 'Pending intake exam';
      case PatientStatus.Inpatient:
        return 'Inpatient';
      case PatientStatus.PendingHomeCare:
        return 'Pending home care';
      case PatientStatus.ReceivingHomeCare:
        return 'Receiving home care';
      case PatientStatus.ReadyForRelease:
        return 'Ready for release';
      case PatientStatus.Dispositioned:
        return 'Dispositioned';
      default:
        return 'Unknown';
    }
  }

  reset() {
    this.saving = false;
    this.updating = '';
    this.attemptedSave = false;
    this.deadForm.reset();
    this.releaseForm.reset();
    this.transferForm.reset();
  }

  resetStatus() {
    this.saving = true;
    this.store.dispatch(
      markPatientInCentre({
        patientId: this.patient.id,
      }),
    );
    this.reset();
  }

  readyToRelease() {
    this.updating = 'readyToRelease';
    this.saving = true;
    this.store.dispatch(
      markPatientReadyForRelease({
        patientId: this.patient.id,
      }),
    );
    this.reset();
  }

  release() {
    this.attemptedSave = true;
    if (!this.releaseForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      markPatientReleased({
        patientId: this.patient.id,
        releaseTypeId: Number(this.releaseForm.value.releaseTypeId!),
      }),
    );
    this.reset();
  }

  transfer() {
    this.attemptedSave = true;
    if (!this.transferForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      markPatientTransferred({
        patientId: this.patient.id,
        transferLocationId: Number(this.transferForm.value.transferLocationId!),
      }),
    );
    this.reset();
  }

  die() {
    this.attemptedSave = true;
    if (!this.deadForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      markPatientDead({
        patientId: this.patient.id,
        dispositionReasonIds: this.deadForm.value.dispositionReasonIds!.map(
          (x) => Number(x.reason!),
        ),
        onArrival: false,
        putToSleep: this.updating === 'pts',
      }),
    );
    this.reset();
  }

  requestHomeCare() {
    this.attemptedSave = true;
    if (!this.homeCareForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      requestHomeCare({
        patientId: this.patient.id,
        notes: this.homeCareForm.value.notes || '',
      }),
    );
    this.reset();
  }

  getWeightUnit = getWeightUnit;
}
