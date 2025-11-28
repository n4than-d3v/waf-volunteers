import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { getUsers, individualRollout, teamRollout } from '../actions';
import { getTimes } from '../../rota/actions';
import { daysOfWeek, Time, Wrapper } from '../../rota/state';
import { Observable } from 'rxjs';
import { Profile } from '../state';
import {
  selectProfiles,
  selectProfilesError,
  selectProfilesLoading,
  selectProfileUpdateSuccess,
} from '../selectors';
import { selectTimes } from '../../rota/selectors';

@Component({
  selector: 'admin-users-send-invitations',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    SpinnerComponent,
    RouterLink,
    CommonModule,
    FormsModule,
  ],
})
export class AdminUsersSendInvitationsComponent implements OnInit {
  daysOfWeek = daysOfWeek;

  users$: Observable<Profile[] | null>;
  times$: Observable<Wrapper<Time>>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;
  success$: Observable<boolean>;

  day = '';
  time = '';

  username = '';

  constructor(private store: Store) {
    this.users$ = this.store.select(selectProfiles);
    this.times$ = this.store.select(selectTimes);
    this.loading$ = this.store.select(selectProfilesLoading);
    this.error$ = this.store.select(selectProfilesError);
    this.success$ = this.store.select(selectProfileUpdateSuccess);
  }

  ngOnInit() {
    this.store.dispatch(getUsers());
    this.store.dispatch(getTimes());
  }

  sendTeam() {
    this.store.dispatch(
      teamRollout({
        day: Number(this.day),
        timeId: Number(this.time),
      })
    );
  }

  sendIndividual() {
    this.store.dispatch(
      individualRollout({
        username: this.username,
      })
    );
  }
}
