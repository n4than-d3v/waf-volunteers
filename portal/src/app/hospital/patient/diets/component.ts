import { Component, Input, OnInit } from '@angular/core';
import {
  Food,
  Patient,
  PatientStatus,
  ReadOnlyWrapper,
  Task,
} from '../../state';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectFoods, selectUpdateDiets } from '../../selectors';
import { getFoods, updatePatientBasicDetails } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { formatFeeding } from '../../../admin/hospital/state';

@Component({
  selector: 'hospital-patient-diets',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HospitalPatientDietsComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  foods$: Observable<ReadOnlyWrapper<Food[]>>;

  task$: Observable<Task>;

  PatientStatus = PatientStatus;

  dietForm = new FormGroup({
    feeding: new FormArray<
      FormGroup<{
        foodId: FormControl<string | null>;
        time: FormControl<string | null>;
        quantityValue: FormControl<string | null>;
        quantityUnit: FormControl<string | null>;
      }>
    >([]),
  });

  customising = false;
  attemptedSave = false;
  saving = false;

  constructor(private store: Store) {
    this.foods$ = this.store.select(selectFoods);
    this.task$ = this.store.select(selectUpdateDiets);
  }

  ngOnInit() {
    this.store.dispatch(getFoods());
  }

  formatTime(time: string) {
    const split = time.split(':');
    return split[0] + ':' + split[1];
  }

  getInstructions() {
    if (this.patient.feeding.length > 0)
      return formatFeeding(this.patient.feeding);
    return formatFeeding(this.patient.speciesVariant?.feedingGuidance || []);
  }

  beginCustomising() {
    const feedingItems =
      this.patient.feeding.length > 0
        ? this.patient.feeding
        : this.patient.speciesVariant?.feedingGuidance || [];

    for (const feeding of feedingItems) {
      const group = this.addFeedingGuidance();
      group.patchValue({
        time: feeding.time,
        quantityValue: String(feeding.quantityValue),
        quantityUnit: feeding.quantityUnit,
        foodId: String(feeding.food.id),
      });
    }

    if (feedingItems.length === 0) {
      this.addFeedingGuidance();
    }

    this.customising = true;
  }

  clearCustomisations() {
    this.saving = true;
    const update = this.getUpdateAction();
    this.store.dispatch(
      updatePatientBasicDetails({
        ...update,
        update: 'feeding',
        feeding: [],
      }),
    );
    this.reset();
  }

  addFeedingGuidance() {
    const formGroup = new FormGroup({
      foodId: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
      quantityValue: new FormControl('', [Validators.required]),
      quantityUnit: new FormControl(''),
    });
    this.dietForm.controls.feeding.push(formGroup);
    return formGroup;
  }

  removeFeedingGuidance(index: number) {
    const group = this.dietForm.controls.feeding.at(index);
    group.controls.quantityValue.setValue('-1');
    if (!group.valid) {
      this.dietForm.controls.feeding.removeAt(index);
    }
  }

  showFeeding(index: number) {
    const group = this.dietForm.controls.feeding.at(index);
    return Number(group.controls.quantityValue.value || '0') != -1;
  }

  reset() {
    this.saving = false;
    this.customising = false;
    this.attemptedSave = false;
    this.dietForm.controls.feeding.clear();
    this.dietForm.reset();
  }

  private getUpdateAction() {
    return {
      patientId: this.patient.id,
      name: this.patient.name || '',
      uniqueIdentifier: this.patient.uniqueIdentifier || '',
      microchip: this.patient.microchip || '',
      speciesId: this.patient.species!.id,
      speciesVariantId: this.patient.speciesVariant!.id,
      sex: this.patient.sex!,
      tagIds: this.patient.tags.map((x) => x.id),
      feeding: this.patient.feeding.map((x) => ({
        ...x,
        foodId: x.food.id,
      })),
    };
  }

  save() {
    this.attemptedSave = true;
    if (!this.dietForm.valid) return;
    this.saving = true;
    const update = this.getUpdateAction();
    this.store.dispatch(
      updatePatientBasicDetails({
        ...update,
        update: 'feeding',
        feeding: this.dietForm.controls.feeding.controls.map((group) => ({
          time: group.value.time!,
          quantityUnit: group.value.quantityUnit! || ' ',
          quantityValue: Number(group.value.quantityValue!),
          foodId: Number(group.value.foodId!),
        })),
      }),
    );
    this.reset();
  }
}
