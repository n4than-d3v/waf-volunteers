import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../shared/spinner/component';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { clockIn, clockOut, getClockingRota } from './actions';
import { Observable } from 'rxjs';
import { ClockingRota, Volunteer } from './state';
import {
  selectClockingError,
  selectClockingLoading,
  selectClockingRota,
} from './selectors';
import { DayPipe } from '../volunteer/rota/day.pipe';

@Component({
  selector: 'clocking',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    DayPipe,
    ReactiveFormsModule,
    SpinnerComponent,
    FormsModule,
  ],
})
export class ClockingComponent implements OnInit {
  rota$: Observable<ClockingRota[]>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  date: string = new Date().toString();

  selectedVolunteer: Volunteer | null = null;
  enteringCustomCar = false;
  customCar = '';
  cars: string[] | null = null;

  constructor(private store: Store) {
    this.rota$ = this.store.select(selectClockingRota);
    this.loading$ = this.store.select(selectClockingLoading);
    this.error$ = this.store.select(selectClockingError);
  }

  ngOnInit() {
    this.date = new Date().toString();
    this.store.dispatch(getClockingRota());
  }

  showCars(volunteer: Volunteer) {
    this.selectedVolunteer = volunteer;
    this.cars = volunteer.cars;
    this.enteringCustomCar = false;
  }

  clockIn(volunteer: Volunteer, car: string | null) {
    this.store.dispatch(
      clockIn({
        attendanceId: volunteer.attendanceId,
        car: car || '',
      })
    );
  }

  clockOut(volunteer: Volunteer) {
    this.store.dispatch(
      clockOut({
        attendanceId: volunteer.attendanceId,
      })
    );
  }
}
