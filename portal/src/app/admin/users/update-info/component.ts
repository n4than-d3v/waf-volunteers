import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import {
  selectProfiles,
  selectProfilesError,
  selectProfilesLoading,
  selectProfileUpdateSuccess,
} from '../selectors';
import { Roles, Status } from '../../../shared/token.provider';
import { getUsers, updateUser } from '../actions';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'admin-users-update-info',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, ReactiveFormsModule, SpinnerComponent, RouterLink],
})
export class AdminUsersUpdateInfoComponent implements OnInit, OnDestroy {
  userId: number = 0;

  loading$: Observable<boolean>;
  updated$: Observable<boolean>;
  error$: Observable<boolean>;

  subscription: Subscription | null = null;

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
    status: new FormControl(-1),
    roleVolunteer: new FormControl(false),
    roleReception: new FormControl(false),
    roleTeamLeader: new FormControl(false),
    roleVet: new FormControl(false),
    roleAdmin: new FormControl(false),
  });

  constructor(private store: Store, route: ActivatedRoute) {
    this.loading$ = this.store.select(selectProfilesLoading);
    this.updated$ = this.store.select(selectProfileUpdateSuccess);
    this.error$ = this.store.select(selectProfilesError);
    route.params.subscribe((params) => {
      this.userId = Number(params['userId'] || 0);
    });
    this.subscription = this.store
      .select(selectProfiles)
      .subscribe((profiles) => {
        if (!profiles) return;
        const profile = profiles.find((p) => p.id === this.userId);
        if (!profile) return;
        this.form.patchValue({
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          lineOne: profile.address.lineOne,
          lineTwo: profile.address.lineTwo,
          city: profile.address.city,
          county: profile.address.county,
          postcode: profile.address.postcode,
          status: profile.status,
          roleVolunteer: !!(profile.roles & Roles.Volunteer),
          roleReception: !!(profile.roles & Roles.Reception),
          roleTeamLeader: !!(profile.roles & Roles.TeamLeader),
          roleVet: !!(profile.roles & Roles.Vet),
          roleAdmin: !!(profile.roles & Roles.Admin),
        });
      });
  }

  save() {
    window.scrollTo(0, 0);
    console.log(this.form);
    this.store.dispatch(
      updateUser({
        user: {
          id: this.userId,
          username: '', // Not updated
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
          status: this.form.controls.status.value!,
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

  ngOnInit() {
    this.store.dispatch(getUsers());
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
