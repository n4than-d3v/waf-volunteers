import { createAction, props } from '@ngrx/store';

export const forgotPassword = createAction(
  '[Authentication] Forgot Password',
  props<{ username: string }>()
);
export const forgotPasswordSuccess = createAction(
  '[Authentication] Forgot Password: Success'
);
export const forgotPasswordError = createAction(
  '[Authentication] Forgot Password: Error'
);
