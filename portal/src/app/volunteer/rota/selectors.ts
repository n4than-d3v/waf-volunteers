import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RotaState } from './state';

export const selectRotaState = createFeatureSelector<RotaState>('rota');

export const selectRota = createSelector(
  selectRotaState,
  (state) => state.rota
);

export const selectRotaLoading = createSelector(
  selectRotaState,
  (state) => state.loading
);

export const selectRotaError = createSelector(
  selectRotaState,
  (state) => state.error
);

export const selectConfirmingShift = createSelector(
  selectRotaState,
  (state) => state.confirming
);

export const selectConfirmedShift = createSelector(
  selectRotaState,
  (state) => state.confirmed
);

export const selectDenyingShift = createSelector(
  selectRotaState,
  (state) => state.denying
);

export const selectDeniedShift = createSelector(
  selectRotaState,
  (state) => state.denied
);
