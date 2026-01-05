import { createAction, props } from '@ngrx/store';
import {
  Attitude,
  BodyCondition,
  Dehydration,
  MucousMembraneColour,
  MucousMembraneTexture,
  ListPatient,
  Patient,
  PatientCounts,
  PatientStatus,
  Tab,
  Diet,
  Tag,
  DispositionReason,
  ReleaseType,
  TransferLocation,
  AdministrationMethod,
  Medication,
  Area,
  Species,
  Exam,
  Outcome,
} from './state';

export const setTab = createAction('[HMS-V] Switch tab', props<{ tab: Tab }>());

export const getPatientCounts = createAction('[HMS-V] Get patient counts');
export const getPatientCountsSuccess = createAction(
  '[HMS-V] Get patient counts: success',
  props<{ patientCounts: PatientCounts }>()
);
export const getPatientCountsError = createAction(
  '[HMS-V] Get patient counts: error'
);

export const getPatientsByStatus = createAction(
  '[HMS-V] Get patients by status',
  props<{ status: PatientStatus }>()
);
export const getPatientsByStatusSuccess = createAction(
  '[HMS-V] Get patients by status: success',
  props<{ patients: ListPatient[] }>()
);
export const getPatientsByStatusError = createAction(
  '[HMS-V] Get patients by status: error'
);

export const getPatient = createAction(
  '[HMS-V] Get patient',
  props<{ id: number }>()
);
export const getPatientSuccess = createAction(
  '[HMS-V] Get patient: success',
  props<{ patient: Patient }>()
);
export const getPatientError = createAction('[HMS-V] Get patient: error');

export const getAttitudes = createAction('[HMS-V] Get attitudes');
export const getAttitudesSuccess = createAction(
  '[HMS-V] Get attitudes: success',
  props<{ attitudes: Attitude[] }>()
);
export const getAttitudesError = createAction('[HMS-V] Get attitudes: error');

export const getBodyConditions = createAction('[HMS-V] Get bodyConditions');
export const getBodyConditionsSuccess = createAction(
  '[HMS-V] Get bodyConditions: success',
  props<{ bodyConditions: BodyCondition[] }>()
);
export const getBodyConditionsError = createAction(
  '[HMS-V] Get bodyConditions: error'
);

export const getDehydrations = createAction('[HMS-V] Get dehydrations');
export const getDehydrationsSuccess = createAction(
  '[HMS-V] Get dehydrations: success',
  props<{ dehydrations: Dehydration[] }>()
);
export const getDehydrationsError = createAction(
  '[HMS-V] Get dehydrations: error'
);

export const getMucousMembraneColours = createAction(
  '[HMS-V] Get mucousMembraneColours'
);
export const getMucousMembraneColoursSuccess = createAction(
  '[HMS-V] Get mucousMembraneColours: success',
  props<{ mucousMembraneColours: MucousMembraneColour[] }>()
);
export const getMucousMembraneColoursError = createAction(
  '[HMS-V] Get mucousMembraneColours: error'
);

export const getMucousMembraneTextures = createAction(
  '[HMS-V] Get mucousMembraneTextures'
);
export const getMucousMembraneTexturesSuccess = createAction(
  '[HMS-V] Get mucousMembraneTextures: success',
  props<{ mucousMembraneTextures: MucousMembraneTexture[] }>()
);
export const getMucousMembraneTexturesError = createAction(
  '[HMS-V] Get mucousMembraneTextures: error'
);

// Diets

export const getDiets = createAction('[HMS-V] Get diets');
export const getDietsSuccess = createAction(
  '[HMS-V] Get diets: success',
  props<{ diets: Diet[] }>()
);
export const getDietsError = createAction('[HMS-V] Get diets: error');

// Tags

export const getTags = createAction('[HMS-V] Get tags');
export const getTagsSuccess = createAction(
  '[HMS-V] Get tags: success',
  props<{ tags: Tag[] }>()
);
export const getTagsError = createAction('[HMS-V] Get tags: error');

// Disposition reasons

export const getDispositionReasons = createAction(
  '[HMS-V] Get disposition reasons'
);
export const getDispositionReasonsSuccess = createAction(
  '[HMS-V] Get disposition reasons: success',
  props<{ dispositionReasons: DispositionReason[] }>()
);
export const getDispositionReasonsError = createAction(
  '[HMS-V] Get disposition reasons: error'
);

// Release types

export const getReleaseTypes = createAction('[HMS-V] Get release types');
export const getReleaseTypesSuccess = createAction(
  '[HMS-V] Get release types: success',
  props<{ releaseTypes: ReleaseType[] }>()
);
export const getReleaseTypesError = createAction(
  '[HMS-V] Get release types: error'
);

// Transfer locations

export const getTransferLocations = createAction(
  '[HMS-V] Get transfer locations'
);
export const getTransferLocationsSuccess = createAction(
  '[HMS-V] Get transfer locations: success',
  props<{ transferLocations: TransferLocation[] }>()
);
export const getTransferLocationsError = createAction(
  '[HMS-V] Get transfer locations: error'
);

// Administration methods

export const getAdministrationMethods = createAction(
  '[HMS-V] Get administration methods'
);
export const getAdministrationMethodsSuccess = createAction(
  '[HMS-V] Get administration methods: success',
  props<{ administrationMethods: AdministrationMethod[] }>()
);
export const getAdministrationMethodsError = createAction(
  '[HMS-V] Get administration methods: error'
);

// Medications

export const getMedications = createAction(
  '[HMS-V] Get medications',
  props<{ search: string }>()
);
export const getMedicationsSuccess = createAction(
  '[HMS-V] Get medications: success',
  props<{ medications: Medication[] }>()
);
export const getMedicationsError = createAction(
  '[HMS-V] Get medications: error'
);

// Locations

export const getAreas = createAction('[HMS-V] Get areas');
export const getAreasSuccess = createAction(
  '[HMS-V] Get areas: success',
  props<{ areas: Area[] }>()
);
export const getAreasError = createAction('[HMS-V] Get areas: error');

// Species

export const getSpecies = createAction('[HMS-V] Get species');
export const getSpeciesSuccess = createAction(
  '[HMS-V] Get species: success',
  props<{ species: Species[] }>()
);
export const getSpeciesError = createAction('[HMS-V] Get species: error');

// Exam

export const performExam = createAction(
  '[HMS-V] Perform exam',
  props<{
    exam: Exam;
    outcome: Outcome;
    dispositionReasonId?: number;
    penId?: number;
  }>()
);
export const performExamSuccess = createAction('[HMS-V] Perform exam: success');
export const performExamError = createAction('[HMS-V] Perform exam: error');

// Disposition

export const markPatientDead = createAction(
  '[HMS-V] Mark patient dead',
  props<{
    patientId: number;
    dispositionReasonId: number;
    onArrival: boolean;
    putToSleep: boolean;
  }>()
);
export const markPatientDeadSuccess = createAction(
  '[HMS-V] Mark patient dead: success'
);
export const markPatientDeadError = createAction(
  '[HMS-V] Mark patient dead: error'
);

export const markPatientReadyForRelease = createAction(
  '[HMS-V] Mark patient ready for release',
  props<{ patientId: number }>()
);
export const markPatientReadyForReleaseSuccess = createAction(
  '[HMS-V] Mark patient ready for release: success'
);
export const markPatientReadyForReleaseError = createAction(
  '[HMS-V] Mark patient ready for release: error'
);

// Move

export const movePatient = createAction(
  '[HMS-V] Move patient',
  props<{ patientId: number; penId: number }>()
);
export const movePatientSuccess = createAction('[HMS-V] Move patient: success');
export const movePatientError = createAction('[HMS-V] Move patient: error');
