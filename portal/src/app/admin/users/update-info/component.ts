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
  selectProfile,
  selectProfiles,
  selectProfilesError,
  selectProfilesLoading,
  selectProfileUpdateSuccess,
} from '../selectors';
import {
  homeCarerPermissionList,
  HomeCarerPermissions,
  roleList,
  Roles,
  Status,
} from '../../../shared/token.provider';
import { getUser, getUsers, updateUser } from '../actions';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Profile } from '../state';
import {
  BeaconForm,
  createBeaconForm,
  getBeaconInfo,
} from '../../../shared/beacon/types';
import { BeaconInfoComponent } from '../../../shared/beacon/component';

@Component({
  selector: 'admin-users-update-info',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    SpinnerComponent,
    RouterLink,
    CommonModule,
    BeaconInfoComponent,
  ],
})
export class AdminUsersUpdateInfoComponent implements OnDestroy {
  userId: number = 0;

  roles = roleList;
  homeCarerPermissions = homeCarerPermissionList;

  loading$: Observable<boolean>;
  updated$: Observable<boolean>;
  error$: Observable<boolean>;

  subscription: Subscription | null = null;

  profile: Profile | null = null;
  beaconForm: BeaconForm;

  editing = '';

  form = new FormGroup({
    username: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    cars: new FormArray<FormControl<string | null>>([]),
    status: new FormControl(-1),
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
      BEACON_HOUSE_KEEPER: new FormControl(false),
      APP_ADMIN: new FormControl(false),
      APP_CLOCKING: new FormControl(false),
      APP_BOARDS: new FormControl(false),
    }),
    homeCarerPermissions: new FormGroup({
      Foxes: new FormControl(false),
      Badgers: new FormControl(false),
      Pigeons: new FormControl(false),
      Doves: new FormControl(false),
      GardenBirds: new FormControl(false),
      Rodents: new FormControl(false),
      Hedgehogs: new FormControl(false),
      Rabbits: new FormControl(false),
    }),
  });

  constructor(
    private store: Store,
    route: ActivatedRoute,
  ) {
    this.loading$ = this.store.select(selectProfilesLoading);
    this.updated$ = this.store.select(selectProfileUpdateSuccess);
    this.error$ = this.store.select(selectProfilesError);
    this.beaconForm = createBeaconForm();
    route.params.subscribe((params) => {
      this.userId = Number(params['userId'] || 0);
      this.store.dispatch(
        getUser({
          id: this.userId,
        }),
      );
    });
    this.subscription = this.store
      .select(selectProfile)
      .subscribe((profile) => {
        if (!profile) return;
        this.profile = profile;
        this.form.controls.cars.clear();
        (profile.cars || []).forEach((car) => {
          this.form.controls.cars.push(new FormControl(car));
        });
        this.form.patchValue({
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          cars: profile.cars,
          status: profile.status,
          roles: {
            BEACON_ANIMAL_HUSBANDRY: !!(
              profile.roles & Roles.BEACON_ANIMAL_HUSBANDRY
            ),
            BEACON_RECEPTIONIST: !!(profile.roles & Roles.BEACON_RECEPTIONIST),
            BEACON_TEAM_LEADER: !!(profile.roles & Roles.BEACON_TEAM_LEADER),
            BEACON_VET: !!(profile.roles & Roles.BEACON_VET),
            BEACON_VET_NURSE: !!(profile.roles & Roles.BEACON_VET_NURSE),
            BEACON_AUXILIARY: !!(profile.roles & Roles.BEACON_AUXILIARY),
            BEACON_WORK_EXPERIENCE: !!(
              profile.roles & Roles.BEACON_WORK_EXPERIENCE
            ),
            BEACON_ORPHAN_FEEDER: !!(
              profile.roles & Roles.BEACON_ORPHAN_FEEDER
            ),
            BEACON_RESCUER: !!(profile.roles & Roles.BEACON_RESCUER),
            BEACON_CENTRE_MAINTENANCE: !!(
              profile.roles & Roles.BEACON_CENTRE_MAINTENANCE
            ),
            BEACON_OFFICE_ADMIN: !!(profile.roles & Roles.BEACON_OFFICE_ADMIN),
            BEACON_HOUSE_KEEPER: !!(profile.roles & Roles.BEACON_HOUSE_KEEPER),
            APP_ADMIN: !!(profile.roles & Roles.APP_ADMIN),
            APP_CLOCKING: !!(profile.roles & Roles.APP_CLOCKING),
            APP_BOARDS: !!(profile.roles & Roles.APP_BOARDS),
          },
          homeCarerPermissions: {
            Foxes: !!(
              profile.homeCarerPermissions & HomeCarerPermissions.Foxes
            ),
            Badgers: !!(
              profile.homeCarerPermissions & HomeCarerPermissions.Badgers
            ),
            Pigeons: !!(
              profile.homeCarerPermissions & HomeCarerPermissions.Pigeons
            ),
            Doves: !!(
              profile.homeCarerPermissions & HomeCarerPermissions.Doves
            ),
            GardenBirds: !!(
              profile.homeCarerPermissions & HomeCarerPermissions.GardenBirds
            ),
            Rodents: !!(
              profile.homeCarerPermissions & HomeCarerPermissions.Rodents
            ),
            Hedgehogs: !!(
              profile.homeCarerPermissions & HomeCarerPermissions.Hedgehogs
            ),
            Rabbits: !!(
              profile.homeCarerPermissions & HomeCarerPermissions.Rabbits
            ),
          },
        });
      });
  }

  addCar() {
    this.form.controls.cars.push(new FormControl(''));
  }

  removeCar(index: number) {
    this.form.controls.cars.removeAt(index);
  }

  save() {
    window.scrollTo(0, 0);
    this.store.dispatch(
      updateUser({
        user: {
          id: this.userId,
          username: '', // Not updated
          firstName: this.form.controls.firstName.value || '',
          lastName: this.form.controls.lastName.value || '',
          email: this.form.controls.email.value || '',
          beaconInfo: getBeaconInfo(this.beaconForm),
          cars: (
            this.form.controls.cars.controls.map((c) => c.value || '') || []
          ).filter((x) => !!x),
          status: this.form.controls.status.value!,
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
            (this.form.controls.roles.controls.BEACON_HOUSE_KEEPER.value
              ? Roles.BEACON_HOUSE_KEEPER
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
          homeCarerPermissions:
            (this.form.controls.homeCarerPermissions.controls.Foxes.value
              ? HomeCarerPermissions.Foxes
              : 0) |
            (this.form.controls.homeCarerPermissions.controls.Badgers.value
              ? HomeCarerPermissions.Badgers
              : 0) |
            (this.form.controls.homeCarerPermissions.controls.Pigeons.value
              ? HomeCarerPermissions.Pigeons
              : 0) |
            (this.form.controls.homeCarerPermissions.controls.Doves.value
              ? HomeCarerPermissions.Doves
              : 0) |
            (this.form.controls.homeCarerPermissions.controls.GardenBirds.value
              ? HomeCarerPermissions.GardenBirds
              : 0) |
            (this.form.controls.homeCarerPermissions.controls.Rodents.value
              ? HomeCarerPermissions.Rodents
              : 0) |
            (this.form.controls.homeCarerPermissions.controls.Hedgehogs.value
              ? HomeCarerPermissions.Hedgehogs
              : 0) |
            (this.form.controls.homeCarerPermissions.controls.Rabbits.value
              ? HomeCarerPermissions.Rabbits
              : 0),
        },
      }),
    );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
