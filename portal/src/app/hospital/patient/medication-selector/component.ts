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
  getWeightUnit,
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

  defaultDoseKey: string | null = null;
  defaultDoseSpeciesId: number | null = null;
  defaultDoseSpeciesType: number | null = null;

  speciesSubscription: Subscription;
  medicationSubscription: Subscription;

  medications: Medication[] = [];

  constructor(private store: Store) {
    this.medications$ = this.store.select(selectMedications);

    this.administrationMethods$ = this.store.select(
      selectAdministrationMethods,
    );

    this.speciesSubscription = this.store
      .select(selectSpecies)
      .subscribe((species) => {
        if (!species.data) return;
        this.species = species.data;
      });

    this.medicationSubscription = this.store
      .select(selectMedications)
      .subscribe((medications) => {
        if (!medications.data) return;
        this.medications = medications.data;
        this.updateDefaults(this.medications, false);
      });
  }

  ngOnInit() {
    this.store.dispatch(getMedications());
    this.store.dispatch(getAdministrationMethods());
    this.store.dispatch(getSpecies());
  }

  ngOnDestroy(): void {
    this.speciesSubscription.unsubscribe();
    this.medicationSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['speciesId'] ||
      changes['weightValue'] ||
      changes['weightUnit']
    ) {
      this.updateDefaults(this.medications, false);
    }
  }

  updateDefaults(medications: Medication[], update: boolean = true) {
    if (!medications.length) return;
    if (!this.formGroup) return;

    this.medications = medications;
    this.clearDefaultDose();

    const medication = this.medications.find(
      (x) => x.id === Number(this.formGroup.value.medicationId),
    );
    if (!medication) return;
    const medicationConcentration = medication.concentrations.find(
      (x) => x.id === Number(this.formGroup.value.medicationConcentrationId),
    );
    if (!medicationConcentration) return;
    const species = this.species.find((x) => x.id == Number(this.speciesId));
    if (!species) return;

    // First try to match on species
    for (const dose of medicationConcentration.speciesDoses) {
      if (!dose.species) continue;
      if (dose.species.id === species.id) {
        this.updateDoseDefaults(dose, update);
      }
    }
    if (this.defaultDoseKey) return;
    // Otherwise match on species type
    for (const dose of medicationConcentration.speciesDoses) {
      if (!dose.speciesType) continue;
      if (dose.speciesType === species.speciesType) {
        this.updateDoseDefaults(dose, update);
      }
    }
  }

  updateRange() {
    const weight = this.getWeightKg();
    const doseMlKg = Number(this.formGroup.value.rangeSelection);
    this.formGroup.controls['quantityValue'].setValue(
      Math.round(doseMlKg * weight * 100) / 100,
    );
  }

  private setRangeDefault() {
    const weight = this.getWeightKg();
    const quantity = this.formGroup.controls['quantityValue'].value;
    if (!quantity) return;
    this.formGroup.controls['rangeSelection'].setValue(
      String(Math.round((Number(quantity) / weight) * 100) / 100),
    );
  }

  private updateDoseDefaults(
    dose: MedicationConcentrationSpeciesDose,
    update: boolean = true,
  ) {
    this.setDefaultDose(dose);
    this.setRangeDefault();
    if (!update) return;

    const weight = this.getWeightKg();
    this.formGroup.controls['administrationMethodId'].setValue(
      dose.administrationMethod.id,
    );
    this.formGroup.controls['rangeSelection'].setValue(dose.doseMlKgRangeEnd);
    this.formGroup.controls['quantityValue'].setValue(
      Math.round(dose.doseMlKgRangeEnd * weight * 100) / 100,
    );
    this.formGroup.controls['quantityUnit'].setValue('ml');
    if (this.formGroup.controls['frequency']) {
      this.formGroup.controls['frequency'].setValue(dose.frequency);
      if (dose.frequency === 'One time') {
        this.formGroup.controls['frequencyType'].setValue('once');
      } else {
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
    return medications.map((x) => ({
      id: x.id,
      display: x.activeSubstance,
      aka: x.brands.join(', '),
    }));
  }

  getSpeciesType = getSpeciesType;

  private clearDefaultDose() {
    this.defaultDoseKey = null;
    this.defaultDoseSpeciesId = null;
    this.defaultDoseSpeciesType = null;
  }

  private setDefaultDose(item: MedicationConcentrationSpeciesDose) {
    this.defaultDoseKey = this.getGroupKey(item);
    this.defaultDoseSpeciesId = item.species ? item.species.id : null;
    this.defaultDoseSpeciesType = item.speciesType;
  }

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
    items: MedicationConcentrationSpeciesDose[],
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
      group.isDefault = group.isDefault || key === this.defaultDoseKey;

      if (item.species) {
        group.species.push({
          name: item.species.name,
          highlight:
            group.isDefault && item.species.id === this.defaultDoseSpeciesId,
        });
      }

      if (item.speciesType) {
        group.species.push({
          name: getSpeciesType(item.speciesType),
          highlight:
            group.isDefault && item.speciesType === this.defaultDoseSpeciesType,
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
