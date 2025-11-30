import {
  NgxEditorComponent,
  NgxEditorMenuComponent,
  Editor,
  Toolbar,
  toDoc,
} from 'ngx-editor';
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectNoticeCreated,
  selectNoticesError,
  selectNoticesLoading,
} from '../selectors';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { RouterLink } from '@angular/router';
import { createNotice } from '../actions';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FakePhoneComponent } from '../../../shared/fake-phone/component';

@Component({
  standalone: true,
  selector: 'admin-notice-create',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    RouterLink,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    FormsModule,
    ReactiveFormsModule,
    FakePhoneComponent,
  ],
})
export class AdminNoticeCreateComponent implements OnDestroy {
  created$: Observable<boolean>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  form = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['bullet_list', 'ordered_list'],
    ['text_color', 'background_color'],
    ['link', 'image'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private store: Store, public sanitizer: DomSanitizer) {
    this.created$ = this.store.select(selectNoticeCreated);
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
    this.editor = new Editor();
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }

  create() {
    const htmlContent = this.form.controls.content.value || '';
    const jsonDoc = toDoc(htmlContent);
    this.store.dispatch(
      createNotice({
        title: this.form.controls.title.value || '',
        content: JSON.stringify(jsonDoc),
      })
    );
  }
}
