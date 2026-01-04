import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  Species,
  SpeciesAge,
  SpeciesVariant,
  UpdateSpeciesAgeCommand,
  UpdateSpeciesCommand,
  UpdateSpeciesVariantCommand,
  Wrapper,
} from '../state';
import { Store } from '@ngrx/store';
import { selectSpecies } from '../selectors';
import {
  createSpecies,
  createSpeciesAge,
  createSpeciesVariant,
  getSpecies,
  updateSpecies,
  updateSpeciesAge,
  updateSpeciesVariant,
} from '../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import {
  Editor,
  NgxEditorComponent,
  NgxEditorMenuComponent,
  toDoc,
  toHTML,
  Toolbar,
} from 'ngx-editor';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'admin-hospital-species',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    RouterLink,
    AsyncPipe,
    SpinnerComponent,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminHospitalSpeciesComponent implements OnInit {
  species$: Observable<Wrapper<Species>>;

  creatingSpecies = false;
  creatingSpeciesAge: Species | null = null;
  creatingSpeciesVariant: Species | null = null;
  updatingSpecies: Species | null = null;
  updatingSpeciesAge: SpeciesAge | null = null;
  updatingSpeciesVariant: SpeciesVariant | null = null;
  updatingSpeciesId: number | null = null;
  selectableVariants: { id: number; name: string }[] = [];

  speciesForm = new FormGroup({
    name: new FormControl(''),
  });
  speciesAgeForm = new FormGroup({
    name: new FormControl(''),
    associatedVariantId: new FormControl(''),
  });
  speciesVariantForm = new FormGroup({
    name: new FormControl(''),
    feedingGuidance: new FormControl(''),
  });

  editor: Editor | null = null;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['bullet_list', 'ordered_list'],
    ['text_color', 'background_color'],
    ['link', 'image'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private store: Store, private sanitizer: DomSanitizer) {
    this.species$ = this.store.select(selectSpecies);
  }

  beginCreateSpecies() {
    this.cancel(false);
    this.creatingSpecies = true;
    this.editor = new Editor();
  }

  beginCreateSpeciesAge(species: Species) {
    this.cancel(false);
    this.creatingSpeciesAge = species;
    this.selectableVariants = species.variants;
    this.editor = new Editor();
  }

  beginCreateSpeciesVariant(species: Species) {
    this.cancel(false);
    this.creatingSpeciesVariant = species;
    this.editor = new Editor();
  }

  beginUpdateSpecies(species: Species) {
    this.cancel(false);
    this.updatingSpecies = species;
    this.updatingSpeciesId = species.id;
    this.speciesForm.controls.name.setValue(species.name);
    this.editor = new Editor();
  }

  beginUpdateSpeciesAge(age: SpeciesAge, species: Species) {
    this.cancel(false);
    this.updatingSpeciesAge = age;
    this.selectableVariants = species.variants;
    this.updatingSpeciesId = species.id;
    this.speciesAgeForm.controls.name.setValue(age.name);
    this.speciesAgeForm.controls.associatedVariantId.setValue(
      `${age.associatedVariant.id}`
    );
    this.editor = new Editor();
  }

  beginUpdateSpeciesVariant(variant: SpeciesVariant, species: Species) {
    this.cancel(false);
    this.updatingSpeciesVariant = variant;
    this.updatingSpeciesId = species.id;
    this.speciesVariantForm.controls.name.setValue(variant.name);
    this.speciesVariantForm.controls.feedingGuidance.setValue(
      toHTML(JSON.parse(variant.feedingGuidance))
    );
    this.editor = new Editor();
  }

  cancel(fullReset = true) {
    this.creatingSpecies = false;
    this.creatingSpeciesAge = null;
    this.creatingSpeciesVariant = null;
    this.updatingSpecies = null;
    this.updatingSpeciesAge = null;
    this.updatingSpeciesVariant = null;
    if (fullReset) {
      this.speciesForm.reset();
      this.speciesAgeForm.reset();
      this.speciesVariantForm.reset();
      this.editor?.destroy();
      this.editor = null;
    }
  }

  convertHtml(json: string) {
    return this.sanitizer.bypassSecurityTrustHtml(toHTML(JSON.parse(json)));
  }

  createSpecies() {
    this.store.dispatch(
      createSpecies({
        species: {
          name: this.speciesForm.controls.name.value || '',
        },
      })
    );
    this.cancel();
  }

  createSpeciesAge() {
    this.store.dispatch(
      createSpeciesAge({
        age: {
          speciesId: this.creatingSpeciesAge!.id,
          name: this.speciesAgeForm.controls.name.value || '',
          associatedVariantId: Number(
            this.speciesAgeForm.controls.associatedVariantId.value
          ),
        },
      })
    );
    this.cancel();
  }

  createSpeciesVariant() {
    const htmlContent =
      this.speciesVariantForm.controls.feedingGuidance.value || '';
    const jsonDoc = toDoc(htmlContent);
    this.store.dispatch(
      createSpeciesVariant({
        variant: {
          speciesId: this.creatingSpeciesVariant!.id,
          name: this.speciesVariantForm.controls.name.value || '',
          feedingGuidance: JSON.stringify(jsonDoc),
        },
      })
    );
    this.cancel();
  }

  updateSpecies() {
    this.store.dispatch(
      updateSpecies({
        species: {
          id: this.updatingSpecies!.id,
          name: this.speciesForm.controls.name.value || '',
        },
      })
    );
    this.cancel();
  }

  updateSpeciesAge() {
    this.store.dispatch(
      updateSpeciesAge({
        age: {
          id: this.updatingSpeciesAge!.id,
          speciesId: this.updatingSpeciesId!,
          name: this.speciesAgeForm.controls.name.value || '',
          associatedVariantId: Number(
            this.speciesAgeForm.controls.associatedVariantId.value
          ),
        },
      })
    );
    this.cancel();
  }

  updateSpeciesVariant() {
    const htmlContent =
      this.speciesVariantForm.controls.feedingGuidance.value || '';
    const jsonDoc = toDoc(htmlContent);
    this.store.dispatch(
      updateSpeciesVariant({
        variant: {
          id: this.updatingSpeciesVariant!.id,
          speciesId: this.updatingSpeciesId!,
          name: this.speciesVariantForm.controls.name.value || '',
          feedingGuidance: JSON.stringify(jsonDoc),
        },
      })
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getSpecies());
  }
}
