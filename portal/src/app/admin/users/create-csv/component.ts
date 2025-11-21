import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Action, Store } from '@ngrx/store';
import { createUser } from '../actions';
import { Roles, Status } from '../../../shared/token.provider';
import { Profile } from '../state';
import {
  selectProfileCreateSuccess,
  selectProfilesError,
  selectProfilesLoading,
} from '../selectors';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { selectJobs, selectTimes } from '../../rota/selectors';
import { daysOfWeek, Job, Time } from '../../rota/state';
import { addRegularShift, getJobs, getTimes } from '../../rota/actions';

type CreateAction = {
  user: Profile;
} & Action<'[Users] Create user'>;

@Component({
  selector: 'admin-create-user-csv',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [FormsModule, RouterLink],
})
export class AdminUsersCreateCsvComponent implements OnInit, OnDestroy {
  index = 0;
  actions: CreateAction[] = [];
  current: CreateAction | null = null;
  success: CreateAction[] = [];
  error: CreateAction[] = [];

  csv: string = '';
  typing = true;
  saving = false;
  finished = false;

  subscriptions: Subscription[];

  regularShifts: [string, string][] = [];
  times: Time[] = [];
  jobs: Job[] = [];

  constructor(private store: Store) {
    this.subscriptions = [
      this.store
        .select(selectJobs)
        .subscribe((jobs) => (this.jobs = structuredClone(jobs.data))),
      this.store
        .select(selectTimes)
        .subscribe((times) => (this.times = structuredClone(times.data))),
      this.store.select(selectProfilesError).subscribe((error) => {
        if (!error) return;
        if (!this.current) return;
        this.error.push(this.current);
        this.next();
      }),
      this.store.select(selectProfileCreateSuccess).subscribe((accountId) => {
        if (!accountId) return;
        if (!this.current) return;
        this.tryCreateRegularShifts(
          this.current.user.username,
          Number(accountId)
        );
        this.success.push(this.current);
        this.next();
      }),
    ];
  }

  ngOnInit() {
    this.store.dispatch(getJobs());
    this.store.dispatch(getTimes());
  }

  continue() {
    this.actions = this.csv.split('\n').map((user) => {
      const split = user.split(',');
      const getIndex = (index: number) =>
        split.length > index ? split[index] : '';
      this.regularShifts.push([getIndex(0), getIndex(10)]);
      return createUser({
        user: {
          id: -1,
          username: getIndex(0),
          firstName: getIndex(1),
          lastName: getIndex(2),
          email: getIndex(3),
          phone: getIndex(4),
          address: {
            lineOne: getIndex(5),
            lineTwo: getIndex(6),
            city: getIndex(7),
            county: getIndex(8),
            postcode: getIndex(9),
          },
          cars: getIndex(11)
            .split('|')
            .filter((x) => !!x),
          status: Status.Active,
          roles: Roles.Volunteer,
        },
      });
    });

    this.typing = false;
  }

  back() {
    this.typing = true;
  }

  confirm() {
    this.saving = true;
    this.index = -1;
    this.next();
  }

  private tryCreateRegularShifts(username: string, userId: number) {
    const user = this.regularShifts.find((x) => x[0] === username);
    if (!user) return;
    if (!user[1]) return;
    const regularShifts = user[1].split('|');
    for (const regularShift of regularShifts) {
      const split = regularShift.split('/');
      const day = daysOfWeek.find((x) => x.name === split[0])?.value || -1;
      const timeId = this.times.find((x) => x.name === split[1])?.id || -1;
      const jobId = this.jobs.find((x) => x.name === split[2])?.id || -1;
      this.store.dispatch(
        addRegularShift({
          userId,
          regularShift: {
            day,
            week: split.length == 4 ? Number(split[3]) : null,
            jobId,
            timeId,

            // Unused properties
            job: { id: 0, name: '' },
            time: { id: 0, name: '', start: '', end: '' },
            id: -1,
          },
        })
      );
    }
  }

  private next() {
    this.index++;
    this.current = null;
    if (this.index >= this.actions.length) {
      this.finished = true;
      return;
    }
    this.current = this.actions[this.index];
    this.store.dispatch(this.current);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) subscription.unsubscribe();
  }
}
