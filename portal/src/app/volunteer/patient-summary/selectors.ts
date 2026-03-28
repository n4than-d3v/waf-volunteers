import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PatientSummaryState } from './state';

export const selectPatientSummaryState =
  createFeatureSelector<PatientSummaryState>('patientSummary');

export const selectPatientSummary = createSelector(
  selectPatientSummaryState,
  (state) => state.summary,
);
