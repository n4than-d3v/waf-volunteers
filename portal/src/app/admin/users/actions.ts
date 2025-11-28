import { createAction, props } from '@ngrx/store';
import { Profile } from './state';

export const runBeaconSync = createAction('[Users] Run beacon sync');
export const runBeaconSyncSuccess = createAction(
  '[Users] Run beacon sync success'
);
export const runBeaconSyncError = createAction('[Users] Run beacon sync error');

export const getUsers = createAction('[Users] Get users');
export const getUsersSuccess = createAction(
  '[Users] Get users success',
  props<{ users: Profile[] }>()
);
export const getUsersError = createAction('[Users] Get users error');
export const updateUser = createAction(
  '[Users] Update user',
  props<{ user: Profile }>()
);
export const updateUserSuccess = createAction('[Users] Update user success');
export const updateUserError = createAction('[Users] Update user error');

export const createUser = createAction(
  '[Users] Create user',
  props<{ user: Profile }>()
);
export const createUserSuccess = createAction(
  '[Users] Create user success',
  props<{ id: string }>()
);
export const createUserError = createAction('[Users] Create user error');

export const teamRollout = createAction(
  '[Users] Team rollout',
  props<{ day: number; timeId: number }>()
);
export const teamRolloutSuccess = createAction('[Users] Team rollout: success');
export const teamRolloutError = createAction('[Users] Team rollout: error');

export const individualRollout = createAction(
  '[Users] Individual rollout',
  props<{ username: string }>()
);
export const individualRolloutSuccess = createAction(
  '[Users] Individual rollout: success'
);
export const individualRolloutError = createAction(
  '[Users] Individual rollout: error'
);
