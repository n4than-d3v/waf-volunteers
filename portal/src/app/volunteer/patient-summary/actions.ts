import { createAction, props } from '@ngrx/store';
import { PatientSummary } from './state';

export const getCurrentPatientsSummary = createAction(
  '[HMS-H] Get current patients summary',
);
export const getCurrentPatientsSummarySuccess = createAction(
  '[HMS-H] Get current patients summary: success',
  props<{ summary: PatientSummary }>(),
);
export const getCurrentPatientsSummaryError = createAction(
  '[HMS-H] Get current patients summary: error',
);
