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
  ],
})
export class VolunteerProfileComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  updated$: Observable<boolean>;
  error$: Observable<boolean>;

  subscription: Subscription | null = null;

  form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    lineOne: new FormControl(''),
    lineTwo: new FormControl(''),
    city: new FormControl(''),
    county: new FormControl(''),
    postcode: new FormControl(''),
    cars: new FormArray<FormControl<string | null>>([]),
  });

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectProfileLoading);
    this.updated$ = this.store.select(selectProfileUpdateSuccess);
    this.error$ = this.store.select(selectProfileError);
    this.subscription = this.store
      .select(selectCurrentProfile)
      .subscribe((profile) => {
        if (!profile) return;
        this.form.controls.cars.clear();
        profile.cars.forEach((car) => {
          this.form.controls.cars.push(new FormControl(car));
        });
        this.form.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          lineOne: profile.address.lineOne,
          lineTwo: profile.address.lineTwo,
          city: profile.address.city,
          county: profile.address.county,
          postcode: profile.address.postcode,
          cars: profile.cars,
        });
      });
  }

  addCar() {
    this.form.controls.cars.push(new FormControl(''));
  }

  save() {
    window.scrollTo(0, 0);
    this.store.dispatch(
      updateCurrentProfile({
        profile: {
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
