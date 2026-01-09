import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { DispositionReason, Tag, Wrapper } from '../state';
import { Store } from '@ngrx/store';
import { selectDispositionReasons } from '../selectors';
import {
  createDispositionReason,
  getDispositionReasons,
  updateDispositionReason,
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
  selector: 'admin-hospital-disposition-reasons',
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
export class AdminHospitalDispositionReasonsComponent implements OnInit {
  dispositionReasons$: Observable<Wrapper<DispositionReason>>;

  creating = false;
  updating = false;
  updatingDispositionReason: DispositionReason | null = null;

  form = new FormGroup({
    description: new FormControl(''),
    communication: new FormControl(''),
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
    this.dispositionReasons$ = this.store.select(selectDispositionReasons);
  }

  beginCreate() {
    this.updating = false;
    this.creating = true;
    this.editor = new Editor();
  }

  beginUpdate(dispositionReason: DispositionReason) {
    this.creating = false;
    this.updating = true;
    this.updatingDispositionReason = dispositionReason;
    this.form.controls.description.setValue(dispositionReason.description);
    this.form.controls.communication.setValue(dispositionReason.communication);
    this.editor = new Editor();
  }

  cancel() {
    this.creating = false;
    this.updating = false;
    this.updatingDispositionReason = null;
    this.form.reset();
    this.editor?.destroy();
    this.editor = null;
  }

  create() {
    const htmlContent = this.form.controls.communication.value || '';
    this.store.dispatch(
      createDispositionReason({
        dispositionReason: {
          description: this.form.controls.description.value || '',
          communication: htmlContent,
        },
      })
    );
    this.cancel();
  }

  update() {
    const htmlContent = this.form.controls.communication.value || '';
    this.store.dispatch(
      updateDispositionReason({
        dispositionReason: {
          id: this.updatingDispositionReason!.id,
          description: this.form.controls.description.value || '',
          communication: htmlContent,
        },
      })
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getDispositionReasons());
  }
}
