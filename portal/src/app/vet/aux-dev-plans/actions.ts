import { createAction, props } from '@ngrx/store';
import { AuxDevLearner, AuxDevTask } from './state';

export const getAuxDevTasks = createAction('[AuxDevPlan] Get aux dev tasks');
export const getAuxDevTasksSuccess = createAction(
  '[AuxDevPlan] Get aux dev tasks: success',
  props<{ tasks: AuxDevTask[] }>()
);
export const getAuxDevTasksError = createAction(
  '[AuxDevPlan] Get aux dev tasks: error'
);

export const getAuxDevLearners = createAction(
  '[AuxDevPlan] Get aux dev learners'
);
export const getAuxDevLearnersSuccess = createAction(
  '[AuxDevPlan] Get aux dev learners: success',
  props<{ learners: AuxDevLearner[] }>()
);
export const getAuxDevLearnersError = createAction(
  '[AuxDevPlan] Get aux dev learners: error'
);

export const upsertAuxDevTask = createAction(
  '[AuxDevPlan] Upsert aux dev task',
  props<{ id?: number; name: string; explanation: string; youtube: string[] }>()
);
export const upsertAuxDevTaskSuccess = createAction(
  '[AuxDevPlan] Upsert aux dev task: success'
);
export const upsertAuxDevTaskError = createAction(
  '[AuxDevPlan] Upsert aux dev task: error'
);

export const witnessAuxPerformTask = createAction(
  '[AuxDevPlan] Witness aux perform task',
  props<{
    performerId: number;
    taskId: number;
    notes: string;
    signedOff: boolean;
  }>()
);
export const witnessAuxPerformTaskSuccess = createAction(
  '[AuxDevPlan] Witness aux perform task: success'
);
export const witnessAuxPerformTaskError = createAction(
  '[AuxDevPlan] Witness aux perform task: error'
);
