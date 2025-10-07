import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { confirmShift, denyShift, getAdminRota } from './actions';
import moment, { Moment } from 'moment';
import { Observable } from 'rxjs';
import {
  AdminRota,
  AdminRotaShift,
  AdminRotaShiftJob,
  AdminRotaShiftJobVolunteer,
  Wrapper,
} from './state';
import { selectAdminRota } from './selectors';
import { SpinnerComponent } from '../../shared/spinner/component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { DayPipe } from '../../volunteer/rota/day.pipe';

@Component({
  selector: 'admin-rota',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, DatePipe, DayPipe, RouterLink, SpinnerComponent],
})
export class AdminRotaComponent implements OnInit {
  private _start: Moment = moment();
  private _end: Moment = moment();

  start: string = '';
  end: string = '';

  rota$: Observable<Wrapper<AdminRota>>;

  updatingShift: AdminRotaShiftJobVolunteer | null = null;

  constructor(private store: Store) {
    this.rota$ = this.store.select(selectAdminRota);
  }

  nextWeek() {
    this._start = moment(this._start).add(7, 'days');
    this._end = moment(this._end).add(7, 'days');
    this.update();
  }

  previousWeek() {
    this._start = moment(this._start).subtract(7, 'days');
    this._end = moment(this._end).subtract(7, 'days');
    this.update();
  }

  private update() {
    this.start = this._start.format('ddd Do MMM yyyy');
    this.end = this._end.format('ddd Do MMM yyyy');
    this.store.dispatch(
      getAdminRota({
        start: this._start.format('YYYY-MM-DD'),
        end: this._end.format('YYYY-MM-DD'),
      })
    );
  }

  private getUpdatePayload = (
    day: AdminRota,
    shift: AdminRotaShift,
    job: AdminRotaShiftJob,
    volunteer: AdminRotaShiftJobVolunteer
  ) => ({
    userId: volunteer.id!,
    date: day.date,
    timeId: shift.time.id!,
    jobId: job.job.id!,
    start: this._start.format('YYYY-MM-DD'),
    end: this._end.format('YYYY-MM-DD'),
  });

  setComing(
    day: AdminRota,
    shift: AdminRotaShift,
    job: AdminRotaShiftJob,
    volunteer: AdminRotaShiftJobVolunteer
  ) {
    this.store.dispatch(
      confirmShift(this.getUpdatePayload(day, shift, job, volunteer))
    );
  }

  setNotComing(
    day: AdminRota,
    shift: AdminRotaShift,
    job: AdminRotaShiftJob,
    volunteer: AdminRotaShiftJobVolunteer
  ) {
    this.store.dispatch(
      denyShift(this.getUpdatePayload(day, shift, job, volunteer))
    );
  }

  ngOnInit() {
    this._start = moment().startOf('isoWeek');
    this._end = moment(this._start).add(6, 'days');
    this.update();
  }
}
