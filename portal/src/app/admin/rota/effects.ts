import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addRegularShift,
  addRegularShiftError,
  addRegularShiftSuccess,
  deleteRegularShift,
  deleteRegularShiftError,
  deleteRegularShiftSuccess,
  getJobs,
  getJobsError,
  getJobsSuccess,
  getMissingReasons,
  getMissingReasonsError,
  getMissingReasonsSuccess,
  getRegularShifts,
  getRegularShiftsError,
  getRegularShiftsSuccess,
  getRequirements,
  getRequirementsError,
  getRequirementsSuccess,
  getTimes,
  getTimesError,
  getTimesSuccess,
  updateJobs,
  updateJobsError,
  updateJobsSuccess,
  updateMissingReasons,
  updateMissingReasonsError,
  updateMissingReasonsSuccess,
  updateRequirements,
  updateRequirementsError,
  updateRequirementsSuccess,
  updateTimes,
  updateTimesError,
  updateTimesSuccess,
} from './actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { Job, MissingReason, RegularShift, Requirement, Time } from './state';

@Injectable()
export class RotaManagementEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getJobs),
      switchMap(() =>
        this.http.get<Job[]>('rota/jobs').pipe(
          map((jobs) => getJobsSuccess({ jobs })),
          catchError(() => of(getJobsError()))
        )
      )
    )
  );

  updateJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateJobs),
      switchMap((action) =>
        this.http.put('rota/jobs', { jobs: action.jobs }).pipe(
          map(() => updateJobsSuccess()),
          catchError(() => of(updateJobsError()))
        )
      )
    )
  );

  updateJobsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateJobsSuccess),
      switchMap(() => of(getJobs()))
    )
  );

  getMissingReasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMissingReasons),
      switchMap(() =>
        this.http.get<MissingReason[]>('rota/missing-reasons').pipe(
          map((missingReasons) => getMissingReasonsSuccess({ missingReasons })),
          catchError(() => of(getMissingReasonsError()))
        )
      )
    )
  );

  updateMissingReasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateMissingReasons),
      switchMap((action) =>
        this.http
          .put('rota/missing-reasons', {
            missingReasons: action.missingReasons,
          })
          .pipe(
            map(() => updateMissingReasonsSuccess()),
            catchError(() => of(updateMissingReasonsError()))
          )
      )
    )
  );

  updateMissingReasonsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateMissingReasonsSuccess),
      switchMap(() => of(getMissingReasons()))
    )
  );

  getTimes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTimes),
      switchMap(() =>
        this.http.get<Time[]>('rota/times').pipe(
          map((times) => getTimesSuccess({ times })),
          catchError(() => of(getTimesError()))
        )
      )
    )
  );

  updateTimes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTimes),
      switchMap((action) =>
        this.http.put('rota/times', { times: action.times }).pipe(
          map(() => updateTimesSuccess()),
          catchError(() => of(updateTimesError()))
        )
      )
    )
  );

  updateTimesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTimesSuccess),
      switchMap(() => of(getTimes()))
    )
  );

  getRequirements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRequirements),
      switchMap(() =>
        this.http.get<Requirement[]>('rota/requirements').pipe(
          map((requirements) => getRequirementsSuccess({ requirements })),
          catchError(() => of(getRequirementsError()))
        )
      )
    )
  );

  updateRequirements$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequirements),
      switchMap((action) =>
        this.http
          .put('rota/requirements', { requirements: action.requirements })
          .pipe(
            map(() => updateRequirementsSuccess()),
            catchError(() => of(updateRequirementsError()))
          )
      )
    )
  );

  updateRequirementsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequirementsSuccess),
      switchMap(() => of(getRequirements()))
    )
  );

  getRegularShifts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRegularShifts),
      switchMap((action) =>
        this.http
          .get<RegularShift[]>(`rota/users/${action.userId}/regular-shifts`)
          .pipe(
            map((regularShifts) => getRegularShiftsSuccess({ regularShifts })),
            catchError(() => of(getRegularShiftsError()))
          )
      )
    )
  );

  addRegularShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addRegularShift),
      switchMap((action) =>
        this.http
          .post(
            `rota/users/${action.userId}/regular-shifts`,
            action.regularShift
          )
          .pipe(
            map(() => addRegularShiftSuccess({ userId: action.userId })),
            catchError(() => of(addRegularShiftError()))
          )
      )
    )
  );

  addRegularShiftSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addRegularShiftSuccess),
      switchMap((action) => of(getRegularShifts({ userId: action.userId })))
    )
  );

  deleteRegularShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteRegularShift),
      switchMap((action) =>
        this.http
          .delete(
            `rota/users/${action.userId}/regular-shift/${action.regularShiftId}`
          )
          .pipe(
            map(() => deleteRegularShiftSuccess({ userId: action.userId })),
            catchError(() => of(deleteRegularShiftError()))
          )
      )
    )
  );

  deleteRegularShiftSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteRegularShiftSuccess),
      switchMap((action) => of(getRegularShifts({ userId: action.userId })))
    )
  );
}
