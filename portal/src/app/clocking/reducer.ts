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
  visitorClockIn,
  visitorClockInFailure,
  visitorClockInSuccess,
  visitorClockOut,
  visitorClockOutFailure,
  visitorClockOutSuccess,
} from './actions';

export const clockingReducer = createReducer<ClockingState>(
  initialClockingState,
  on(getClockingRota, (state) => ({ ...state, loading: true, error: false })),
  on(clockIn, visitorClockIn, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(clockOut, visitorClockOut, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(getClockingRotaSuccess, (state, { rota }) => {
    return { ...state, rota, loading: false };
  }),
  on(getClockingRotaFailure, (state, _) => ({
    ...state,
    loading: false,
    error: true,
  })),
  on(clockInSuccess, visitorClockInSuccess, (state) => ({
    ...state,
    loading: false,
    error: false,
  })),
  on(clockOutSuccess, visitorClockOutSuccess, (state) => ({
    ...state,
    loading: false,
    error: false,
  })),
  on(clockInFailure, visitorClockInFailure, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),
  on(clockOutFailure, visitorClockOutFailure, (state) => ({
    ...state,
    loading: false,
    error: true,
  }))
);
