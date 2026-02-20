import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  Species,
  SpeciesType,
  SpeciesVariant,
  UpdateSpeciesCommand,
  UpdateSpeciesVariantCommand,
  Wrapper,
} from '../state';
import { Store } from '@ngrx/store';
import { selectSpecies } from '../selectors';
import {
  createSpecies,
  createSpeciesVariant,
  getSpecies,
  updateSpecies,
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
  creatingSpeciesVariant: Species | null = null;
  updatingSpecies: Species | null = null;
  updatingSpeciesVariant: SpeciesVariant | null = null;
  updatingSpeciesId: number | null = null;

  speciesForm = new FormGroup({
    name: new FormControl(''),
    speciesType: new FormControl(''),
  });

  speciesVariantForm = new FormGroup({
    name: new FormControl(''),
    friendlyName: new FormControl(''),
    order: new FormControl(''),
    longTermDays: new FormControl(''),
    feedingGuidance: new FormControl(''),
  });

  previousScroll = 0;

  editor: Editor | null = null;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['bullet_list', 'ordered_list'],
    ['text_color', 'background_color'],
    ['link', 'image'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer,
  ) {
    this.species$ = this.store.select(selectSpecies);
  }

  beginCreateSpecies() {
    this.cancel(false);
    this.creatingSpecies = true;
    this.editor = new Editor();
  }

  beginCreateSpeciesVariant(species: Species) {
    this.cancel(false);
    this.creatingSpeciesVariant = species;
    this.editor = new Editor();
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
    this.editor = new Editor();
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
    this.speciesVariantForm.controls.feedingGuidance.setValue(
      toHTML(JSON.parse(variant.feedingGuidance)),
    );
    this.editor = new Editor();
    this.previousScroll = window.scrollY;
    window.scroll(0, 0);
  }

  cancel(fullReset = true) {
    this.creatingSpecies = false;
    this.creatingSpeciesVariant = null;
    this.updatingSpecies = null;
    this.updatingSpeciesVariant = null;
    if (fullReset) {
      this.speciesForm.reset();
      this.speciesVariantForm.reset();
      this.editor?.destroy();
      this.editor = null;
      window.scroll(0, this.previousScroll);
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
          speciesType: Number(this.speciesForm.controls.speciesType.value),
        },
      }),
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
          friendlyName:
            this.speciesVariantForm.controls.friendlyName.value || '',
          order: Number(this.speciesVariantForm.controls.order.value),
          longTermDays: Number(
            this.speciesVariantForm.controls.longTermDays.value,
          ),
          feedingGuidance: JSON.stringify(jsonDoc),
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
    const htmlContent =
      this.speciesVariantForm.controls.feedingGuidance.value || '';
    const jsonDoc = toDoc(htmlContent);
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
          feedingGuidance: JSON.stringify(jsonDoc),
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
    this.store.dispatch(getSpecies());
  }

  SpeciesType = SpeciesType;
}
