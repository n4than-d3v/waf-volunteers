import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { checkIfAlreadyLoggedIn, login } from './actions';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { loginSuccess, loginFailure } from './actions';
import { Router } from '@angular/router';
import { TokenProvider } from '../../shared/token.provider';

@Injectable()
export class LoginEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);
  router = inject(Router);
  tokenProvider = inject(TokenProvider);

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
        map((action) => {
          this.tokenProvider.setToken(action.token);
          if (this.tokenProvider.isAdmin()) {
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.router.navigateByUrl('/volunteer/dashboard');
          }
        })
      ),
    { dispatch: false }
  );

  checkIfAlreadyLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkIfAlreadyLoggedIn),
      switchMap(() => {
        if (this.tokenProvider.isTokenStillAlive()) {
          return of(loginSuccess({ token: this.tokenProvider.getToken()! }));
        }
        return of();
      })
    )
  );
}
