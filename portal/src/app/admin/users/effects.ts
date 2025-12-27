import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createUser,
  createUserError,
  createUserSuccess,
  getUser,
  getUserError,
  getUsers,
  getUsersError,
  getUsersSuccess,
  getUserSuccess,
  individualRollout,
  individualRolloutError,
  individualRolloutSuccess,
  runBeaconSync,
  runBeaconSyncError,
  runBeaconSyncSuccess,
  teamRollout,
  teamRolloutError,
  teamRolloutSuccess,
  updateUser,
  updateUserError,
  updateUserSuccess,
} from './actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { Profile, ProfileSummary } from './state';

@Injectable()
export class ProfilesEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUsers),
      switchMap(() =>
        this.http.get<ProfileSummary[]>('account/users').pipe(
          map((users) => getUsersSuccess({ users })),
          catchError(() => of(getUsersError()))
        )
      )
    )
  );

  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUser),
      switchMap((action) =>
        this.http.get<Profile>(`account/users/${action.id}`).pipe(
          map((user) => getUserSuccess({ user })),
          catchError(() => of(getUserError()))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      switchMap((action) => {
        return this.http
          .put(`account/users/${action.user.id}`, action.user)
          .pipe(
            map(() => updateUserSuccess()),
            catchError(() => of(updateUserError()))
          );
      })
    )
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createUser),
      switchMap((action) => {
        return this.http
          .post<{ id: string }>(`account/users`, action.user)
          .pipe(
            map((response) => createUserSuccess(response)),
            catchError(() => of(createUserError()))
          );
      })
    )
  );

  runBeaconSync$ = createEffect(() =>
    this.actions$.pipe(
      ofType(runBeaconSync),
      switchMap((_) => {
        return this.http.post(`account/beacon-sync`, {}).pipe(
          map((_) => runBeaconSyncSuccess()),
          catchError(() => of(runBeaconSyncError()))
        );
      })
    )
  );

  runBeaconSyncSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(runBeaconSyncSuccess),
      switchMap((_) => of(getUsers()))
    )
  );

  teamRollout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(teamRollout),
      switchMap((action) => {
        return this.http.post(`account/send-invitations`, action).pipe(
          map((_) => teamRolloutSuccess()),
          catchError(() => of(teamRolloutError()))
        );
      })
    )
  );

  individualRollout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(individualRollout),
      switchMap((action) => {
        return this.http.post(`account/send-invitations`, action).pipe(
          map((_) => individualRolloutSuccess()),
          catchError(() => of(individualRolloutError()))
        );
      })
    )
  );
}
