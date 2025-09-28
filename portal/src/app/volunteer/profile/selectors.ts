import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from './state';

export const selectProfileState =
  createFeatureSelector<ProfileState>('profile');

export const selectCurrentProfile = createSelector(
  selectProfileState,
  (state) => state.profile
);

export const selectProfileLoading = createSelector(
  selectProfileState,
  (state) => state.loading
);

export const selectProfileError = createSelector(
  selectProfileState,
  (state) => state.error
);

export const selectProfileUpdateSuccess = createSelector(
  selectProfileState,
  (state) => state.updated
);

export const selectSubcribed = createSelector(
  selectProfileState,
  (state) => state.profile?.subscribed ?? false
);
