import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HospitalState } from './state';

export const selectHospitalState =
  createFeatureSelector<HospitalState>('hospital');

export const selectTab = createSelector(
  selectHospitalState,
  (state) => state.tab
);

export const selectPatientCounts = createSelector(
  selectHospitalState,
  (state) => state.patientCounts
);

export const selectPatientsByStatus = createSelector(
  selectHospitalState,
  (state) => state.patientsByStatus
);

export const selectPatient = createSelector(
  selectHospitalState,
  (state) => state.patient
);

export const selectAttitudes = createSelector(
  selectHospitalState,
  (state) => state.attitudes
);

export const selectBodyConditions = createSelector(
  selectHospitalState,
  (state) => state.bodyConditions
);

export const selectDehydrations = createSelector(
  selectHospitalState,
  (state) => state.dehydrations
);

export const selectMucousMembraneColours = createSelector(
  selectHospitalState,
  (state) => state.mucousMembraneColours
);

export const selectMucousMembraneTextures = createSelector(
  selectHospitalState,
  (state) => state.mucousMembraneTextures
);
7;
export const selectDiets = createSelector(
  selectHospitalState,
  (state) => state.diets
);

export const selectTags = createSelector(
  selectHospitalState,
  (state) => state.tags
);

export const selectDispositionReasons = createSelector(
  selectHospitalState,
  (state) => state.dispositionReasons
);

export const selectReleaseTypes = createSelector(
  selectHospitalState,
  (state) => state.releaseTypes
);

export const selectTransferLocations = createSelector(
  selectHospitalState,
  (state) => state.transferLocations
);

export const selectAdministrationMethods = createSelector(
  selectHospitalState,
  (state) => state.administrationMethods
);

export const selectMedications = createSelector(
  selectHospitalState,
  (state) => state.medications
);

export const selectAreas = createSelector(
  selectHospitalState,
  (state) => state.areas
);

export const selectSpecies = createSelector(
  selectHospitalState,
  (state) => state.species
);
