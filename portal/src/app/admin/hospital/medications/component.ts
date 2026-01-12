import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  getSpeciesType,
  Medication,
  Species,
  SpeciesType,
  Wrapper,
} from '../state';
import { Store } from '@ngrx/store';
import { selectMedications, selectSpecies } from '../selectors';
import {
  createMedication,
  createMedicationConcentration,
  createMedicationConcentrationSpeciesDose,
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
  addMedicationConcentration: number | null = null;
  addMedicationConcentrationSpeciesDose: number | null = null;

  medicationForm = new FormGroup({
    activeSubstance: new FormControl(''),
    brands: new FormControl(''),
    notes: new FormControl(''),
  });

  medicationConcentrationForm = new FormGroup({
    form: new FormControl(''),
    concentrationMgMl: new FormControl(''),
  });

  medicationConcentrationSpeciesDoseForm = new FormGroup({
    doseFor: new FormControl(''),
    speciesId: new FormControl(''),
    speciesType: new FormControl(''),
    doseMgKg: new FormControl(''),
    doseMlKg: new FormControl(''),
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
      selectAdministrationMethods
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
      .map((x) => x.speciesDoses.length)
      .reduce((a, b) => a + b, 0);
  }

  formatBrands(medication: Medication) {
    return medication.brands.map((x) => x).join(', ');
  }

  cancel() {
    this.addMedication = false;
    this.addMedicationConcentration = null;
    this.addMedicationConcentrationSpeciesDose = null;
    this.medicationForm.reset();
    this.medicationConcentrationForm.reset();
    this.medicationConcentrationSpeciesDoseForm.reset();
  }

  saveMedication() {
    this.store.dispatch(
      createMedication({
        activeSubstance: this.medicationForm.value.activeSubstance!,
        brands: this.medicationForm.value.brands!.split(','),
        notes: this.medicationForm.value.notes || '',
      })
    );
    this.cancel();
  }

  saveMedicationConcentration() {
    this.store.dispatch(
      createMedicationConcentration({
        medicationId: this.addMedicationConcentration!,
        form: this.medicationConcentrationForm.value.form!,
        concentrationMgMl: Number(
          this.medicationConcentrationForm.value.concentrationMgMl
        ),
      })
    );
    this.cancel();
  }

  saveMedicationConcentrationSpeciesDose() {
    this.store.dispatch(
      createMedicationConcentrationSpeciesDose({
        medicationConcentrationId: this.addMedicationConcentrationSpeciesDose!,
        speciesId: this.medicationConcentrationSpeciesDoseForm.value.speciesId
          ? Number(this.medicationConcentrationSpeciesDoseForm.value.speciesId)
          : null,
        speciesType: this.medicationConcentrationSpeciesDoseForm.value
          .speciesType
          ? Number(
              this.medicationConcentrationSpeciesDoseForm.value.speciesType
            )
          : null,
        doseMgKg: Number(
          this.medicationConcentrationSpeciesDoseForm.value.doseMgKg
        ),
        doseMlKg: Number(
          this.medicationConcentrationSpeciesDoseForm.value.doseMlKg
        ),
        administrationMethodId: Number(
          this.medicationConcentrationSpeciesDoseForm.value
            .administrationMethodId
        ),
        frequency: this.medicationConcentrationSpeciesDoseForm.value.frequency!,
        notes: this.medicationConcentrationSpeciesDoseForm.value.notes || '',
      })
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getMedications());
    this.store.dispatch(getSpecies());
    this.store.dispatch(getAdministrationMethods());
  }

  SpeciesType = SpeciesType;
}
