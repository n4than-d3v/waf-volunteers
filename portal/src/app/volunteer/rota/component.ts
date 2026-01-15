import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Rota, Shift, ShiftType } from './state';
import {
  selectConfirmedShift,
  selectConfirmingShift,
  selectDeniedShift,
  selectDenyingShift,
  selectRota,
  selectRotaError,
  selectRotaLoading,
} from './selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import { confirmShift, denyShift, getRota } from './actions';
import { AdminRotaRegularShiftDayComponent } from '../../admin/rota/regular-shifts/day.component';
import { DayPipe } from './day.pipe';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { daysOfWeek, Time, Wrapper } from '../../admin/rota/state';
import { getTimes } from '../../admin/rota/actions';
import { selectTimes } from '../../admin/rota/selectors';
import moment from 'moment';

@Component({
  selector: 'volunteer-rota',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    AdminRotaRegularShiftDayComponent,
    DatePipe,
    DayPipe,
    FormsModule,
    RouterLink,
  ],
})
export class VolunteerRotaComponent implements OnInit {
  rota$: Observable<Rota>;
  times$: Observable<Wrapper<Time>>;

  ShiftType = ShiftType;

  signingUpExtra = false;
  minDate = moment().toISOString().split('T')[0];
  maxDate = moment().add(35, 'days').toISOString().split('T')[0];
  irregularShiftDate = '';
  irregularShiftTime = '';
  irregularShiftJob = '';

  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  confirming$: Observable<boolean>;
  confirmed$: Observable<boolean>;

  denying$: Observable<boolean>;
  denied$: Observable<boolean>;

  needToChange: Shift | null = null;

  askingWhyDenying: Shift | null = null;
  missingReasonId = -1;
  customMissingReason = '';

  constructor(private store: Store) {
    this.rota$ = this.store.select(selectRota);
    this.times$ = this.store.select(selectTimes);

    this.loading$ = this.store.select(selectRotaLoading);
    this.error$ = this.store.select(selectRotaError);

    this.confirming$ = this.store.select(selectConfirmingShift);
    this.confirmed$ = this.store.select(selectConfirmedShift);

    this.denying$ = this.store.select(selectDenyingShift);
    this.denied$ = this.store.select(selectDeniedShift);
  }

  confirm(shift: Shift, shiftType: ShiftType) {
    this.store.dispatch(
      confirmShift({
        date: shift.date,
        timeId: shift.time.id!,
        jobId: shift.job.id!,
        shiftType,
      })
    );
  }

  deny(shiftType: ShiftType) {
    this.store.dispatch(
      denyShift({
        date: this.askingWhyDenying!.date,
        timeId: this.askingWhyDenying!.time.id!,
        jobId: this.askingWhyDenying!.job.id!,
        missingReasonId: this.missingReasonId!,
        customMissingReason: this.customMissingReason,
        shiftType,
      })
    );
    this.askingWhyDenying = null;
    this.missingReasonId = -1;
    this.customMissingReason = '';
  }

  cancelSigningUpExtra() {
    this.signingUpExtra = false;
    this.irregularShiftDate = '';
    this.irregularShiftTime = '';
    this.irregularShiftJob = '';
  }

  signUpExtra() {
    this.store.dispatch(
      confirmShift({
        date: this.irregularShiftDate,
        timeId: Number(this.irregularShiftTime),
        jobId: Number(this.irregularShiftJob),
        shiftType: ShiftType.Extra,
      })
    );
    this.cancelSigningUpExtra();
  }

  formatOthers(shift: Shift) {
    if (shift.job.canAlsoDoJobIds.length) {
      return shift.others
        .map((x) => x.name + (x.area ? ' (' + x.area.name + ')' : ''))
        .join(', ');
    } else {
      return shift.others.map((x) => x.name).join(', ');
    }
  }

  formatNewbies(shift: Shift) {
    return shift.newbies.map((x) => x.name).join(', ');
  }

  formatWorkExperiences(shift: Shift) {
    return shift.workExperiences
      .map((x) => `${x.name} - ${x.notes}`)
      .join(', ');
  }

  ngOnInit() {
    this.store.dispatch(getRota());
    this.store.dispatch(getTimes());
  }
}
