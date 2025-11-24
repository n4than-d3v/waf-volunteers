import { createReducer, on } from '@ngrx/store';
import { initialProfilesState, ProfilesState } from './state';
import {
  createUser,
  createUserError,
  createUserSuccess,
  getUsers,
  getUsersError,
  getUsersSuccess,
  runBeaconSync,
  runBeaconSyncError,
  runBeaconSyncSuccess,
  updateUser,
  updateUserError,
  updateUserSuccess,
} from './actions';

export const profilesReducer = createReducer<ProfilesState>(
  initialProfilesState,
  on(runBeaconSync, (state) => ({
    ...state,
    loading: true,
    profiles: null,
    error: false,
  })),
  on(runBeaconSyncSuccess, (state) => ({
    ...state,
    loading: false,
    error: false,
  })),
  on(runBeaconSyncError, (state) => ({
    ...state,
    loading: false,
    profiles: null,
    error: true,
  })),
  on(getUsers, (state) => ({
    ...state,
    loading: true,
    profiles: null,
    error: false,
  })),
  on(getUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    profiles: users,
    error: false,
  })),
  on(getUsersError, (state) => ({
    ...state,
    loading: false,
    profiles: null,
    error: true,
  })),
  on(updateUser, (state) => ({
    ...state,
    loading: true,
    updated: false,
    error: false,
  })),
  on(updateUserSuccess, (state) => ({
    ...state,
    loading: false,
    updated: true,
    error: false,
  })),
  on(updateUserError, (state) => ({
    ...state,
    loading: false,
    updated: false,
    error: true,
  })),
  on(createUser, (state) => ({
    ...state,
    loading: true,
    created: null,
    error: false,
  })),
  on(createUserSuccess, (state, action) => ({
    ...state,
    loading: false,
    created: action.id,
    error: false,
  })),
  on(createUserError, (state) => ({
    ...state,
    loading: false,
    created: null,
    error: true,
  }))
);
