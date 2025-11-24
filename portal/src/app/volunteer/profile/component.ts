import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Profile } from './state';
import {
  selectCurrentProfile,
  selectProfileError,
  selectProfileLoading,
  selectProfileUpdateSuccess,
} from './selectors';
import {
  cancelUpdateCurrentProfile,
  getCurrentProfile,
  updateCurrentProfile,
} from './actions';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import { RouterLink } from '@angular/router';
import { BeaconInfoComponent } from '../../shared/beacon/component';
import {
  BeaconForm,
  createBeaconForm,
  getBeaconInfo,
} from '../../shared/beacon/types';

@Component({
  selector: 'volunteer-profile',
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
export class VolunteerProfileComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  updated$: Observable<boolean>;
  error$: Observable<boolean>;

  subscription: Subscription | null = null;

  profile: Profile | null = null;
  beaconForm: BeaconForm;

  editing = '';

  form = new FormGroup({
    cars: new FormArray<FormControl<string | null>>([]),
  });

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectProfileLoading);
    this.updated$ = this.store.select(selectProfileUpdateSuccess);
    this.error$ = this.store.select(selectProfileError);
    this.beaconForm = createBeaconForm();
    this.subscription = this.store
      .select(selectCurrentProfile)
      .subscribe((profile) => {
        if (!profile) return;
        this.profile = profile;
        this.form.controls.cars.clear();
        profile.cars.forEach((car) => {
          this.form.controls.cars.push(new FormControl(car));
        });
        this.form.patchValue({
          cars: profile.cars,
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
      updateCurrentProfile({
        profile: {
          beaconInfo: getBeaconInfo(this.beaconForm),
          cars: (
            this.form.controls.cars.controls.map((c) => c.value || '') || []
          ).filter((x) => !!x),
        },
      })
    );
  }

  ngOnInit() {
    this.store.dispatch(getCurrentProfile());
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    this.store.dispatch(cancelUpdateCurrentProfile());
  }
}
