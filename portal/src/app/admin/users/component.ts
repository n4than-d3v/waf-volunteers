import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileSummary } from './state';
import { Store } from '@ngrx/store';
import {
  selectProfiles,
  selectProfilesError,
  selectProfilesLoading,
} from './selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { getUsers, runBeaconSync } from './actions';
import { AdminUsersRoleComponent } from './roles.component';
import { AdminUsersStatusComponent } from './status.component';
import { SpinnerComponent } from '../../shared/spinner/component';
import { FormsModule } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'admin-users',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    AdminUsersRoleComponent,
    AdminUsersStatusComponent,
    SpinnerComponent,
    FormsModule,
  ],
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  users$: Observable<ProfileSummary[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  search = '';
  statusFilter = '';
  notifsFilter = '';

  constructor(private store: Store) {
    this.users$ = this.store.select(selectProfiles);
    this.loading$ = this.store.select(selectProfilesLoading);
    this.error$ = this.store.select(selectProfilesError);
  }

  ngOnInit() {
    this.search = sessionStorage.getItem('adminUsersSearch') || '';
    this.statusFilter = sessionStorage.getItem('adminUsersStatusFilter') || '';
    this.notifsFilter = sessionStorage.getItem('adminUsersNotifsFilter') || '';
    this.store.dispatch(getUsers());
  }

  ngOnDestroy() {
    sessionStorage.setItem('adminUsersSearch', this.search);
    sessionStorage.setItem('adminUsersStatusFilter', this.statusFilter);
    sessionStorage.setItem('adminUsersNotifsFilter', this.notifsFilter);
  }

  beaconSync() {
    this.store.dispatch(runBeaconSync());
  }

  getTenure(profile: ProfileSummary) {
    if (!profile.startDate) return '';

    const start = moment(profile.startDate);
    const now = moment();

    const years = now.diff(start, 'years');
    start.add(years, 'years');

    const months = now.diff(start, 'months');
    start.add(months, 'months');

    const days = now.diff(start, 'days');

    let response: string[] = [];
    if (years > 0) response.push(years + ' ' + (years == 1 ? 'yr' : 'yrs'));
    if (months > 0)
      response.push(months + ' ' + (months == 1 ? 'month' : 'months'));
    if (days > 0) response.push(days + ' ' + (days == 1 ? 'day' : 'days'));

    return response.join(' ');
  }

  shouldShow(profile: ProfileSummary) {
    if (this.notifsFilter && profile.subscribed !== (this.notifsFilter === '1'))
      return false;
    if (this.statusFilter && profile.status !== Number(this.statusFilter))
      return false;
    if (!this.search) return true;
    const term = this.search.toUpperCase().replaceAll(' ', '');
    const fullName = profile.firstName + profile.lastName;
    const usernameMatch = profile.username.toUpperCase().includes(term);
    const nameMatch = fullName.toUpperCase().includes(term);
    const carMatch =
      profile.cars &&
      profile.cars.find((car) =>
        car.toUpperCase().replaceAll(' ', '').includes(term),
      );
    return usernameMatch || nameMatch || carMatch;
  }
}
