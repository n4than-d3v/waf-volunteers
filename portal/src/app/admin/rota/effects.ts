import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addRegularShift,
  addRegularShiftError,
  addRegularShiftSuccess,
  assignArea,
  assignAreaError,
  assignAreaSuccess,
  confirmShift,
  confirmShiftError,
  confirmShiftSuccess,
  deleteRegularShift,
  deleteRegularShiftError,
  deleteRegularShiftSuccess,
  denyShift,
  denyShiftError,
  denyShiftSuccess,
  getAdminRota,
  getAdminRotaError,
  getAdminRotaSuccess,
  getAssignableAreas,
  getAssignableAreasError,
  getAssignableAreasSuccess,
  getAssignableShifts,
  getAssignableShiftsError,
  getAssignableShiftsSuccess,
  getJobs,
  getJobsError,
  getJobsSuccess,
  getMissingReasons,
  getMissingReasonsError,
  getMissingReasonsSuccess,
  getRegularShifts,
  getRegularShiftsError,
  getRegularShiftsSuccess,
  getReports,
  getReportsError,
  getReportsSuccess,
  getRequirements,
  getRequirementsError,
  getRequirementsSuccess,
  getTimes,
  getTimesError,
  getTimesSuccess,
  updateAssignableAreas,
  updateAssignableAreasError,
  updateAssignableAreasSuccess,
  updateAssignableShifts,
  updateAssignableShiftsError,
  updateAssignableShiftsSuccess,
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
import {
  AdminRota,
  Job,
  MissingReason,
  RegularShift,
  Requirement,
  Time,
  Report,
  AssignableShift,
  AssignableArea,
} from './state';

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

  getAssignableShifts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAssignableShifts),
      switchMap(() =>
        this.http.get<AssignableShift[]>('rota/assignable-shifts').pipe(
          map((assignableShifts) =>
            getAssignableShiftsSuccess({ assignableShifts })
          ),
          catchError(() => of(getAssignableShiftsError()))
        )
      )
    )
  );

  updateAssignableShifts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAssignableShifts),
      switchMap((action) =>
        this.http
          .put('rota/assignable-shifts', {
            assignableShifts: action.assignableShifts,
          })
          .pipe(
            map(() => updateAssignableShiftsSuccess()),
            catchError(() => of(updateAssignableShiftsError()))
          )
      )
    )
  );

  updateAssignableShiftsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAssignableShiftsSuccess),
      switchMap(() => of(getAssignableShifts()))
    )
  );

  getAssignableAreas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAssignableAreas),
      switchMap(() =>
        this.http.get<AssignableArea[]>('rota/assignable-areas').pipe(
          map((assignableAreas) =>
            getAssignableAreasSuccess({ assignableAreas })
          ),
          catchError(() => of(getAssignableAreasError()))
        )
      )
    )
  );

  updateAssignableAreas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAssignableAreas),
      switchMap((action) =>
        this.http
          .put('rota/assignable-areas', {
            assignableAreas: action.assignableAreas,
          })
          .pipe(
            map(() => updateAssignableAreasSuccess()),
            catchError(() => of(updateAssignableAreasError()))
          )
      )
    )
  );

  updateAssignableAreasSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAssignableAreasSuccess),
      switchMap(() => of(getAssignableAreas()))
    )
  );

  assignArea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignArea),
      switchMap((action) =>
        this.http.put('rota/assign-area', action).pipe(
          map(() => assignAreaSuccess()),
          catchError(() => of(assignAreaError()))
        )
      )
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

  getAdminRota$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAdminRota),
      switchMap((action) =>
        this.http
          .get<AdminRota[]>(`rota/shifts/${action.start}/${action.end}`)
          .pipe(
            map((rota) => getAdminRotaSuccess({ rota })),
            catchError(() => of(getAdminRotaError()))
          )
      )
    )
  );

  confirmShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmShift),
      switchMap((action) =>
        this.http
          .post(`rota/user/${action.userId}/shifts/confirm`, action)
          .pipe(
            map(() =>
              confirmShiftSuccess({ start: action.start, end: action.end })
            ),
            catchError(() => of(confirmShiftError()))
          )
      )
    )
  );

  confirmShiftSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(confirmShiftSuccess),
      switchMap((action) =>
        of(
          getAdminRota({
            start: action.start,
            end: action.end,
            silent: true,
          })
        )
      )
    )
  );

  denyShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(denyShift),
      switchMap((action) =>
        this.http.post(`rota/user/${action.userId}/shifts/deny`, action).pipe(
          map(() =>
            denyShiftSuccess({
              start: action.start,
              end: action.end,
            })
          ),
          catchError(() => of(denyShiftError()))
        )
      )
    )
  );

  denyShiftSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(denyShiftSuccess),
      switchMap((action) =>
        of(
          getAdminRota({
            start: action.start,
            end: action.end,
            silent: true,
          })
        )
      )
    )
  );

  getReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getReports),
      switchMap((action) =>
        this.http
          .get<Report[]>(`rota/reports/${action.start}/${action.end}`)
          .pipe(
            map((reports) => getReportsSuccess({ reports })),
            catchError(() => of(getReportsError()))
          )
      )
    )
  );
}
