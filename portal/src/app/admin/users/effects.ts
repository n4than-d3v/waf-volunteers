import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createUser,
  createUserError,
  createUserSuccess,
  getUsers,
  getUsersError,
  getUsersSuccess,
  runBeaconSync,
  runBeaconSyncError,
  runBeaconSyncSuccess,
  updateUser,
  updateUserError,
  updateUserSuccess,
} from './actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { Profile } from './state';

@Injectable()
export class ProfilesEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUsers),
      switchMap(() =>
        this.http.get<Profile[]>('account/users').pipe(
          map((users) => getUsersSuccess({ users })),
          catchError(() => of(getUsersError()))
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
}
