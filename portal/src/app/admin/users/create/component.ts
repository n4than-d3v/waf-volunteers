import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import {
  selectProfileCreateSuccess,
  selectProfilesError,
  selectProfilesLoading,
} from '../selectors';
import { roleList, Roles, Status } from '../../../shared/token.provider';
import { createUser } from '../actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-users-create',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    SpinnerComponent,
    RouterLink,
    CommonModule,
  ],
})
export class AdminUsersCreateComponent {
  loading$: Observable<boolean>;
  created$: Observable<string | null>;
  error$: Observable<boolean>;

  roles = roleList;

  form = new FormGroup({
    username: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
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
      APP_CLOCKING: new FormControl(false),
      APP_BOARDS: new FormControl(false),
    }),
  });

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectProfilesLoading);
    this.created$ = this.store.select(selectProfileCreateSuccess);
    this.error$ = this.store.select(selectProfilesError);
  }

  save() {
    window.scrollTo(0, 0);
    this.store.dispatch(
      createUser({
        user: {
          id: -1,
          username: this.form.controls.username.value || '',
          firstName: this.form.controls.firstName.value || '',
          lastName: this.form.controls.lastName.value || '',
          email: this.form.controls.email.value || '',
          status: Status.Active,
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
              : 0) |
            (this.form.controls.roles.controls.APP_CLOCKING.value
              ? Roles.APP_CLOCKING
              : 0) |
            (this.form.controls.roles.controls.APP_BOARDS.value
              ? Roles.APP_BOARDS
              : 0),
        },
      })
    );
  }
}
