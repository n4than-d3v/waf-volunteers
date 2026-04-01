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
  AbstractControl,
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
        timeKind: FormControl<string | null>;
        time: FormControl<string | null>;
        quantityValue: FormControl<string | null>;
        quantityUnit: FormControl<string | null>;
        notes: FormControl<string | null>;
        dish: FormControl<string | null>;
        topUp: FormControl<boolean | null>;
        noQuantity: FormControl<boolean | null>;
      }>
    >([]),
  });

  customising = false;
  attemptedSave = false;
  saving = false;

  maxIndex = 5;

  constructor(private store: Store) {
    this.foods$ = this.store.select(selectFoods);
    this.task$ = this.store.select(selectUpdateDiets);
  }

  ngOnInit() {
    this.store.dispatch(getFoods());
  }

  private unconvertTime(time: string) {
    if (time === 'Every hour') return 1;
    const number = Number(time.split(' ')[1]);
    if (time.includes('minutes')) {
      return number / 60;
    } else {
      return number;
    }
  }

  private convertTime(time: string) {
    time = String(time);
    if (time.includes(':')) {
      const timeSplit = time.split(':');
      return `${timeSplit[0]}:${timeSplit[1]}`;
    } else {
      const number = Number(time);
      if (number === 1) return 'Every hour';
      else if (number < 1) return `Every ${60 * number} minutes`;
      else return `Every ${number} hours`;
    }
  }

  getLimitedInstructions() {
    const result: {
      time: string;
      items: string[];
    }[] = [];
    let count = 0;

    for (const feeding of this.getInstructions()) {
      const items: string[] = [];
      result.push({ time: feeding.time, items });
      for (const item of feeding.items) {
        if (count >= this.maxIndex) return result;

        items.push(item);
        count++;
      }
    }

    return result;
  }

  getTotalInstructionsCount() {
    return this.getInstructions().reduce(
      (total, feeding) => total + feeding.items.length,
      0,
    );
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
      let timeKind = 'Specific';
      let time = '';
      if (feeding.time.includes('Every')) {
        timeKind = 'Every';
        time = this.unconvertTime(feeding.time).toString();
      } else {
        time = feeding.time;
      }
      group.patchValue({
        timeKind,
        time,
        quantityValue: String(feeding.quantityValue),
        quantityUnit: feeding.quantityUnit,
        notes: feeding.notes,
        dish: feeding.dish,
        topUp: feeding.topUp,
        noQuantity: !feeding.quantityValue,
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
    const formGroup = new FormGroup(
      {
        foodId: new FormControl('', [Validators.required]),
        timeKind: new FormControl('Specific'),
        time: new FormControl('', [Validators.required]),
        quantityValue: new FormControl(''),
        quantityUnit: new FormControl(''),
        notes: new FormControl(''),
        dish: new FormControl(''),
        topUp: new FormControl(false),
        noQuantity: new FormControl(false),
      },
      { validators: this.quantityValidator },
    );
    this.dietForm.controls.feeding.push(formGroup);
    return formGroup;
  }

  quantityValidator(group: AbstractControl) {
    const noQuantity = group.get('noQuantity')?.value;
    const quantityValue = group.get('quantityValue')?.value;

    if (!noQuantity && !quantityValue) {
      return { quantityRequired: true };
    }

    return null;
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
          time: this.convertTime(group.value.time!),
          quantityUnit: group.value.noQuantity
            ? ''
            : group.value.quantityUnit! || ' ',
          quantityValue: Number(
            group.value.noQuantity ? 0 : group.value.quantityValue!,
          ),
          notes: group.value.notes,
          dish: group.value.dish,
          topUp: group.value.topUp || false,
          foodId: Number(group.value.foodId!),
        })),
      }),
    );
    this.reset();
  }
}
