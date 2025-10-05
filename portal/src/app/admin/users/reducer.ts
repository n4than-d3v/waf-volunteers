import { createReducer, on } from '@ngrx/store';
import { initialProfilesState, ProfilesState } from './state';
import {
  createUser,
  createUserError,
  createUserSuccess,
  getUsers,
  getUsersError,
  getUsersSuccess,
  updateUser,
  updateUserError,
  updateUserSuccess,
} from './actions';

export const profilesReducer = createReducer<ProfilesState>(
  initialProfilesState,
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
    created: false,
    error: false,
  })),
  on(createUserSuccess, (state) => ({
    ...state,
    loading: false,
    created: true,
    error: false,
  })),
  on(createUserError, (state) => ({
    ...state,
    loading: false,
    created: false,
    error: true,
  }))
);
