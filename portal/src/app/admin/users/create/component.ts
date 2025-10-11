import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import {
  selectProfileCreateSuccess,
  selectProfilesError,
  selectProfilesLoading,
} from '../selectors';
import { Roles, Status } from '../../../shared/token.provider';
import { createUser } from '../actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-users-create',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, ReactiveFormsModule, SpinnerComponent, RouterLink],
})
export class AdminUsersCreateComponent {
  loading$: Observable<boolean>;
  created$: Observable<boolean>;
  error$: Observable<boolean>;

  form = new FormGroup({
    username: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    lineOne: new FormControl(''),
    lineTwo: new FormControl(''),
    city: new FormControl(''),
    county: new FormControl(''),
    postcode: new FormControl(''),
    roleVolunteer: new FormControl(true),
    roleReception: new FormControl(false),
    roleTeamLeader: new FormControl(false),
    roleVet: new FormControl(false),
    roleAdmin: new FormControl(false),
  });

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectProfilesLoading);
    this.created$ = this.store.select(selectProfileCreateSuccess);
    this.error$ = this.store.select(selectProfilesError);
  }

  save() {
    window.scrollTo(0, 0);
    console.log(this.form);
    this.store.dispatch(
      createUser({
        user: {
          id: -1,
          username: this.form.controls.username.value || '',
          firstName: this.form.controls.firstName.value || '',
          lastName: this.form.controls.lastName.value || '',
          email: this.form.controls.email.value || '',
          phone: this.form.controls.phone.value || '',
          address: {
            lineOne: this.form.controls.lineOne.value || '',
            lineTwo: this.form.controls.lineTwo.value || '',
            city: this.form.controls.city.value || '',
            county: this.form.controls.county.value || '',
            postcode: this.form.controls.postcode.value || '',
          },
          status: Status.Active,
          roles:
            (this.form.controls.roleVolunteer.value ? Roles.Volunteer : 0) |
            (this.form.controls.roleReception.value ? Roles.Reception : 0) |
            (this.form.controls.roleTeamLeader.value ? Roles.TeamLeader : 0) |
            (this.form.controls.roleVet.value ? Roles.Vet : 0) |
            (this.form.controls.roleAdmin.value ? Roles.Admin : 0),
        },
      })
    );
  }
}
