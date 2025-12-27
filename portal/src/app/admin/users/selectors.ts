import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfilesState } from './state';

export const selectProfilesState =
  createFeatureSelector<ProfilesState>('profiles');

export const selectProfiles = createSelector(
  selectProfilesState,
  (state) => state.profiles
);

export const selectProfile = createSelector(
  selectProfilesState,
  (state) => state.profile
);

export const selectProfilesLoading = createSelector(
  selectProfilesState,
  (state) => state.loading
);

export const selectProfilesError = createSelector(
  selectProfilesState,
  (state) => state.error
);

export const selectProfileUpdateSuccess = createSelector(
  selectProfilesState,
  (state) => state.updated
);

export const selectProfileCreateSuccess = createSelector(
  selectProfilesState,
  (state) => state.created
);
