import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  clockIn,
  clockInFailure,
  clockInSuccess,
  clockOut,
  clockOutFailure,
  clockOutSuccess,
  getClockingRota,
  getClockingRotaFailure,
  getClockingRotaSuccess,
  visitorClockIn,
  visitorClockInFailure,
  visitorClockInSuccess,
  visitorClockOut,
  visitorClockOutFailure,
  visitorClockOutSuccess,
} from './actions';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {} from './actions';
import { ClockingRota } from './state';

@Injectable()
export class ClockingEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getClockingRota$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getClockingRota),
      switchMap((action) =>
        this.http
          .get<ClockingRota[]>('clocking/view?date=' + (action.date || ''))
          .pipe(
            map((rota) => getClockingRotaSuccess({ rota })),
            catchError((_) => of(getClockingRotaFailure()))
          )
      )
    )
  );

  clockIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clockIn),
      switchMap((action) =>
        this.http.post('clocking/in', action).pipe(
          map((_) => clockInSuccess()),
          catchError((_) => of(clockInFailure()))
        )
      )
    )
  );

  clockInSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clockInSuccess),
      switchMap(() => of(getClockingRota({})))
    )
  );

  clockOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clockOut),
      switchMap((action) =>
        this.http.post('clocking/out', action).pipe(
          map((_) => clockOutSuccess()),
          catchError((_) => of(clockOutFailure()))
        )
      )
    )
  );

  clockOutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clockOutSuccess),
      switchMap(() => of(getClockingRota({})))
    )
  );

  visitorClockIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(visitorClockIn),
      switchMap((action) =>
        this.http.post('clocking/visitor/in', action).pipe(
          map((_) => visitorClockInSuccess()),
          catchError((_) => of(visitorClockInFailure()))
        )
      )
    )
  );

  visitorClockInSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(visitorClockInSuccess),
      switchMap(() => of(getClockingRota({})))
    )
  );

  visitorClockOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(visitorClockOut),
      switchMap((action) =>
        this.http.post('clocking/visitor/out', action).pipe(
          map((_) => visitorClockOutSuccess()),
          catchError((_) => of(visitorClockOutFailure()))
        )
      )
    )
  );

  visitorClockOutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(visitorClockOutSuccess),
      switchMap(() => of(getClockingRota({})))
    )
  );
}
