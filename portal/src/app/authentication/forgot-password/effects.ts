import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  forgotPassword,
  forgotPasswordError,
  forgotPasswordSuccess,
} from './actions';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {} from './actions';

@Injectable()
export class ForgotPasswordEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(forgotPassword),
      switchMap((action) =>
        this.http
          .post('account/password/reset', {
            username: action.username,
          })
          .pipe(
            map((_) => forgotPasswordSuccess()),
            catchError((_) => of(forgotPasswordError()))
          )
      )
    )
  );
}
