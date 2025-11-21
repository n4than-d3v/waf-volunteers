import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClockingState } from './state';

export const selectClockingState =
  createFeatureSelector<ClockingState>('clocking');

export const selectClockingRota = createSelector(
  selectClockingState,
  (state) => state.rota
);
export const selectClockingLoading = createSelector(
  selectClockingState,
  (state) => state.loading
);
export const selectClockingError = createSelector(
  selectClockingState,
  (state) => state.error
);
