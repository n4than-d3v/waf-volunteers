import {
  NgxEditorComponent,
  NgxEditorMenuComponent,
  Editor,
  Toolbar,
  toDoc,
  toHTML,
} from 'ngx-editor';
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectNoticeCreated,
  selectNoticesError,
  selectNoticesLoading,
  selectNoticeUpdated,
} from '../selectors';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { createNotice, updateNotice } from '../actions';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FakePhoneComponent } from '../../../shared/fake-phone/component';
import { roleList, Roles } from '../../../shared/token.provider';
import { openNotice } from '../../../volunteer/notices/actions';
import { Notice } from '../../../volunteer/notices/state';
import { selectNotice } from '../../../volunteer/notices/selectors';

@Component({
  standalone: true,
  selector: 'admin-notice-update',
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
export class AdminNoticeUpdateComponent implements OnDestroy {
  roles = roleList;

  id: number = 0;

  updated$: Observable<boolean>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  form = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    files: new FormControl<File[] | null>(null),
    roles: new FormGroup({
      BEACON_ANIMAL_HUSBANDRY: new FormControl(false),
      BEACON_RECEPTIONIST: new FormControl(false),
      BEACON_TEAM_LEADER: new FormControl(false),
      BEACON_VET: new FormControl(false),
      BEACON_VET_NURSE: new FormControl(false),
      BEACON_AUXILIARY: new FormControl(false),
      BEACON_WORK_EXPERIENCE: new FormControl(false),
      BEACON_ORPHAN_FEEDER: new FormControl(false),
      BEACON_RESCUER: new FormControl(false),
      BEACON_CENTRE_MAINTENANCE: new FormControl(false),
      BEACON_OFFICE_ADMIN: new FormControl(false),
      APP_ADMIN: new FormControl(false),
    }),
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

  notice: Notice | null = null;

  constructor(
    private store: Store,
    public sanitizer: DomSanitizer,
    route: ActivatedRoute
  ) {
    this.updated$ = this.store.select(selectNoticeUpdated);
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
    this.store.select(selectNotice).subscribe((notice) => {
      if (!notice) return;
      this.notice = notice;
      this.form.controls.title.setValue(notice.title);
      this.form.controls.content.setValue(toHTML(JSON.parse(notice.content)));
      const roles = notice.roles;
      this.form.controls.roles.controls.BEACON_ANIMAL_HUSBANDRY.setValue(
        (roles & Roles.BEACON_ANIMAL_HUSBANDRY) !== 0
      );
      this.form.controls.roles.controls.BEACON_RECEPTIONIST.setValue(
        (roles & Roles.BEACON_RECEPTIONIST) !== 0
      );
      this.form.controls.roles.controls.BEACON_TEAM_LEADER.setValue(
        (roles & Roles.BEACON_TEAM_LEADER) !== 0
      );
      this.form.controls.roles.controls.BEACON_VET.setValue(
        (roles & Roles.BEACON_VET) !== 0
      );
      this.form.controls.roles.controls.BEACON_VET_NURSE.setValue(
        (roles & Roles.BEACON_VET_NURSE) !== 0
      );
      this.form.controls.roles.controls.BEACON_AUXILIARY.setValue(
        (roles & Roles.BEACON_AUXILIARY) !== 0
      );
      this.form.controls.roles.controls.BEACON_WORK_EXPERIENCE.setValue(
        (roles & Roles.BEACON_WORK_EXPERIENCE) !== 0
      );
      this.form.controls.roles.controls.BEACON_ORPHAN_FEEDER.setValue(
        (roles & Roles.BEACON_ORPHAN_FEEDER) !== 0
      );
      this.form.controls.roles.controls.BEACON_RESCUER.setValue(
        (roles & Roles.BEACON_RESCUER) !== 0
      );
      this.form.controls.roles.controls.BEACON_CENTRE_MAINTENANCE.setValue(
        (roles & Roles.BEACON_CENTRE_MAINTENANCE) !== 0
      );
      this.form.controls.roles.controls.BEACON_OFFICE_ADMIN.setValue(
        (roles & Roles.BEACON_OFFICE_ADMIN) !== 0
      );
      this.form.controls.roles.controls.APP_ADMIN.setValue(
        (roles & Roles.APP_ADMIN) !== 0
      );
    });
    this.editor = new Editor();
    route.params.subscribe((params) => {
      this.id = Number(params['id'] || 0);
      this.store.dispatch(
        openNotice({
          id: this.id,
        })
      );
    });
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    this.form.controls.files.setValue(Array.from(files));
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }

  selectedAllAudience = false;

  selectAllAudience() {
    this.selectedAllAudience = !this.selectedAllAudience;
    this.form.controls.roles.controls.BEACON_ANIMAL_HUSBANDRY.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_RECEPTIONIST.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_TEAM_LEADER.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_VET.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_VET_NURSE.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_AUXILIARY.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_WORK_EXPERIENCE.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_ORPHAN_FEEDER.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_RESCUER.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_CENTRE_MAINTENANCE.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.BEACON_OFFICE_ADMIN.setValue(
      this.selectedAllAudience
    );
    this.form.controls.roles.controls.APP_ADMIN.setValue(
      this.selectedAllAudience
    );
  }

  getNoticeContent() {
    if (!this.form.controls.content.value) return '';
    const html = this.form.controls.content.value || '';
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  update() {
    const htmlContent = this.form.controls.content.value || '';
    const jsonDoc = toDoc(htmlContent);
    this.store.dispatch(
      updateNotice({
        id: this.id,
        title: this.form.controls.title.value || '',
        content: JSON.stringify(jsonDoc),
        files: this.form.controls.files.value ?? [],
        roles:
          (this.form.controls.roles.controls.BEACON_ANIMAL_HUSBANDRY.value
            ? Roles.BEACON_ANIMAL_HUSBANDRY
            : 0) |
          (this.form.controls.roles.controls.BEACON_RECEPTIONIST.value
            ? Roles.BEACON_RECEPTIONIST
            : 0) |
          (this.form.controls.roles.controls.BEACON_TEAM_LEADER.value
            ? Roles.BEACON_TEAM_LEADER
            : 0) |
          (this.form.controls.roles.controls.BEACON_VET.value
            ? Roles.BEACON_VET
            : 0) |
          (this.form.controls.roles.controls.BEACON_VET_NURSE.value
            ? Roles.BEACON_VET_NURSE
            : 0) |
          (this.form.controls.roles.controls.BEACON_AUXILIARY.value
            ? Roles.BEACON_AUXILIARY
            : 0) |
          (this.form.controls.roles.controls.BEACON_WORK_EXPERIENCE.value
            ? Roles.BEACON_WORK_EXPERIENCE
            : 0) |
          (this.form.controls.roles.controls.BEACON_ORPHAN_FEEDER.value
            ? Roles.BEACON_ORPHAN_FEEDER
            : 0) |
          (this.form.controls.roles.controls.BEACON_RESCUER.value
            ? Roles.BEACON_RESCUER
            : 0) |
          (this.form.controls.roles.controls.BEACON_CENTRE_MAINTENANCE.value
            ? Roles.BEACON_CENTRE_MAINTENANCE
            : 0) |
          (this.form.controls.roles.controls.BEACON_OFFICE_ADMIN.value
            ? Roles.BEACON_OFFICE_ADMIN
            : 0) |
          (this.form.controls.roles.controls.APP_ADMIN.value
            ? Roles.APP_ADMIN
            : 0),
      })
    );
  }
}
