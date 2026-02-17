import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { checkIfAlreadyLoggedIn, login } from './actions';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
            catchError((error: HttpErrorResponse) => {
              console.log(error);
              if (error.status === 400) {
                return of(loginFailure({ reference: error.error.reference }));
              }

              return of(loginFailure({ reference: 'NETCON' }));
            }),
          ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        map((action) => {
          this.tokenProvider.setToken(action.token);
          if (this.tokenProvider.isAdmin()) {
            this.router.navigateByUrl('/admin/dashboard');
          } else if (this.tokenProvider.isClocking()) {
            this.router.navigateByUrl('/clocking/dashboard');
          } else if (this.tokenProvider.isBoards()) {
            this.router.navigateByUrl('/boards');
          } else if (this.tokenProvider.isVet()) {
            this.router.navigateByUrl('/vet/dashboard');
          } else {
            this.router.navigateByUrl('/volunteer/dashboard');
          }
        }),
      ),
    { dispatch: false },
  );

  checkIfAlreadyLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkIfAlreadyLoggedIn),
      switchMap(() => {
        if (this.tokenProvider.isTokenStillAlive()) {
          return of(loginSuccess({ token: this.tokenProvider.getToken()! }));
        }
        return of();
      }),
    ),
  );
}
