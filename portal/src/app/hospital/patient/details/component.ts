import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Patient, PatientStatus, ReadOnlyWrapper, Species } from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSpecies } from '../../selectors';
import { getSpecies, updatePatientBasicDetails } from '../../actions';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'hospital-patient-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
})
export class HospitalPatientDetailsComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;

  species$: Observable<ReadOnlyWrapper<Species[]>>;

  PatientStatus = PatientStatus;

  detailsForm = new FormGroup({
    name: new FormControl(''),
    uniqueIdentifier: new FormControl(''),
    speciesId: new FormControl('', [Validators.required]),
    speciesVariantId: new FormControl('', [Validators.required]),
  });

  updating = false;
  attemptedSave = false;
  saving = false;

  constructor(private store: Store) {
    this.species$ = this.store.select(selectSpecies);
  }

  ngOnInit() {
    this.store.dispatch(getSpecies());
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
    this.updating = false;
    this.detailsForm.reset();
  }

  beginUpdate(patient: Patient) {
    this.updating = true;
    this.detailsForm.patchValue({
      name: patient.name,
      uniqueIdentifier: patient.uniqueIdentifier,
      speciesId: patient.species?.id.toString(),
      speciesVariantId: patient.speciesVariant?.id.toString(),
    });
  }

  update() {
    this.attemptedSave = true;
    if (!this.detailsForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      updatePatientBasicDetails({
        patientId: this.patient.id,
        name: this.detailsForm.value.name || '',
        uniqueIdentifier: this.detailsForm.value.uniqueIdentifier || '',
        speciesId: Number(this.detailsForm.value.speciesId),
        speciesVariantId: Number(this.detailsForm.value.speciesVariantId),
        // Not updating tags or diets (yet)
        tagIds: this.patient.tags.map((x) => x.id),
        dietIds: this.patient.diets.map((x) => x.id),
      })
    );
  }
}
