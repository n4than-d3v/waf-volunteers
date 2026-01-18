import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuxDevPlanState } from './state';

export const selectAuxDevPlanState =
  createFeatureSelector<AuxDevPlanState>('auxDevPlan');

export const selectAuxDevTasks = createSelector(
  selectAuxDevPlanState,
  (state) => state.tasks
);

export const selectAuxDevLearners = createSelector(
  selectAuxDevPlanState,
  (state) => state.learners
);

export const selectAuxDevLoading = createSelector(
  selectAuxDevPlanState,
  (state) => state.loading
);

export const selectAuxDevError = createSelector(
  selectAuxDevPlanState,
  (state) => state.error
);
