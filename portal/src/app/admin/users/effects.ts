import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getUsers,
  getUsersError,
  getUsersSuccess,
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
          .put(`account/users/${action.user.id}/${action.update}`, action.user)
          .pipe(
            map(() => updateUserSuccess()),
            catchError(() => of(updateUserError()))
          );
      })
    )
  );
}
