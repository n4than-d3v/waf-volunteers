import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  getAuxDevLearners,
  getAuxDevLearnersError,
  getAuxDevLearnersSuccess,
  getAuxDevTasks,
  getAuxDevTasksError,
  getAuxDevTasksSuccess,
  upsertAuxDevTask,
  upsertAuxDevTaskError,
  upsertAuxDevTaskSuccess,
  witnessAuxPerformTask,
  witnessAuxPerformTaskError,
  witnessAuxPerformTaskSuccess,
} from './actions';
import { AuxDevLearner, AuxDevTask } from './state';

@Injectable()
export class AuxDevPlanEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getAuxDevTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAuxDevTasks),
      switchMap(() =>
        this.http.get<AuxDevTask[]>('aux-dev-plans/tasks').pipe(
          map((tasks) => getAuxDevTasksSuccess({ tasks })),
          catchError(() => of(getAuxDevTasksError()))
        )
      )
    )
  );

  getAuxDevLearners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAuxDevLearners),
      switchMap(() =>
        this.http.get<AuxDevLearner[]>('aux-dev-plans/auxiliaries').pipe(
          map((learners) => getAuxDevLearnersSuccess({ learners })),
          catchError(() => of(getAuxDevLearnersError()))
        )
      )
    )
  );

  upsertAuxDevTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertAuxDevTask),
      switchMap((action) =>
        this.http.post('aux-dev-plans/task', action).pipe(
          switchMap((_) => of(getAuxDevTasks(), upsertAuxDevTaskSuccess())),
          catchError(() => of(upsertAuxDevTaskError()))
        )
      )
    )
  );

  witnessAuxPerformTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(witnessAuxPerformTask),
      switchMap((action) =>
        this.http.post('aux-dev-plans/witness', action).pipe(
          switchMap((_) =>
            of(getAuxDevLearners(), witnessAuxPerformTaskSuccess())
          ),
          catchError(() => of(witnessAuxPerformTaskError()))
        )
      )
    )
  );
}
