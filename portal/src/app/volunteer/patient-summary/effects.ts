import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PatientSummary } from './state';
import {
  getCurrentPatientsSummary,
  getCurrentPatientsSummaryError,
  getCurrentPatientsSummarySuccess,
} from './actions';

@Injectable()
export class PatientSummaryEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getCurrentPatientsSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCurrentPatientsSummary),
      switchMap(() =>
        this.http.get<PatientSummary>('hospital/summary').pipe(
          map((summary) => getCurrentPatientsSummarySuccess({ summary })),
          catchError(() => of(getCurrentPatientsSummaryError())),
        ),
      ),
    ),
  );
}
