import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  confirmShift,
  confirmShiftError,
  confirmShiftSuccess,
  denyShift,
  denyShiftError,
  denyShiftSuccess,
  getRota,
  getRotaError,
  getRotaSuccess,
} from './actions';
import { Rota } from './state';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class RotaEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getRota$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRota),
      switchMap(() =>
        this.http.get<Rota>('rota/shifts').pipe(
          map((rota) => getRotaSuccess({ rota })),
          catchError(() => of(getRotaError()))
        )
      )
    )
  );

  confirmShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmShift),
      switchMap((action) =>
        this.http.post('rota/shifts/confirm', action).pipe(
          map(() => confirmShiftSuccess()),
          catchError(() => of(confirmShiftError()))
        )
      )
    )
  );

  confirmShiftSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmShiftSuccess),
      switchMap(() => of(getRota()))
    )
  );

  denyShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(denyShift),
      switchMap((action) =>
        this.http.post('rota/shifts/deny', action).pipe(
          map(() => denyShiftSuccess()),
          catchError(() => of(denyShiftError()))
        )
      )
    )
  );

  denyShiftSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(denyShiftSuccess),
      switchMap(() => of(getRota()))
    )
  );
}
