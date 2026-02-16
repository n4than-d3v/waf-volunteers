import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../shared/spinner/component';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  clockIn,
  clockOut,
  getClockingRota,
  visitorClockIn,
  visitorClockOut,
} from './actions';
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

  viewingReport = false;

  visitor = false;
  visitorName = '';
  visitorCar = '';

  selectedVolunteer: Volunteer | null = null;
  clockingOut = false;
  enteringCustomCar = false;
  customCar = '';
  cars: string[] | null = null;

  constructor(private store: Store) {
    this.rota$ = this.store.select(selectClockingRota);
    this.loading$ = this.store.select(selectClockingLoading);
    this.error$ = this.store.select(selectClockingError);
  }

  getTrackingKey(volunteer: Volunteer) {
    if (volunteer.attendanceId) return 'A' + volunteer.attendanceId;
    if (volunteer.visitorId) return 'V' + volunteer.visitorId;
    return volunteer.fullName;
  }

  isAnyoneSupposedToCome(shift: ClockingRota) {
    return shift.volunteers.some((x) => x.confirmed);
  }

  isAnyoneHere(shift: ClockingRota) {
    return shift.volunteers.some((x) => x.in && !x.out);
  }

  isAnyoneNotHere(shift: ClockingRota) {
    return shift.volunteers.some((x) => x.confirmed && !x.in);
  }

  isAnyoneNotComing(shift: ClockingRota) {
    return shift.volunteers.some((x) => x.confirmed === false);
  }

  isAnyoneNotConfirmed(shift: ClockingRota) {
    return shift.volunteers.some((x) => x.confirmed === null);
  }

  getNotComing(shift: ClockingRota) {
    return shift.volunteers
      .filter((x) => x.confirmed === false)
      .map((x) => x.fullName)
      .join(', ');
  }

  getNotConfirmed(shift: ClockingRota) {
    return shift.volunteers
      .filter((x) => x.confirmed === null)
      .map((x) => x.fullName)
      .join(', ');
  }

  hasAnyoneLeft(shift: ClockingRota) {
    return shift.volunteers.some((x) => x.out);
  }

  hasEveryoneLeft(shift: ClockingRota) {
    const confirmed = shift.volunteers.filter((x) => x.confirmed).length;
    const left = shift.volunteers.filter((x) => x.out).length;
    return confirmed === left;
  }

  ngOnInit() {
    this.date = new Date().toString();
    this.store.dispatch(getClockingRota({}));
  }

  showCars(volunteer: Volunteer) {
    this.selectedVolunteer = volunteer;
    this.cars = volunteer.cars;
    this.enteringCustomCar = false;
  }

  reset() {
    this.selectedVolunteer = null;
    this.enteringCustomCar = false;
    this.customCar = '';
    this.cars = null;
    this.clockingOut = false;
    this.visitor = false;
    this.visitorName = '';
    this.visitorCar = '';
  }

  clockInVisitor() {
    if (!this.visitorName) return;
    this.store.dispatch(
      visitorClockIn({
        name: this.visitorName,
        car: this.visitorCar || '',
      }),
    );
    this.reset();
  }

  clockIn(volunteer: Volunteer, car: string | null) {
    this.store.dispatch(
      clockIn({
        attendanceId: volunteer.attendanceId!,
        car: car || '',
      }),
    );
    this.reset();
  }

  clockOut(volunteer: Volunteer) {
    if (volunteer.attendanceId) {
      this.store.dispatch(
        clockOut({
          attendanceId: volunteer.attendanceId,
        }),
      );
    } else if (volunteer.visitorId) {
      this.store.dispatch(
        visitorClockOut({
          id: volunteer.visitorId,
        }),
      );
    }
    this.selectedVolunteer = volunteer;
    this.clockingOut = true;
    setTimeout(() => {
      this.reset();
    }, 5_000);
  }
}
