import { createReducer, on } from '@ngrx/store';
import { initialRotaState, RotaState } from './state';
import {
  confirmShift,
  confirmShiftError,
  confirmShiftSuccess,
  denyShift,
  denyShiftError,
  denyShiftSuccess,
  getRota,
  getRotaError,
  getRotaSuccess,
} from './actions';

export const rotaReducer = createReducer<RotaState>(
  initialRotaState,
  on(getRota, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(getRotaSuccess, (state, { rota }) => ({
    ...state,
    loading: false,
    rota,
    error: false,
  })),
  on(getRotaError, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),
  on(confirmShift, (state) => ({
    ...state,
    confirming: true,
    confirmed: false,
  })),
  on(confirmShiftSuccess, (state) => ({
    ...state,
    confirming: false,
    confirmed: true,
  })),
  on(confirmShiftError, (state) => ({
    ...state,
    confirming: false,
    error: true,
  })),
  on(denyShift, (state) => ({
    ...state,
    denying: true,
    denied: false,
  })),
  on(denyShiftSuccess, (state) => ({
    ...state,
    denying: false,
    denied: true,
  })),
  on(denyShiftError, (state) => ({
    ...state,
    denying: false,
    error: true,
  }))
);
