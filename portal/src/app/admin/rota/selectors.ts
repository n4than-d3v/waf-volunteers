import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RotaManagementState } from './state';

export const selectRotaManagementState =
  createFeatureSelector<RotaManagementState>('rotaManagement');

export const selectJobs = createSelector(
  selectRotaManagementState,
  (state) => state.jobs
);

export const selectMissingReasons = createSelector(
  selectRotaManagementState,
  (state) => state.missingReasons
);

export const selectTimes = createSelector(
  selectRotaManagementState,
  (state) => state.times
);

export const selectRequirements = createSelector(
  selectRotaManagementState,
  (state) => state.requirements
);

export const selectRegularShifts = createSelector(
  selectRotaManagementState,
  (state) => state.regularShifts
);
