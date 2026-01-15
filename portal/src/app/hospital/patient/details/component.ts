import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  Patient,
  PatientStatus,
  ReadOnlyWrapper,
  Species,
  Task,
} from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSpecies, selectUpdateBasicDetails } from '../../selectors';
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
  @Input({ required: true }) isVet!: boolean;

  task$: Observable<Task>;

  species$: Observable<ReadOnlyWrapper<Species[]>>;

  PatientStatus = PatientStatus;

  detailsForm = new FormGroup({
    name: new FormControl(''),
    uniqueIdentifier: new FormControl(''),
    speciesId: new FormControl('', [Validators.required]),
    speciesVariantId: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
  });

  updating = false;
  attemptedSave = false;
  saving = false;

  constructor(private store: Store) {
    this.species$ = this.store.select(selectSpecies);
    this.task$ = this.store.select(selectUpdateBasicDetails);
  }

  ngOnInit() {
    this.store.dispatch(getSpecies());
  }

  getSex() {
    switch (this.patient.sex) {
      case 1:
        return 'Male';
      case 2:
        return 'Female';
      default:
        return 'Unknown';
    }
  }

  reset() {
    this.saving = false;
    this.updating = false;
    this.attemptedSave = false;
    this.detailsForm.reset();
  }

  beginUpdate(patient: Patient) {
    this.updating = true;
    this.detailsForm.patchValue({
      name: patient.name,
      uniqueIdentifier: patient.uniqueIdentifier,
      speciesId: patient.species?.id.toString(),
      speciesVariantId: patient.speciesVariant?.id.toString(),
      sex: patient.sex!.toString(),
    });
  }

  update() {
    this.attemptedSave = true;
    if (!this.detailsForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      updatePatientBasicDetails({
        update: 'details',
        patientId: this.patient.id,
        name: this.detailsForm.value.name || '',
        uniqueIdentifier: this.detailsForm.value.uniqueIdentifier || '',
        speciesId: Number(this.detailsForm.value.speciesId),
        speciesVariantId: Number(this.detailsForm.value.speciesVariantId),
        sex: Number(this.detailsForm.value.sex),
        // Not updating tags or diets (yet)
        tagIds: this.patient.tags.map((x) => x.id),
        dietIds: this.patient.diets.map((x) => x.id),
      })
    );
    this.reset();
  }
}
