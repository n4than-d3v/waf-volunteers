import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Authentication] Login',
  props<{ username: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Authentication] Login: Success',
  props<{ token: string }>()
);
export const loginFailure = createAction('[Authentication] Login: Failure');
