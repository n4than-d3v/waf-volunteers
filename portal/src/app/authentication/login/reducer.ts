import { createReducer, on } from '@ngrx/store';
import { login, loginFailure, loginSuccess } from './actions';
import { initialLoginState, LoginState } from './state';

export const loginReducer = createReducer<LoginState>(
  initialLoginState,
  on(login, (state) => ({ ...state, loading: true, error: false })),
  on(loginSuccess, (state, { token }) => {
    return { ...state, token, loading: false };
  }),
  on(loginFailure, (state, _) => ({ ...state, loading: false, error: true }))
);
