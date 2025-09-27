import { createReducer, on } from '@ngrx/store';
import { ForgotPasswordState, initialForgotPasswordState } from './state';
import {
  forgotPassword,
  forgotPasswordError,
  forgotPasswordSuccess,
} from './actions';

export const forgotPasswordReducer = createReducer<ForgotPasswordState>(
  initialForgotPasswordState,
  on(forgotPassword, (state) => ({
    ...state,
    loading: true,
    complete: false,
    error: false,
  })),
  on(forgotPasswordSuccess, (state) => ({
    ...state,
    loading: false,
    complete: true,
    error: false,
  })),
  on(forgotPasswordError, (state) => ({
    ...state,
    loading: false,
    error: true,
  }))
);
