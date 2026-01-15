import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  addNewbie,
  addWorkExperience,
  assignArea,
  confirmShift,
  denyShift,
  getAdminRota,
  getAssignableAreas,
  getJobs,
  getTimes,
} from './actions';
import moment, { Moment } from 'moment';
import { Observable, Subscription } from 'rxjs';
import {
  AdminRota,
  AdminRotaShift,
  AdminRotaShiftJob,
  AdminRotaShiftJobVolunteer,
  AssignableArea,
  Job,
  Time,
  Wrapper,
} from './state';
import {
  selectAdminRota,
  selectAssignableAreas,
  selectJobs,
  selectTimes,
} from './selectors';
import { SpinnerComponent } from '../../shared/spinner/component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { DayPipe } from '../../volunteer/rota/day.pipe';
import { FormsModule } from '@angular/forms';
import { ShiftType } from '../../volunteer/rota/state';
import { ProfileSummary } from '../users/state';
import { selectProfiles } from '../users/selectors';
import { getUsers } from '../users/actions';

@Component({
  selector: 'admin-rota',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    DayPipe,
    RouterLink,
    SpinnerComponent,
    FormsModule,
  ],
})
export class AdminRotaComponent implements OnInit, OnDestroy {
  private _start: Moment = moment();
  private _end: Moment = moment();

  start: string = '';
  end: string = '';
  week = 0;

  ShiftType = ShiftType;

  rota$: Observable<Wrapper<AdminRota>>;
  assignableAreas$: Observable<Wrapper<AssignableArea>>;

  updatingShift: AdminRotaShiftJobVolunteer | null = null;
  updatingAssignableArea: { [attendanceId: number]: string } = {};

  accounts$: Observable<ProfileSummary[] | null>;
  times$: Observable<Wrapper<Time>>;
  jobs$: Observable<Wrapper<Job>>;
  accountId: number | null = null;
  newbieName = '';
  date = '';
  timeId: number | null = null;
  jobId: number | null = null;

  workExperienceName = '';
  workExperienceDates: { date: string; notes: string }[] = [];
  workExperienceDate = '';
  workExperienceNotes = '';

  addingExtra = false;
  addingNewbie = false;
  addingWorkExperience = false;

  subscription: Subscription;

  constructor(private store: Store) {
    this.rota$ = this.store.select(selectAdminRota);
    this.assignableAreas$ = this.store.select(selectAssignableAreas);
    this.accounts$ = this.store.select(selectProfiles);
    this.times$ = this.store.select(selectTimes);
    this.jobs$ = this.store.select(selectJobs);
    this.subscription = this.rota$.subscribe((rota) => {
      if (!rota.data) return;
      for (const day of rota.data) {
        if (day.week) this.week = day.week;
        for (const shift of day.shifts) {
          for (const job of shift.jobs) {
            for (const volunteer of job.volunteers) {
              if (volunteer.attendanceId) {
                this.updatingAssignableArea[
                  volunteer.attendanceId!
                ] = `${volunteer.areaId}`;
              }
            }
          }
        }
      }
    });
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
        silent: false,
      })
    );
  }

  expandAll = false;
  expanded: string[] = [];

  toggleAll() {
    this.expandAll = !this.expandAll;
    this.expanded = [];
  }

  private getExpansionKey(
    day: AdminRota,
    shift: AdminRotaShift,
    job: AdminRotaShiftJob
  ) {
    return `${day.date}-${shift.time.name}-${job.job.name}`;
  }

  isExpanded(day: AdminRota, shift: AdminRotaShift, job: AdminRotaShiftJob) {
    return this.expanded.includes(this.getExpansionKey(day, shift, job));
  }

  toggle(day: AdminRota, shift: AdminRotaShift, job: AdminRotaShiftJob) {
    this.expandAll = false;
    const key = this.getExpansionKey(day, shift, job);
    if (this.isExpanded(day, shift, job)) {
      this.expanded = this.expanded.filter((x) => x !== key);
    } else {
      this.expanded = [...this.expanded, key];
    }
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
    shiftType: volunteer.type,
  });

  private resetForm() {
    this.addingExtra = false;
    this.addingNewbie = false;
    this.addingWorkExperience = false;
    this.accountId = null;
    this.newbieName = '';
    this.date = '';
    this.timeId = null;
    this.jobId = null;
    this.workExperienceName = '';
    this.workExperienceDate = '';
    this.workExperienceNotes = '';
    this.workExperienceDates = [];
  }

  addExtraShift() {
    this.store.dispatch(
      confirmShift({
        userId: Number(this.accountId),
        date: this.date,
        timeId: Number(this.timeId),
        jobId: Number(this.jobId),
        start: this._start.format('YYYY-MM-DD'),
        end: this._end.format('YYYY-MM-DD'),
        shiftType: ShiftType.Extra,
      })
    );
    this.resetForm();
  }

  addNewbie() {
    this.store.dispatch(
      addNewbie({
        name: this.newbieName,
        date: this.date,
        timeId: Number(this.timeId),
        jobId: Number(this.jobId),
        start: this._start.format('YYYY-MM-DD'),
        end: this._end.format('YYYY-MM-DD'),
      })
    );
    this.resetForm();
  }

  includeWorkExperienceDate() {
    if (!this.workExperienceDate) return;

    this.workExperienceDates.push({
      date: this.workExperienceDate,
      notes: this.workExperienceNotes || '',
    });

    this.workExperienceDate = '';
    this.workExperienceNotes = '';
  }

  addWorkExperience() {
    this.store.dispatch(
      addWorkExperience({
        name: this.workExperienceName,
        dates: this.workExperienceDates,
        start: this._start.format('YYYY-MM-DD'),
        end: this._end.format('YYYY-MM-DD'),
      })
    );
    this.resetForm();
  }

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

  assignArea(attendanceId: number) {
    this.store.dispatch(
      assignArea({
        attendanceId: attendanceId,
        assignableAreaId: Number(this.updatingAssignableArea[attendanceId]),
      })
    );
  }

  ngOnInit() {
    this._start = moment().startOf('isoWeek');
    this._end = moment(this._start).add(6, 'days');
    this.update();
    this.store.dispatch(getAssignableAreas());
    this.store.dispatch(getUsers());
    this.store.dispatch(getTimes());
    this.store.dispatch(getJobs());
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
