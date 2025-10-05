import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Profile } from './state';
import { Store } from '@ngrx/store';
import {
  selectProfiles,
  selectProfilesError,
  selectProfilesLoading,
} from './selectors';
import { AsyncPipe } from '@angular/common';
import { getUsers } from './actions';
import { AdminUsersRoleComponent } from './roles.component';
import { AdminUsersStatusComponent } from './status.component';
import { AdminUsersAddressComponent } from './address.component';
import { SpinnerComponent } from '../../shared/spinner/component';

@Component({
  selector: 'admin-users',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    RouterLink,
    AdminUsersRoleComponent,
    AdminUsersStatusComponent,
    // AdminUsersAddressComponent,
    SpinnerComponent,
  ],
})
export class AdminUsersComponent implements OnInit {
  users$: Observable<Profile[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  constructor(private store: Store) {
    this.users$ = this.store.select(selectProfiles);
    this.loading$ = this.store.select(selectProfilesLoading);
    this.error$ = this.store.select(selectProfilesError);
  }

  ngOnInit() {
    this.store.dispatch(getUsers());
  }
}
