import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ResetPasswordState } from './state';

export const selectResetPasswordState =
  createFeatureSelector<ResetPasswordState>('resetPassword');

export const selectResetPasswordComplete = createSelector(
  selectResetPasswordState,
  (state) => state.complete
);
export const selectResetPasswordLoading = createSelector(
  selectResetPasswordState,
  (state) => state.loading
);
export const selectResetPasswordError = createSelector(
  selectResetPasswordState,
  (state) => state.error
);
