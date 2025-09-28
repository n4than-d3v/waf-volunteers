import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getCurrentProfile,
  getCurrentProfileError,
  getCurrentProfileSuccess,
  updateSubscription,
} from './actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { Profile } from './state';

@Injectable()
export class ProfileEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getCurrentProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCurrentProfile),
      switchMap(() =>
        this.http.get<Profile>('account/users/me').pipe(
          map((profile) => getCurrentProfileSuccess({ profile })),
          catchError(() => of(getCurrentProfileError()))
        )
      )
    )
  );

  updateSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSubscription),
      switchMap((action) => {
        const json = action.subscription.toJSON();
        const subscription = {
          endpoint: json.endpoint,
          ...json.keys,
        };
        return this.http
          .post('account/users/me/subscribe', {
            subscription: JSON.stringify(subscription),
          })
          .pipe(
            map(() => getCurrentProfile()),
            catchError(() => of(getCurrentProfileError()))
          );
      })
    )
  );
}
