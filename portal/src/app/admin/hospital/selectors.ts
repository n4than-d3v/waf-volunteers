import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminHospitalManagementState } from './state';

export const selectAdminHospitalManagementState =
  createFeatureSelector<AdminHospitalManagementState>(
    'adminHospitalManagement',
  );

export const selectDiets = createSelector(
  selectAdminHospitalManagementState,
  (state) => state.diets,
);

export const selectTags = createSelector(
  selectAdminHospitalManagementState,
  (state) => state.tags,
);

export const selectDispositionReasons = createSelector(
  selectAdminHospitalManagementState,
  (state) => state.dispositionReasons,
);

export const selectReleaseTypes = createSelector(
  selectAdminHospitalManagementState,
  (state) => state.releaseTypes,
);

export const selectTransferLocations = createSelector(
  selectAdminHospitalManagementState,
  (state) => state.transferLocations,
);

export const selectMedications = createSelector(
  selectAdminHospitalManagementState,
  (state) => state.medications,
);

export const selectAreas = createSelector(
  selectAdminHospitalManagementState,
  (state) => state.areas,
);

export const selectSpecies = createSelector(
  selectAdminHospitalManagementState,
  (state) => state.species,
);

export const selectBoards = createSelector(
  selectAdminHospitalManagementState,
  (state) => state.boards,
);
