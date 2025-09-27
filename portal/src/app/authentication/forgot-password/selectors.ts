import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ForgotPasswordState } from './state';

export const selectForgotPasswordState =
  createFeatureSelector<ForgotPasswordState>('forgotPassword');

export const selectForgotPasswordComplete = createSelector(
  selectForgotPasswordState,
  (state) => state.complete
);
export const selectForgotPasswordLoading = createSelector(
  selectForgotPasswordState,
  (state) => state.loading
);
export const selectForgotPasswordError = createSelector(
  selectForgotPasswordState,
  (state) => state.error
);
