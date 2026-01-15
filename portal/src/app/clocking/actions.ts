import { createAction, props } from '@ngrx/store';
import { ClockingRota } from './state';

export const getClockingRota = createAction(
  '[Clocking] Get rota',
  props<{ date?: string }>()
);
export const getClockingRotaSuccess = createAction(
  '[Clocking] Get rota: Success',
  props<{ rota: ClockingRota[] }>()
);
export const getClockingRotaFailure = createAction(
  '[Clocking] Get rota: Failure'
);

export const clockIn = createAction(
  '[Clocking] Clock in',
  props<{ attendanceId: number; car?: string }>()
);
export const clockInSuccess = createAction('[Clocking] Clock in: Success');
export const clockInFailure = createAction('[Clocking] Clock in: Failure');

export const clockOut = createAction(
  '[Clocking] Clock out',
  props<{ attendanceId: number }>()
);
export const clockOutSuccess = createAction('[Clocking] Clock out: Success');
export const clockOutFailure = createAction('[Clocking] Clock out: Failure');

export const visitorClockIn = createAction(
  '[Clocking] Visitor clock in',
  props<{ name: string; car?: string }>()
);
export const visitorClockInSuccess = createAction(
  '[Clocking] Visitor clock in: Success'
);
export const visitorClockInFailure = createAction(
  '[Clocking] Visitor clock in: Failure'
);

export const visitorClockOut = createAction(
  '[Clocking] Visitor clock out',
  props<{ id: number }>()
);
export const visitorClockOutSuccess = createAction(
  '[Clocking] Visitor clock out: Success'
);
export const visitorClockOutFailure = createAction(
  '[Clocking] Visitor clock out: Failure'
);
