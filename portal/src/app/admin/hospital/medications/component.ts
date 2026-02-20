import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  getSpeciesType,
  Medication,
  MedicationConcentration,
  MedicationConcentrationSpeciesDose,
  Species,
  SpeciesType,
  Wrapper,
} from '../state';
import { Store } from '@ngrx/store';
import { selectMedications, selectSpecies } from '../selectors';
import {
  upsertMedication,
  upsertMedicationConcentration,
  upsertMedicationConcentrationSpeciesDose,
  getMedications,
  getSpecies,
} from '../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HospitalPatientPrescriptionsFrequencyComponent } from '../../../hospital/patient/prescriptions/frequency/component';
import { selectAdministrationMethods } from '../../../hospital/selectors';
import { AdministrationMethod, ReadOnlyWrapper } from '../../../hospital/state';
import { getAdministrationMethods } from '../../../hospital/actions';
import { HospitalPatientAutocompleteComponent } from '../../../hospital/patient/autocomplete/component';

@Component({
  selector: 'admin-hospital-medications',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    RouterLink,
    AsyncPipe,
    SpinnerComponent,
    HospitalPatientPrescriptionsFrequencyComponent,
    FormsModule,
    ReactiveFormsModule,
    HospitalPatientAutocompleteComponent,
  ],
})
export class AdminHospitalMedicationsComponent implements OnInit {
  medications$: Observable<Wrapper<Medication>>;

  species$: Observable<Wrapper<Species>>;
  administrationMethods$: Observable<ReadOnlyWrapper<AdministrationMethod[]>>;

  search = '';

  addMedication = false;
  editMedication: number | null = null;
  addMedicationConcentration: Medication | null = null;
  editMedicationConcentration: MedicationConcentration | null = null;
  addMedicationConcentrationSpeciesDose: MedicationConcentration | null = null;
  editMedicationConcentrationSpeciesDose: MedicationConcentrationSpeciesDose | null =
    null;

  medicationForm = new FormGroup({
    activeSubstance: new FormControl(''),
    brands: new FormControl(''),
    notes: new FormControl(''),
  });

  medicationConcentrationForm = new FormGroup({
    form: new FormControl(''),
    concentrationValue: new FormControl(''),
    defaultUnit: new FormControl(''),
  });

  medicationConcentrationSpeciesDoseForm = new FormGroup({
    doseFor: new FormControl(''),
    speciesId: new FormControl(''),
    speciesType: new FormControl(''),
    concentrationDoseRangeStart: new FormControl(''),
    concentrationDoseRangeEnd: new FormControl(''),
    defaultDoseRangeStart: new FormControl(''),
    defaultDoseRangeEnd: new FormControl(''),
    administrationMethodId: new FormControl(''),
    frequencyType: new FormControl(''),
    frequencyX: new FormControl(''),
    frequencyY: new FormControl(''),
    frequency: new FormControl(''),
    notes: new FormControl(''),
  });

  constructor(private store: Store) {
    this.medications$ = this.store.select(selectMedications);
    this.species$ = this.store.select(selectSpecies);
    this.administrationMethods$ = this.store.select(
      selectAdministrationMethods,
    );
  }

  convertSpecies(species: Species[]) {
    return species.map((x) => ({ id: x.id, display: x.name }));
  }

  convertMethods(methods: AdministrationMethod[]) {
    return methods.map((x) => ({
      id: x.id,
      display: `${x.description} (${x.code})`,
    }));
  }

  getSpeciesType = getSpeciesType;

  getTotalRows(medication: Medication) {
    return medication.concentrations
      .map((x) => this.groupMedicationDoses(x.speciesDoses).length)
      .reduce((a, b) => a + b, 0);
  }

  formatBrands(medication: Medication) {
    return medication.brands.map((x) => x).join(', ');
  }

  cancel() {
    this.addMedication = false;
    this.editMedication = null;
    this.addMedicationConcentration = null;
    this.editMedicationConcentration = null;
    this.addMedicationConcentrationSpeciesDose = null;
    this.editMedicationConcentrationSpeciesDose = null;
    this.medicationForm.reset();
    this.medicationConcentrationForm.reset();
    this.medicationConcentrationSpeciesDoseForm.reset();
  }

  prepareAddMedication() {
    this.addMedication = true;
    window.scroll(0, 0);
  }

  prepareAddMedicationConcentration(medication: Medication) {
    this.addMedicationConcentration = medication;
    window.scroll(0, 0);
  }

  prepareAddMedicationConcentrationSpeciesDose(
    concentration: MedicationConcentration,
  ) {
    this.addMedicationConcentrationSpeciesDose = concentration;
    window.scroll(0, 0);
  }

  prepareEditMedication(medication: Medication) {
    this.addMedication = true;
    this.editMedication = medication.id;
    this.medicationForm.patchValue({
      activeSubstance: medication.activeSubstance,
      brands: medication.brands.join(', '),
      notes: medication.notes,
    });
    window.scroll(0, 0);
  }

  prepareEditMedicationConcentration(
    medication: Medication,
    concentration: MedicationConcentration,
  ) {
    this.addMedicationConcentration = medication;
    this.editMedicationConcentration = concentration;
    this.medicationConcentrationForm.patchValue({
      form: concentration.form,
      concentrationValue: concentration.concentrationValue.toString(),
      defaultUnit: concentration.defaultUnit,
    });
    window.scroll(0, 0);
  }

  prepareEditMedicationConcentrationSpeciesDose(
    concentration: MedicationConcentration,
    dose: MedicationConcentrationSpeciesDose,
  ) {
    this.addMedicationConcentrationSpeciesDose = concentration;
    this.editMedicationConcentrationSpeciesDose = dose;
    let frequencyType = '',
      frequencyX = '',
      frequencyY = '';
    if (dose.frequency === 'One time') {
      frequencyType = 'once';
    } else {
      frequencyType = dose.frequency.startsWith('Every') ? 'interval' : 'rate';
      const split = dose.frequency
        .replace('Every ', '')
        .replace('times per ', '')
        .split(' ');
      frequencyX = split[0];
      frequencyY = split[1];
    }
    console.log({ frequencyType, frequencyX, frequencyY });
    this.medicationConcentrationSpeciesDoseForm.patchValue({
      doseFor: dose.species ? 'SID' : 'STYPE',
      speciesId: dose.species ? dose.species.id.toString() : null,
      speciesType: dose.speciesType ? dose.speciesType.toString() : null,
      concentrationDoseRangeStart: dose.concentrationDoseRangeStart.toString(),
      concentrationDoseRangeEnd: dose.concentrationDoseRangeEnd.toString(),
      defaultDoseRangeStart: dose.defaultDoseRangeEnd.toString(),
      defaultDoseRangeEnd: dose.defaultDoseRangeEnd.toString(),
      administrationMethodId: dose.administrationMethod
        ? dose.administrationMethod.id.toString()
        : null,
      frequency: dose.frequency,
      frequencyType,
      frequencyX,
      frequencyY,
      notes: dose.notes,
    });
    window.scroll(0, 0);
  }

  saveMedication() {
    this.store.dispatch(
      upsertMedication({
        id: this.editMedication || undefined,
        activeSubstance: this.medicationForm.value.activeSubstance!,
        brands: this.medicationForm.value.brands!.split(','),
        notes: this.medicationForm.value.notes || '',
      }),
    );
    this.cancel();
  }

  saveMedicationConcentration() {
    this.store.dispatch(
      upsertMedicationConcentration({
        id: this.editMedicationConcentration?.id || undefined,
        medicationId: this.addMedicationConcentration!.id,
        form: this.medicationConcentrationForm.value.form!,
        concentrationValue: Number(
          this.medicationConcentrationForm.value.concentrationValue,
        ),
        concentrationUnit:
          'mg/' + this.medicationConcentrationForm.value.defaultUnit!,
        defaultUnit: this.medicationConcentrationForm.value.defaultUnit!,
      }),
    );
    this.cancel();
  }

  saveMedicationConcentrationSpeciesDose() {
    console.log(this.medicationConcentrationSpeciesDoseForm.value);
    this.store.dispatch(
      upsertMedicationConcentrationSpeciesDose({
        id: this.editMedicationConcentrationSpeciesDose?.id || undefined,
        medicationConcentrationId:
          this.addMedicationConcentrationSpeciesDose!.id,
        speciesId: this.medicationConcentrationSpeciesDoseForm.value.speciesId
          ? Number(this.medicationConcentrationSpeciesDoseForm.value.speciesId)
          : null,
        speciesType: this.medicationConcentrationSpeciesDoseForm.value
          .speciesType
          ? Number(
              this.medicationConcentrationSpeciesDoseForm.value.speciesType,
            )
          : null,
        concentrationDoseRangeStart: Number(
          this.medicationConcentrationSpeciesDoseForm.value
            .concentrationDoseRangeStart,
        ),
        concentrationDoseRangeEnd: Number(
          this.medicationConcentrationSpeciesDoseForm.value
            .concentrationDoseRangeEnd,
        ),
        defaultDoseRangeStart: Number(
          this.medicationConcentrationSpeciesDoseForm.value
            .defaultDoseRangeStart,
        ),
        defaultDoseRangeEnd: Number(
          this.medicationConcentrationSpeciesDoseForm.value.defaultDoseRangeEnd,
        ),
        administrationMethodId: Number(
          this.medicationConcentrationSpeciesDoseForm.value
            .administrationMethodId,
        ),
        frequency: this.medicationConcentrationSpeciesDoseForm.value.frequency!,
        notes: this.medicationConcentrationSpeciesDoseForm.value.notes || '',
      }),
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getMedications());
    this.store.dispatch(getSpecies());
    this.store.dispatch(getAdministrationMethods());
  }

  SpeciesType = SpeciesType;
  private getGroupKey(item: MedicationConcentrationSpeciesDose): string {
    return [
      item.concentrationDoseRangeStart,
      item.concentrationDoseRangeEnd,
      item.defaultDoseRangeStart,
      item.defaultDoseRangeEnd,
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
          concentrationDoseRangeStart: item.concentrationDoseRangeStart,
          concentrationDoseRangeEnd: item.concentrationDoseRangeEnd,
          defaultDoseRangeStart: item.defaultDoseRangeStart,
          defaultDoseRangeEnd: item.defaultDoseRangeEnd,
          administrationMethod: item.administrationMethod,
          frequency: item.frequency,
          notes: item.notes,
        });
      }

      const group = map.get(key)!;

      group.key = key;

      if (item.species) {
        group.species.push({
          display: item.species.name,
          item,
        });
      }

      if (item.speciesType) {
        group.species.push({
          display: getSpeciesType(item.speciesType),
          item,
        });
      }

      group.species.sort();
    }

    return Array.from(map.values());
  }
}

interface MedicationConcentrationSpeciesDoses {
  key: string;
  species: {
    display: string;
    item: MedicationConcentrationSpeciesDose;
  }[];
  concentrationDoseRangeStart: number;
  concentrationDoseRangeEnd: number;
  defaultDoseRangeStart: number;
  defaultDoseRangeEnd: number;
  administrationMethod: AdministrationMethod;
  frequency: string;
  notes: string;
}
