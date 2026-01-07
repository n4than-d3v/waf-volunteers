import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  DispositionReason,
  getDisposition,
  Patient,
  PatientStatus,
  ReadOnlyWrapper,
  ReleaseType,
  Species,
  TransferLocation,
} from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectDispositionReasons,
  selectReleaseTypes,
  selectSpecies,
  selectTransferLocations,
} from '../../selectors';
import {
  getDispositionReasons,
  getReleaseTypes,
  getSpecies,
  getTransferLocations,
  markPatientDead,
  markPatientReadyForRelease,
  markPatientReleased,
  markPatientTransferred,
  updatePatientBasicDetails,
} from '../../actions';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'hospital-patient-status',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
})
export class HospitalPatientStatusComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;

  dispositionReasons$: Observable<ReadOnlyWrapper<DispositionReason[]>>;
  releaseTypes$: Observable<ReadOnlyWrapper<ReleaseType[]>>;
  transferLocations$: Observable<ReadOnlyWrapper<TransferLocation[]>>;

  PatientStatus = PatientStatus;
  getDisposition = getDisposition;

  deadForm = new FormGroup({
    dispositionReasonId: new FormControl('', [Validators.required]),
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

  updating: '' | 'release' | 'readyToRelease' | 'die' | 'pts' | 'transfer' = '';
  attemptedSave = false;
  saving = false;

  constructor(private store: Store) {
    this.dispositionReasons$ = this.store.select(selectDispositionReasons);
    this.releaseTypes$ = this.store.select(selectReleaseTypes);
    this.transferLocations$ = this.store.select(selectTransferLocations);
  }

  ngOnInit() {
    this.store.dispatch(getDispositionReasons());
    this.store.dispatch(getReleaseTypes());
    this.store.dispatch(getTransferLocations());
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
    this.updating = '';
    this.deadForm.reset();
    this.releaseForm.reset();
    this.transferForm.reset();
  }

  readyToRelease() {
    this.updating = 'readyToRelease';
    this.saving = true;
    this.store.dispatch(
      markPatientReadyForRelease({
        patientId: this.patient.id,
      })
    );
  }

  release() {
    this.attemptedSave = true;
    if (!this.releaseForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      markPatientReleased({
        patientId: this.patient.id,
        releaseTypeId: Number(this.releaseForm.value.releaseTypeId!),
      })
    );
  }

  transfer() {
    this.attemptedSave = true;
    if (!this.transferForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      markPatientTransferred({
        patientId: this.patient.id,
        transferLocationId: Number(this.transferForm.value.transferLocationId!),
      })
    );
  }

  die() {
    this.attemptedSave = true;
    if (!this.deadForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      markPatientDead({
        patientId: this.patient.id,
        dispositionReasonId: Number(this.deadForm.value.dispositionReasonId!),
        onArrival: false,
        putToSleep: this.updating === 'pts',
      })
    );
  }
}
