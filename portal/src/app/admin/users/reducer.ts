import { createReducer, on } from '@ngrx/store';
import { initialProfilesState, ProfilesState } from './state';
import { getUsers, getUsersError, getUsersSuccess } from './actions';

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
  }))
);
