import { createAction, props } from '@ngrx/store';
import { Profile } from './state';

export const getUsers = createAction('[Users] Get users');
export const getUsersSuccess = createAction(
  '[Users] Get users success',
  props<{ users: Profile[] }>()
);
export const getUsersError = createAction('[Users] Get users error');
export const updateUser = createAction(
  '[Users] Update user',
  props<{ update: '' | 'roles' | 'status'; user: Profile }>()
);
export const updateUserSuccess = createAction('[Users] Update user success');
export const updateUserError = createAction('[Users] Update user error');
