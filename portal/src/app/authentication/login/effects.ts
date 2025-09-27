import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { checkIfAlreadyLoggedIn, login } from './actions';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { loginSuccess, loginFailure } from './actions';
import { Router } from '@angular/router';

@Injectable()
export class LoginEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);
  router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap((action) =>
        this.http
          .post('account/login', {
            username: action.username,
            password: action.password,
          })
          .pipe(
            map((response: any) => loginSuccess({ token: response.token })),
            catchError((_) => of(loginFailure()))
          )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        map(() => {
          // TODO: Navigate to appropriate dashboard based on user role
          this.router.navigateByUrl('/volunteer/dashboard');
        })
      ),
    { dispatch: false }
  );

  isJwtExpired = (token: string) => {
    if (!token) return true;

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;

    try {
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const exp = payload.exp;
      if (typeof exp !== 'number') return true;

      const currentTime = Math.floor(Date.now() / 1000);
      const expired = currentTime >= exp;

      console.log({ payloadJson, payload, exp, currentTime, expired });
      return expired;
    } catch (e) {
      return true;
    }
  };

  checkIfAlreadyLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkIfAlreadyLoggedIn),
      switchMap(() => {
        const token = localStorage.getItem('token');
        if (!this.isJwtExpired(token || '')) {
          return of(loginSuccess({ token: token! }));
        }
        return of();
      })
    )
  );
}
