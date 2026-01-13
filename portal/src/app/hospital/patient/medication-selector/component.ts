import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  getAdministrationMethods,
  getMedications,
  getSpecies,
} from '../../actions';
import { Observable, Subscription } from 'rxjs';
import {
  AdministrationMethod,
  Medication,
  MedicationConcentrationSpeciesDose,
  ReadOnlyWrapper,
  Species,
  SpeciesType,
} from '../../state';
import {
  selectAdministrationMethods,
  selectMedications,
  selectSpecies,
} from '../../selectors';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import { HospitalPatientAutocompleteComponent } from '../autocomplete/component';
import { getSpeciesType } from '../../../admin/hospital/state';

@Component({
  selector: 'hospital-patient-medication-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    HospitalPatientAutocompleteComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class HospitalPatientMedicationSelectorComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input({ required: true }) id!: number;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() speciesId?: string | null | undefined;
  @Input() weightValue?: string | number | null | undefined;
  @Input() weightUnit?: string | number | null | undefined;

  medications$: Observable<ReadOnlyWrapper<Medication[]>>;
  administrationMethods$: Observable<ReadOnlyWrapper<AdministrationMethod[]>>;

  species: Species[] = [];
  defaultDose: MedicationConcentrationSpeciesDose | null = null;
  subscription: Subscription;

  medications: Medication[] = [];

  constructor(private store: Store) {
    this.medications$ = this.store.select(selectMedications);
    this.administrationMethods$ = this.store.select(
      selectAdministrationMethods
    );
    this.subscription = this.store
      .select(selectSpecies)
      .subscribe((species) => {
        if (!species.data) return;
        this.species = species.data;
      });
  }

  ngOnInit() {
    this.store.dispatch(getMedications());
    this.store.dispatch(getAdministrationMethods());
    this.store.dispatch(getSpecies());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (
      changes['speciesId'] ||
      changes['weightValue'] ||
      changes['weightUnit']
    ) {
      this.updateDefaults(this.medications);
    }
  }

  updateDefaults(medications: Medication[]) {
    this.medications = medications;
    this.defaultDose = null;
    const medication = medications.find(
      (x) => x.id === Number(this.formGroup.value.medicationId)
    );
    if (!medication) return;
    const medicationConcentration = medication.concentrations.find(
      (x) => x.id === Number(this.formGroup.value.medicationConcentrationId)
    );
    if (!medicationConcentration) return;
    const species = this.species.find((x) => x.id == Number(this.speciesId));
    if (!species) return;
    // First try to match on species
    for (const dose of medicationConcentration.speciesDoses) {
      if (!dose.species) continue;
      if (dose.species.id === species.id) {
        this.updateDoseDefaults(dose);
      }
    }
    if (this.defaultDose) return;
    // Otherwise match on species type
    for (const dose of medicationConcentration.speciesDoses) {
      if (!dose.speciesType) continue;
      if (dose.speciesType === species.speciesType) {
        this.updateDoseDefaults(dose);
      }
    }
  }

  private updateDoseDefaults(dose: MedicationConcentrationSpeciesDose) {
    this.defaultDose = dose;
    const weight = this.getWeightKg();
    this.formGroup.controls['administrationMethodId'].setValue(
      dose.administrationMethod.id
    );
    this.formGroup.controls['quantityValue'].setValue(
      Math.round(dose.doseMlKgRangeEnd * weight * 100) / 100
    );
    this.formGroup.controls['quantityUnit'].setValue('ml');
    if (this.formGroup.controls['frequency']) {
      this.formGroup.controls['frequency'].setValue(dose.frequency);
      const frequencyType = dose.frequency.startsWith('Every')
        ? 'interval'
        : 'rate';
      this.formGroup.controls['frequencyType'].setValue(frequencyType);
      const split = dose.frequency
        .replace('Every ', '')
        .replace('times per ', '')
        .split(' ');
      this.formGroup.controls['frequencyX'].setValue(split[0]);
      this.formGroup.controls['frequencyY'].setValue(split[1]);
    }
  }

  getWeightKg() {
    if (this.weightUnit == '1') {
      return Number(this.weightValue) / 1000;
    } else if (this.weightUnit == '2') {
      return Number(this.weightValue);
    }
    return 0;
  }

  convertMedications(medications: Medication[]) {
    return medications.map((x) => ({ id: x.id, display: x.activeSubstance }));
  }

  getSpeciesType = getSpeciesType;

  private getGroupKey(item: MedicationConcentrationSpeciesDose): string {
    return [
      item.doseMgKgRangeStart,
      item.doseMgKgRangeEnd,
      item.doseMlKgRangeStart,
      item.doseMlKgRangeEnd,
      item.administrationMethod.code,
      item.frequency,
      item.notes,
    ].join('|');
  }

  groupMedicationDoses(
    items: MedicationConcentrationSpeciesDose[]
  ): MedicationConcentrationSpeciesDoses[] {
    const map = new Map<string, MedicationConcentrationSpeciesDoses>();

    for (const item of items) {
      const key = this.getGroupKey(item);

      if (!map.has(key)) {
        map.set(key, {
          key,
          species: [],
          isDefault: false,
          doseMgKgRangeStart: item.doseMgKgRangeStart,
          doseMgKgRangeEnd: item.doseMgKgRangeEnd,
          doseMlKgRangeStart: item.doseMlKgRangeStart,
          doseMlKgRangeEnd: item.doseMlKgRangeEnd,
          administrationMethod: item.administrationMethod,
          frequency: item.frequency,
          notes: item.notes,
        });
      }

      const group = map.get(key)!;

      group.key = key;
      group.isDefault = group.isDefault || item === this.defaultDose;

      if (item.species) {
        group.species.push({
          name: item.species.name,
          highlight:
            group.isDefault &&
            item.species.id === this.defaultDose?.species?.id,
        });
      }

      if (item.speciesType) {
        group.species.push({
          name: getSpeciesType(item.speciesType),
          highlight:
            group.isDefault &&
            item.speciesType === this.defaultDose?.speciesType,
        });
      }

      group.species.sort();
    }

    return Array.from(map.values());
  }
}

interface MedicationConcentrationSpeciesDoses {
  key: string;
  species: { name: string; highlight: boolean }[];
  isDefault: boolean;
  doseMgKgRangeStart: number;
  doseMgKgRangeEnd: number;
  doseMlKgRangeStart: number;
  doseMlKgRangeEnd: number;
  administrationMethod: AdministrationMethod;
  frequency: string;
  notes: string;
}
