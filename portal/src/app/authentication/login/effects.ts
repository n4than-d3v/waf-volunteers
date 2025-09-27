import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { login } from './actions';
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
          this.router.navigateByUrl('/dashboard');
        })
      ),
    { dispatch: false }
  );
}
