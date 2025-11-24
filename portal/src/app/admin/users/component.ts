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
import { AsyncPipe, CommonModule } from '@angular/common';
import { getUsers, runBeaconSync } from './actions';
import { AdminUsersRoleComponent } from './roles.component';
import { AdminUsersStatusComponent } from './status.component';
import { SpinnerComponent } from '../../shared/spinner/component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    SpinnerComponent,
    FormsModule,
  ],
})
export class AdminUsersComponent implements OnInit {
  users$: Observable<Profile[] | null>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  search = '';

  constructor(private store: Store) {
    this.users$ = this.store.select(selectProfiles);
    this.loading$ = this.store.select(selectProfilesLoading);
    this.error$ = this.store.select(selectProfilesError);
  }

  ngOnInit() {
    this.store.dispatch(getUsers());
  }

  beaconSync() {
    this.store.dispatch(runBeaconSync());
  }
}
