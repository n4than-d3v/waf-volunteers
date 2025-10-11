import { Component, OnDestroy } from '@angular/core';
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
export class AdminUsersCreateCsvComponent implements OnDestroy {
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

  constructor(private store: Store) {
    this.subscriptions = [
      this.store.select(selectProfilesError).subscribe((error) => {
        if (!error) return;
        if (!this.current) return;
        this.error.push(this.current);
        this.next();
      }),
      this.store.select(selectProfileCreateSuccess).subscribe((success) => {
        if (!success) return;
        if (!this.current) return;
        this.success.push(this.current);
        this.next();
      }),
    ];
  }

  continue() {
    this.actions = this.csv.split('\n').map((user) => {
      const split = user.split(',');
      const getIndex = (index: number) =>
        split.length > index ? split[index] : '';
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
