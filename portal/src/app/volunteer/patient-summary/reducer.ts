import { createReducer, on } from '@ngrx/store';
import { initialPatientSummaryState, PatientSummaryState } from './state';
import {
  getCurrentPatientsSummary,
  getCurrentPatientsSummarySuccess,
  getCurrentPatientsSummaryError,
} from './actions';

export const patientSummaryReducer = createReducer<PatientSummaryState>(
  initialPatientSummaryState,
  on(getCurrentPatientsSummary, (state) => ({
    ...state,
    summary: {
      ...state.summary,
      loading: true,
      error: false,
    },
  })),
  on(getCurrentPatientsSummarySuccess, (state, { summary }) => ({
    ...state,
    summary: {
      ...state.summary,
      data: summary,
      loading: false,
    },
  })),
  on(getCurrentPatientsSummaryError, (state) => ({
    ...state,
    summary: {
      ...state.summary,
      loading: false,
      error: true,
    },
  })),
);
