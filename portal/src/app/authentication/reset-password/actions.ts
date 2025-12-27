import { createAction, props } from '@ngrx/store';

export const resetPassword = createAction(
  '[Authentication] Reset Password',
  props<{ token: string; password: string }>()
);
export const resetPasswordSuccess = createAction(
  '[Authentication] Reset Password: Success'
);
export const resetPasswordError = createAction(
  '[Authentication] Reset Password: Error'
);
