import { AsyncPipe } from '@angular/common';
import { Component, OnInit, Pipe } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAuxDevTasks, upsertAuxDevTask } from '../actions';
import { TokenProvider } from '../../../shared/token.provider';
import { Observable } from 'rxjs';
import { AuxDevTask } from '../state';
import { selectAuxDevTasks } from '../selectors';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Editor,
  NgxEditorComponent,
  NgxEditorMenuComponent,
  toDoc,
  toHTML,
  Toolbar,
} from 'ngx-editor';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Pipe({ name: 'safeYoutube', pure: true })
export class SafeYoutubePipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(id: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}`
    );
  }
}

@Component({
  selector: 'aux-dev-plan-tasks',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SafeYoutubePipe,
    NgxEditorComponent,
    NgxEditorMenuComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class AuxDevPlanTasksComponent implements OnInit {
  tasks$: Observable<AuxDevTask[]>;

  isVet = false;

  adding = false;
  editing: number | null = null;

  attemptedSave = false;

  expanded: number | null = null;

  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    ['bullet_list', 'ordered_list'],
    ['text_color', 'background_color'],
    ['link', 'image'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  taskForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    explanation: new FormControl(''),
    youtube: new FormControl(''),
  });

  constructor(
    private store: Store,
    private tokenProvider: TokenProvider,
    public sanitizer: DomSanitizer
  ) {
    this.tasks$ = this.store.select(selectAuxDevTasks);
    this.editor = new Editor();
  }

  convertHtml(json: string) {
    return this.sanitizer.bypassSecurityTrustHtml(toHTML(JSON.parse(json)));
  }

  prepareEdit(task: AuxDevTask) {
    const html = toHTML(JSON.parse(task.explanation));
    this.taskForm.patchValue({
      name: task.name,
      explanation: html,
      youtube: task.youTube.join(', '),
    });
    this.editing = task.id;
  }

  cancel() {
    this.adding = false;
    this.editing = null;
    this.taskForm.reset();
  }

  upsertTask() {
    this.attemptedSave = true;
    if (!this.taskForm.valid) return;
    const htmlContent = this.taskForm.controls.explanation.value || '';
    const jsonDoc = toDoc(htmlContent);
    this.store.dispatch(
      upsertAuxDevTask({
        id: this.editing ? this.editing : undefined,
        name: this.taskForm.value.name!,
        explanation: JSON.stringify(jsonDoc),
        youtube: (this.taskForm.value.youtube || '')
          .split(',')
          .map((x) => x.trim())
          .filter((x) => !!x),
      })
    );
    this.cancel();
  }

  ngOnInit() {
    this.isVet = this.tokenProvider.isVet() || this.tokenProvider.isAdmin();
    this.store.dispatch(getAuxDevTasks());
  }
}
