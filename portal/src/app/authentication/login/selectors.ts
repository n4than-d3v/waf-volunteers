import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginState } from './state';

export const selectLoginState = createFeatureSelector<LoginState>('login');

export const selectLoginToken = createSelector(
  selectLoginState,
  (state) => state.token
);
export const selectLoginLoading = createSelector(
  selectLoginState,
  (state) => state.loading
);
export const selectLoginError = createSelector(
  selectLoginState,
  (state) => state.error
);
