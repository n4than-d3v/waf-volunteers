import { createAction } from '@ngrx/store';

export const getRegularShifts = createAction('[Rota] Get Regular Shifts');
export const getRegularShiftsSuccess = createAction(
  '[Rota] Get Regular Shifts: Success',
  (shifts: any[]) => ({ shifts })
);
export const getRegularShiftsError = createAction(
  '[Rota] Get Regular Shifts: Error'
);
