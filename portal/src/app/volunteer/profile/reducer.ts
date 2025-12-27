import { createReducer, on } from '@ngrx/store';
import { initialProfileState, ProfileState } from './state';
import {
  cancelUpdateCurrentProfile,
  getCurrentProfile,
  getCurrentProfileError,
  getCurrentProfileSuccess,
  updateCurrentProfile,
  updateCurrentProfileError,
  updateCurrentProfileSuccess,
} from './actions';

export const profileReducer = createReducer<ProfileState>(
  initialProfileState,
  on(getCurrentProfile, (state) => ({
    ...state,
    loading: true,
    profile: null,
    error: false,
  })),
  on(getCurrentProfileSuccess, (state, { profile }) => ({
    ...state,
    loading: false,
    profile,
    error: false,
  })),
  on(getCurrentProfileError, (state) => ({
    ...state,
    loading: false,
    profile: null,
    error: true,
  })),
  on(updateCurrentProfile, (state) => ({
    ...state,
    loading: true,
    updated: false,
    error: false,
  })),
  on(updateCurrentProfileSuccess, (state) => ({
    ...state,
    loading: false,
    error: false,
    updated: true,
  })),
  on(updateCurrentProfileError, (state) => ({
    ...state,
    loading: false,
    error: true,
    updated: false,
  })),
  on(cancelUpdateCurrentProfile, (state) => ({
    ...state,
    loading: false,
    error: false,
    updated: false,
  }))
);
