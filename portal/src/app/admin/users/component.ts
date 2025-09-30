import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Profile } from './state';
import { Store } from '@ngrx/store';
import { selectProfiles } from './selectors';
import { AsyncPipe } from '@angular/common';
import { getUsers } from './actions';
import { AdminUsersRoleComponent } from './roles.component';
import { AdminUsersStatusComponent } from './status.component';
import { AdminUsersAddressComponent } from './address.component';

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
    AdminUsersAddressComponent,
  ],
})
export class AdminUsersComponent implements OnInit {
  users$: Observable<Profile[] | null>;

  constructor(private store: Store) {
    this.users$ = this.store.select(selectProfiles);
  }

  ngOnInit() {
    this.store.dispatch(getUsers());
  }
}
