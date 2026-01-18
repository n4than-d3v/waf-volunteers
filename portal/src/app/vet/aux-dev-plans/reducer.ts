import { createReducer, on } from '@ngrx/store';
import { AuxDevPlanState, initialAuxDevPlanState } from './state';
import {
  getAuxDevLearners,
  getAuxDevLearnersError,
  getAuxDevLearnersSuccess,
  getAuxDevTasks,
  getAuxDevTasksError,
  getAuxDevTasksSuccess,
  upsertAuxDevTask,
  upsertAuxDevTaskError,
  witnessAuxPerformTask,
  witnessAuxPerformTaskError,
} from './actions';

export const auxDevPlanReducer = createReducer<AuxDevPlanState>(
  initialAuxDevPlanState,
  on(
    getAuxDevTasks,
    getAuxDevLearners,
    upsertAuxDevTask,
    witnessAuxPerformTask,
    (state) => ({
      ...state,
      loading: true,
      error: false,
    })
  ),
  on(getAuxDevLearnersSuccess, (state, { learners }) => ({
    ...state,
    learners,
    loading: false,
  })),
  on(getAuxDevTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: false,
  })),
  on(
    getAuxDevLearnersError,
    getAuxDevTasksError,
    upsertAuxDevTaskError,
    witnessAuxPerformTaskError,
    (state) => ({
      ...state,
      loading: false,
      error: true,
    })
  )
);
