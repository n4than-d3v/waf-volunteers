import { createAction, props } from '@ngrx/store';
import { Job, MissingReason, Requirement, Time } from './state';

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
