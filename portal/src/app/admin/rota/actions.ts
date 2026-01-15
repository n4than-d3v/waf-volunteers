import { createAction, props } from '@ngrx/store';
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

export const getJobs = createAction('[Rota] Get Jobs');
export const getJobsSuccess = createAction(
  '[Rota] Get Jobs: Success',
  props<{ jobs: Job[] }>()
);
export const getJobsError = createAction('[Rota] Get Jobs: Error');
export const getMissingReasons = createAction('[Rota] Get Missing Reasons');
export const getMissingReasonsSuccess = createAction(
  '[Rota] Get Missing Reasons: Success',
  props<{ missingReasons: MissingReason[] }>()
);
export const getMissingReasonsError = createAction(
  '[Rota] Get Missing Reasons: Error'
);
export const getTimes = createAction('[Rota] Get Times');
export const getTimesSuccess = createAction(
  '[Rota] Get Times: Success',
  props<{ times: Time[] }>()
);
export const getTimesError = createAction('[Rota] Get Times: Error');
export const getRequirements = createAction('[Rota] Get Requirements');
export const getRequirementsSuccess = createAction(
  '[Rota] Get Requirements: Success',
  props<{ requirements: Requirement[] }>()
);
export const getRequirementsError = createAction(
  '[Rota] Get Requirements: Error'
);
export const getAssignableShifts = createAction('[Rota] Get Assignable Shifts');
export const getAssignableShiftsSuccess = createAction(
  '[Rota] Get Assignable Shifts: Success',
  props<{ assignableShifts: AssignableShift[] }>()
);
export const getAssignableShiftsError = createAction(
  '[Rota] Get Assignable Shifts: Error'
);
export const getAssignableAreas = createAction('[Rota] Get Assignable Areas');
export const getAssignableAreasSuccess = createAction(
  '[Rota] Get Assignable Areas: Success',
  props<{ assignableAreas: AssignableArea[] }>()
);
export const getAssignableAreasError = createAction(
  '[Rota] Get Assignable Areas: Error'
);

export const updateJobs = createAction(
  '[Rota] Update Jobs',
  props<{ jobs: Job[] }>()
);
export const updateJobsSuccess = createAction('[Rota] Update Jobs: Success');
export const updateJobsError = createAction('[Rota] Update Jobs: Error');
export const updateMissingReasons = createAction(
  '[Rota] Update Missing Reasons',
  props<{ missingReasons: MissingReason[] }>()
);
export const updateMissingReasonsSuccess = createAction(
  '[Rota] Update Missing Reasons: Success'
);
export const updateMissingReasonsError = createAction(
  '[Rota] Update Missing Reasons: Error'
);
export const updateTimes = createAction(
  '[Rota] Update Times',
  props<{ times: Time[] }>()
);
export const updateTimesSuccess = createAction('[Rota] Update Times: Success');
export const updateTimesError = createAction('[Rota] Update Times: Error');
export const updateRequirements = createAction(
  '[Rota] Update Requirements',
  props<{ requirements: Requirement[] }>()
);
export const updateRequirementsSuccess = createAction(
  '[Rota] Update Requirements: Success'
);
export const updateRequirementsError = createAction(
  '[Rota] Update Requirements: Error'
);
export const updateAssignableShifts = createAction(
  '[Rota] Update Assignable Shifts',
  props<{ assignableShifts: AssignableShift[] }>()
);
export const updateAssignableShiftsSuccess = createAction(
  '[Rota] Update Assignable Shifts: Success'
);
export const updateAssignableShiftsError = createAction(
  '[Rota] Update Assignable Shifts: Error'
);
export const updateAssignableAreas = createAction(
  '[Rota] Update Assignable Areas',
  props<{ assignableAreas: AssignableArea[] }>()
);
export const updateAssignableAreasSuccess = createAction(
  '[Rota] Update Assignable Areas: Success'
);
export const updateAssignableAreasError = createAction(
  '[Rota] Update Assignable Areas: Error'
);
export const assignArea = createAction(
  '[Rota] Assign Area',
  props<{ attendanceId: number; assignableAreaId: number }>()
);
export const assignAreaSuccess = createAction('[Rota] Assign Area: Success');
export const assignAreaError = createAction('[Rota] Assign Area: Error');

export const getRegularShifts = createAction(
  '[Rota] Get Regular Shifts',
  props<{ userId: number }>()
);
export const getRegularShiftsSuccess = createAction(
  '[Rota] Get Regular Shifts: Success',
  props<{ regularShifts: RegularShift[] }>()
);
export const getRegularShiftsError = createAction(
  '[Rota] Get Regular Shifts: Error'
);
export const addRegularShift = createAction(
  '[Rota] Add Regula Shifts',
  props<{ userId: number; regularShift: RegularShift }>()
);
export const addRegularShiftSuccess = createAction(
  '[Rota] Add Regular Shift: Success',
  props<{ userId: number }>()
);
export const addRegularShiftError = createAction(
  '[Rota] Add Regular Shift: Error'
);
export const deleteRegularShift = createAction(
  '[Rota] Delete Regular Shift',
  props<{ userId: number; regularShiftId: number }>()
);
export const deleteRegularShiftSuccess = createAction(
  '[Rota] Delete Regular Shift: Success',
  props<{ userId: number }>()
);
export const deleteRegularShiftError = createAction(
  '[Rota] Delete Regular Shift: Error'
);

export const getAdminRota = createAction(
  '[Rota] Get Admin Rota',
  props<{ start: string; end: string; silent: boolean }>()
);
export const getAdminRotaSuccess = createAction(
  '[Rota] Get Admin Rota: Success',
  props<{ rota: AdminRota[] }>()
);
export const getAdminRotaError = createAction('[Rota] Get Admin Rota: Error');

export const confirmShift = createAction(
  '[Rota] Admin Confirm Shift',
  props<{
    userId: number;
    date: string;
    timeId: number;
    jobId: number;
    shiftType: number;

    start: string;
    end: string;
  }>()
);
export const confirmShiftSuccess = createAction(
  '[Rota] Admin Confirm Shift: Success',
  props<{
    start: string;
    end: string;
  }>()
);
export const confirmShiftError = createAction(
  '[Rota] Admin Confirm Shift: Error'
);

export const denyShift = createAction(
  '[Rota] Admin Deny Shift',
  props<{
    userId: number;
    date: string;
    timeId: number;
    jobId: number;
    shiftType: number;

    start: string;
    end: string;
  }>()
);
export const denyShiftSuccess = createAction(
  '[Rota] Admin Deny Shift: Success',
  props<{
    start: string;
    end: string;
  }>()
);
export const denyShiftError = createAction('[Rota] Admin Deny Shift: Error');

export const addNewbie = createAction(
  '[Rota] Admin adds newbie',
  props<{
    name: string;
    date: string;
    timeId: number;
    jobId: number;

    start: string;
    end: string;
  }>()
);
export const addNewbieSuccess = createAction(
  '[Rota] Admin adds newbie: Success',
  props<{
    start: string;
    end: string;
  }>()
);
export const addNewbieError = createAction('[Rota] Admin adds newbie: Error');

export const addWorkExperience = createAction(
  '[Rota] Admin adds work experience',
  props<{
    name: string;
    dates: { date: string; notes: string }[];

    start: string;
    end: string;
  }>()
);
export const addWorkExperienceSuccess = createAction(
  '[Rota] Admin adds work experience: Success',
  props<{
    start: string;
    end: string;
  }>()
);
export const addWorkExperienceError = createAction(
  '[Rota] Admin adds work experience: Error'
);

export const getReports = createAction(
  '[Rota] Get Reports',
  props<{
    start: string;
    end: string;
  }>()
);
export const getReportsSuccess = createAction(
  '[Rota] Get Reports: Success',
  props<{ reports: Report[] }>()
);
export const getReportsError = createAction('[Rota] Get Reports: Error');
