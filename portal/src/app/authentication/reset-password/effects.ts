import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  resetPassword,
  resetPasswordError,
  resetPasswordSuccess,
} from './actions';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {} from './actions';

@Injectable()
export class ResetPasswordEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      switchMap((action) =>
        this.http
          .put('account/password/reset', {
            token: action.token,
            password: action.password,
          })
          .pipe(
            map((_) => resetPasswordSuccess()),
            catchError((_) => of(resetPasswordError()))
          )
      )
    )
  );
}
