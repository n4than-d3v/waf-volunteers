import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  Food,
  formatFeeding,
  Species,
  SpeciesType,
  SpeciesVariant,
  Wrapper,
} from '../state';
import { Store } from '@ngrx/store';
import { selectFoods, selectSpecies } from '../selectors';
import {
  createSpecies,
  createSpeciesVariant,
  getFoods,
  getSpecies,
  updateSpecies,
  updateSpeciesVariant,
} from '../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'admin-hospital-species',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    RouterLink,
    AsyncPipe,
    SpinnerComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminHospitalSpeciesComponent implements OnInit {
  foods$: Observable<Wrapper<Food>>;
  species$: Observable<Wrapper<Species>>;

  creatingSpecies = false;
  creatingSpeciesVariant: Species | null = null;
  updatingSpecies: Species | null = null;
  updatingSpeciesVariant: SpeciesVariant | null = null;
  updatingSpeciesId: number | null = null;

  filter = '';

  speciesForm = new FormGroup({
    name: new FormControl(''),
    speciesType: new FormControl(''),
  });

  speciesVariantForm = new FormGroup({
    name: new FormControl(''),
    friendlyName: new FormControl(''),
    order: new FormControl(''),
    longTermDays: new FormControl(''),
    feedingGuidance: new FormArray<
      FormGroup<{
        foodId: FormControl<string | null>;
        time: FormControl<string | null>;
        quantityValue: FormControl<string | null>;
        quantityUnit: FormControl<string | null>;
      }>
    >([]),
  });

  previousScroll = 0;

  constructor(private store: Store) {
    this.foods$ = this.store.select(selectFoods);
    this.species$ = this.store.select(selectSpecies);
  }

  addFeedingGuidance() {
    const formGroup = new FormGroup({
      foodId: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required]),
      quantityValue: new FormControl('', [Validators.required]),
      quantityUnit: new FormControl('', [Validators.required]),
    });
    this.speciesVariantForm.controls.feedingGuidance.push(formGroup);
    return formGroup;
  }

  removeFeedingGuidance(index: number) {
    this.speciesVariantForm.controls.feedingGuidance.removeAt(index);
  }

  shouldShowSpecies(species: Species) {
    return (
      species.name.toLowerCase().includes(this.filter.toLowerCase()) ||
      species.variants.some(
        (variant) =>
          variant.name.toLowerCase().includes(this.filter.toLowerCase()) ||
          variant.friendlyName
            .toLowerCase()
            .includes(this.filter.toLowerCase()),
      )
    );
  }

  beginCreateSpecies() {
    this.cancel(false);
    this.creatingSpecies = true;
  }

  beginCreateSpeciesVariant(species: Species) {
    this.cancel(false);
    this.creatingSpeciesVariant = species;
    this.previousScroll = window.scrollY;
    window.scroll(0, 0);
  }

  beginUpdateSpecies(species: Species) {
    this.cancel(false);
    this.updatingSpecies = species;
    this.updatingSpeciesId = species.id;
    this.speciesForm.controls.name.setValue(species.name);
    this.speciesForm.controls.speciesType.setValue(
      species.speciesType.toString(),
    );
    this.previousScroll = window.scrollY;
    window.scroll(0, 0);
  }

  beginUpdateSpeciesVariant(variant: SpeciesVariant, species: Species) {
    this.cancel(false);

    this.updatingSpeciesVariant = variant;
    this.updatingSpeciesId = species.id;

    this.speciesVariantForm.controls.name.setValue(variant.name);
    this.speciesVariantForm.controls.friendlyName.setValue(
      variant.friendlyName,
    );
    this.speciesVariantForm.controls.order.setValue(variant.order.toString());
    this.speciesVariantForm.controls.longTermDays.setValue(
      variant.longTermDays.toString(),
    );

    this.speciesVariantForm.controls.feedingGuidance.clear();

    if (variant.feedingGuidance?.length) {
      variant.feedingGuidance.forEach((fg) => {
        const formGroup = this.addFeedingGuidance();
        formGroup.controls.foodId.setValue(fg.food.id.toString());
        formGroup.controls.quantityUnit.setValue(fg.quantityUnit);
        formGroup.controls.quantityValue.setValue(fg.quantityValue.toString());
        formGroup.controls.time.setValue(fg.time);
      });
    }

    this.previousScroll = window.scrollY;
    window.scroll(0, 0);
  }

  formatFeedingGuidance = formatFeeding;

  cancel(fullReset = true) {
    this.creatingSpecies = false;
    this.creatingSpeciesVariant = null;
    this.updatingSpecies = null;
    this.updatingSpeciesVariant = null;
    if (fullReset) {
      this.speciesForm.reset();
      this.speciesVariantForm.reset();
      this.speciesVariantForm.controls.feedingGuidance.clear();
      window.scroll(0, this.previousScroll);
    }
  }

  private convertTime(time: string) {
    const timeSplit = time.split(':');
    return `${timeSplit[0]}:${timeSplit[1]}:00`;
  }

  createSpecies() {
    this.store.dispatch(
      createSpecies({
        species: {
          name: this.speciesForm.controls.name.value || '',
          speciesType: Number(this.speciesForm.controls.speciesType.value),
        },
      }),
    );
    this.cancel();
  }

  createSpeciesVariant() {
    this.store.dispatch(
      createSpeciesVariant({
        variant: {
          speciesId: this.creatingSpeciesVariant!.id,
          name: this.speciesVariantForm.controls.name.value || '',
          friendlyName:
            this.speciesVariantForm.controls.friendlyName.value || '',
          order: Number(this.speciesVariantForm.controls.order.value),
          longTermDays: Number(
            this.speciesVariantForm.controls.longTermDays.value,
          ),
          feedingGuidance:
            this.speciesVariantForm.value.feedingGuidance?.map((fg: any) => ({
              foodId: Number(fg.foodId),
              time: this.convertTime(fg.time),
              quantityValue: Number(fg.quantityValue),
              quantityUnit: fg.quantityUnit,
            })) || [],
        },
      }),
    );
    const pscroll = this.previousScroll;
    setTimeout(() => {
      window.scroll(0, pscroll);
      this.previousScroll = pscroll;
    }, 2000);
    this.cancel();
  }

  updateSpecies() {
    this.store.dispatch(
      updateSpecies({
        species: {
          id: this.updatingSpecies!.id,
          name: this.speciesForm.controls.name.value || '',
          speciesType: Number(this.speciesForm.controls.speciesType.value),
        },
      }),
    );
    const pscroll = this.previousScroll;
    setTimeout(() => {
      window.scroll(0, pscroll);
      this.previousScroll = pscroll;
    }, 2000);
    this.cancel();
  }

  updateSpeciesVariant() {
    this.store.dispatch(
      updateSpeciesVariant({
        variant: {
          id: this.updatingSpeciesVariant!.id,
          speciesId: this.updatingSpeciesId!,
          name: this.speciesVariantForm.controls.name.value || '',
          friendlyName:
            this.speciesVariantForm.controls.friendlyName.value || '',
          order: Number(this.speciesVariantForm.controls.order.value),
          longTermDays: Number(
            this.speciesVariantForm.controls.longTermDays.value,
          ),
          feedingGuidance:
            this.speciesVariantForm.value.feedingGuidance?.map((fg: any) => ({
              foodId: Number(fg.foodId),
              time: this.convertTime(fg.time),
              quantityValue: Number(fg.quantityValue),
              quantityUnit: fg.quantityUnit,
            })) || [],
        },
      }),
    );
    const pscroll = this.previousScroll;
    setTimeout(() => {
      window.scroll(0, pscroll);
      this.previousScroll = pscroll;
    }, 2000);
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getFoods());
    this.store.dispatch(getSpecies());
  }

  SpeciesType = SpeciesType;
}
