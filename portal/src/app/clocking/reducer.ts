import { createReducer, on } from '@ngrx/store';
import { ClockingState, initialClockingState } from './state';
import {
  clockIn,
  clockInFailure,
  clockInSuccess,
  clockOut,
  clockOutFailure,
  clockOutSuccess,
  getClockingRota,
  getClockingRotaFailure,
  getClockingRotaSuccess,
} from './actions';

export const clockingReducer = createReducer<ClockingState>(
  initialClockingState,
  on(getClockingRota, (state) => ({ ...state, loading: true, error: false })),
  on(clockIn, (state) => ({ ...state, loading: true, error: false })),
  on(clockOut, (state) => ({ ...state, loading: true, error: false })),
  on(getClockingRotaSuccess, (state, { rota }) => {
    return { ...state, rota, loading: false };
  }),
  on(getClockingRotaFailure, (state, _) => ({
    ...state,
    loading: false,
    error: true,
  })),
  on(clockInSuccess, (state) => ({ ...state, loading: false, error: false })),
  on(clockOutSuccess, (state) => ({ ...state, loading: false, error: false })),
  on(clockInFailure, (state) => ({ ...state, loading: false, error: true })),
  on(clockOutFailure, (state) => ({ ...state, loading: false, error: true }))
);
