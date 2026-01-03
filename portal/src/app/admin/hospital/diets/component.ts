import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Diet, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectDiets } from '../selectors';
import { createDiet, getDiets, updateDiet } from '../actions';
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
  selector: 'admin-hospital-diets',
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
export class AdminHospitalDietsComponent implements OnInit {
  diets$: Observable<Wrapper<Diet>>;

  creating = false;
  updating = false;
  updatingDiet: Diet | null = null;

  form = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
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
    this.diets$ = this.store.select(selectDiets);
  }

  beginCreate() {
    this.updating = false;
    this.creating = true;
    this.editor = new Editor();
  }

  beginUpdate(diet: Diet) {
    this.creating = false;
    this.updating = true;
    this.updatingDiet = diet;
    this.form.controls.name.setValue(diet.name);
    this.form.controls.description.setValue(
      toHTML(JSON.parse(diet.description))
    );
    this.editor = new Editor();
  }

  cancel() {
    this.creating = false;
    this.updating = false;
    this.updatingDiet = null;
    this.form.reset();
    this.editor?.destroy();
    this.editor = null;
  }

  convertHtml(json: string) {
    return this.sanitizer.bypassSecurityTrustHtml(toHTML(JSON.parse(json)));
  }

  create() {
    const htmlContent = this.form.controls.description.value || '';
    const jsonDoc = toDoc(htmlContent);
    this.store.dispatch(
      createDiet({
        diet: {
          name: this.form.controls.name.value || '',
          description: JSON.stringify(jsonDoc),
        },
      })
    );
    this.cancel();
  }

  update() {
    const htmlContent = this.form.controls.description.value || '';
    const jsonDoc = toDoc(htmlContent);
    this.store.dispatch(
      updateDiet({
        diet: {
          id: this.updatingDiet!.id,
          name: this.form.controls.name.value || '',
          description: JSON.stringify(jsonDoc),
        },
      })
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getDiets());
  }
}
