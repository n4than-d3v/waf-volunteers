import { createReducer, on } from '@ngrx/store';
import { ResetPasswordState, initialForgotPasswordState } from './state';
import {
  resetPassword,
  resetPasswordError,
  resetPasswordSuccess,
} from './actions';

export const resetPasswordReducer = createReducer<ResetPasswordState>(
  initialForgotPasswordState,
  on(resetPassword, (state) => ({
    ...state,
    loading: true,
    complete: false,
    error: false,
  })),
  on(resetPasswordSuccess, (state) => ({
    ...state,
    loading: false,
    complete: true,
    error: false,
  })),
  on(resetPasswordError, (state) => ({
    ...state,
    loading: false,
    error: true,
  }))
);
