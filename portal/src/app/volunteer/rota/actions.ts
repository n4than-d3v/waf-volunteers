import { createAction, props } from '@ngrx/store';
import { Rota, ShiftType } from './state';

export const getRota = createAction('[Rota] Get Rota');
export const getRotaSuccess = createAction(
  '[Rota] Get Rota: Success',
  props<{ rota: Rota }>()
);
export const getRotaError = createAction('[Rota] Get Rota: Error');

export const confirmShift = createAction(
  '[Rota] Confirm Shift',
  props<{ date: string; timeId: number; jobId: number; shiftType: ShiftType }>()
);
export const confirmShiftSuccess = createAction(
  '[Rota] Confirm Shift: Success'
);
export const confirmShiftError = createAction('[Rota] Confirm Shift: Error');

export const denyShift = createAction(
  '[Rota] Deny Shift',
  props<{
    date: string;
    timeId: number;
    jobId: number;
    missingReasonId: number;
    customMissingReason?: string;
    shiftType: ShiftType;
  }>()
);
export const denyShiftSuccess = createAction('[Rota] Deny Shift: Success');
export const denyShiftError = createAction('[Rota] Deny Shift: Error');
