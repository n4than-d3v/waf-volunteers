import { createAction, props } from '@ngrx/store';
import {
  Diet,
  CreateDietCommand,
  Tag,
  CreateTagCommand,
  DispositionReason,
  CreateDispositionReasonCommand,
  ReleaseType,
  CreateReleaseTypeCommand,
  TransferLocation,
  CreateTransferLocationCommand,
  AdministrationMethod,
  CreateAdministrationMethodCommand,
  Medication,
  Area,
  CreateAreaCommand,
  CreatePenCommand,
  CreateSpeciesCommand,
  Species,
  CreateSpeciesAgeCommand,
  CreateSpeciesVariantCommand,
  UpdateSpeciesCommand,
  UpdateSpeciesAgeCommand,
  UpdateSpeciesVariantCommand,
} from './state';

// Diets

export const getDiets = createAction('[HMS-A] Get diets');
export const getDietsSuccess = createAction(
  '[HMS-A] Get diets: success',
  props<{ diets: Diet[] }>()
);
export const getDietsError = createAction('[HMS-A] Get diets: error');

export const createDiet = createAction(
  '[HMS-A] Create diet',
  props<{ diet: CreateDietCommand }>()
);
export const createDietSuccess = createAction('[HMS-A] Create diet: success');
export const createDietError = createAction('[HMS-A] Create diet: error');

export const updateDiet = createAction(
  '[HMS-A] Update diet',
  props<{ diet: Diet }>()
);
export const updateDietSuccess = createAction('[HMS-A] Update diet: success');
export const updateDietError = createAction('[HMS-A] Update diet: error');

// Tags

export const getTags = createAction('[HMS-A] Get tags');
export const getTagsSuccess = createAction(
  '[HMS-A] Get tags: success',
  props<{ tags: Tag[] }>()
);
export const getTagsError = createAction('[HMS-A] Get tags: error');

export const createTag = createAction(
  '[HMS-A] Create tag',
  props<{ tag: CreateTagCommand }>()
);
export const createTagSuccess = createAction('[HMS-A] Create tag: success');
export const createTagError = createAction('[HMS-A] Create tag: error');

export const updateTag = createAction(
  '[HMS-A] Update tag',
  props<{ tag: Tag }>()
);
export const updateTagSuccess = createAction('[HMS-A] Update tag: success');
export const updateTagError = createAction('[HMS-A] Update tag: error');

// Disposition reasons

export const getDispositionReasons = createAction(
  '[HMS-A] Get disposition reasons'
);
export const getDispositionReasonsSuccess = createAction(
  '[HMS-A] Get disposition reasons: success',
  props<{ dispositionReasons: DispositionReason[] }>()
);
export const getDispositionReasonsError = createAction(
  '[HMS-A] Get disposition reasons: error'
);

export const createDispositionReason = createAction(
  '[HMS-A] Create disposition reason',
  props<{ dispositionReason: CreateDispositionReasonCommand }>()
);
export const createDispositionReasonSuccess = createAction(
  '[HMS-A] Create disposition reason: success'
);
export const createDispositionReasonError = createAction(
  '[HMS-A] Create disposition reason: error'
);

export const updateDispositionReason = createAction(
  '[HMS-A] Update disposition reason',
  props<{ dispositionReason: DispositionReason }>()
);
export const updateDispositionReasonSuccess = createAction(
  '[HMS-A] Update disposition reason: success'
);
export const updateDispositionReasonError = createAction(
  '[HMS-A] Update disposition reason: error'
);

// Release types

export const getReleaseTypes = createAction('[HMS-A] Get release types');
export const getReleaseTypesSuccess = createAction(
  '[HMS-A] Get release types: success',
  props<{ releaseTypes: ReleaseType[] }>()
);
export const getReleaseTypesError = createAction(
  '[HMS-A] Get release types: error'
);

export const createReleaseType = createAction(
  '[HMS-A] Create release type',
  props<{ releaseType: CreateReleaseTypeCommand }>()
);
export const createReleaseTypeSuccess = createAction(
  '[HMS-A] Create release type: success'
);
export const createReleaseTypeError = createAction(
  '[HMS-A] Create release type: error'
);

export const updateReleaseType = createAction(
  '[HMS-A] Update release type',
  props<{ releaseType: ReleaseType }>()
);
export const updateReleaseTypeSuccess = createAction(
  '[HMS-A] Update release type: success'
);
export const updateReleaseTypeError = createAction(
  '[HMS-A] Update release type: error'
);

// Transfer locations

export const getTransferLocations = createAction(
  '[HMS-A] Get transfer locations'
);
export const getTransferLocationsSuccess = createAction(
  '[HMS-A] Get transfer locations: success',
  props<{ transferLocations: TransferLocation[] }>()
);
export const getTransferLocationsError = createAction(
  '[HMS-A] Get transfer locations: error'
);

export const createTransferLocation = createAction(
  '[HMS-A] Create transfer location',
  props<{ transferLocation: CreateTransferLocationCommand }>()
);
export const createTransferLocationSuccess = createAction(
  '[HMS-A] Create transfer location: success'
);
export const createTransferLocationError = createAction(
  '[HMS-A] Create transfer location: error'
);

export const updateTransferLocation = createAction(
  '[HMS-A] Update transfer location',
  props<{ transferLocation: TransferLocation }>()
);
export const updateTransferLocationSuccess = createAction(
  '[HMS-A] Update transfer location: success'
);
export const updateTransferLocationError = createAction(
  '[HMS-A] Update transfer location: error'
);

// Administration methods

export const getAdministrationMethods = createAction(
  '[HMS-A] Get administration methods'
);
export const getAdministrationMethodsSuccess = createAction(
  '[HMS-A] Get administration methods: success',
  props<{ administrationMethods: AdministrationMethod[] }>()
);
export const getAdministrationMethodsError = createAction(
  '[HMS-A] Get administration methods: error'
);

export const createAdministrationMethod = createAction(
  '[HMS-A] Create administration method',
  props<{ administrationMethod: CreateAdministrationMethodCommand }>()
);
export const createAdministrationMethodSuccess = createAction(
  '[HMS-A] Create administration method: success'
);
export const createAdministrationMethodError = createAction(
  '[HMS-A] Create administration method: error'
);

export const updateAdministrationMethod = createAction(
  '[HMS-A] Update administration method',
  props<{ administrationMethod: AdministrationMethod }>()
);
export const updateAdministrationMethodSuccess = createAction(
  '[HMS-A] Update administration method: success'
);
export const updateAdministrationMethodError = createAction(
  '[HMS-A] Update administration method: error'
);

// Medications

export const getMedications = createAction('[HMS-A] Get medications');
export const getMedicationsSuccess = createAction(
  '[HMS-A] Get medications: success',
  props<{ medications: Medication[] }>()
);
export const getMedicationsError = createAction(
  '[HMS-A] Get medications: error'
);

export const enableMedication = createAction(
  '[HMS-A] Enable medication',
  props<{ medicationId: number }>()
);
export const enableMedicationSuccess = createAction(
  '[HMS-A] Enable medication: success'
);
export const enableMedicationError = createAction(
  '[HMS-A] Enable medication: error'
);

export const disableMedication = createAction(
  '[HMS-A] Disable medication',
  props<{ medicationId: number }>()
);
export const disableMedicationSuccess = createAction(
  '[HMS-A] Disable medication: success'
);
export const disableMedicationError = createAction(
  '[HMS-A] Disable medication: error'
);

// Locations

export const getAreas = createAction('[HMS-A] Get areas');
export const getAreasSuccess = createAction(
  '[HMS-A] Get areas: success',
  props<{ areas: Area[] }>()
);
export const getAreasError = createAction('[HMS-A] Get areas: error');

export const createArea = createAction(
  '[HMS-A] Create area',
  props<{ area: CreateAreaCommand }>()
);
export const createAreaSuccess = createAction('[HMS-A] Create area: success');
export const createAreaError = createAction('[HMS-A] Create area: error');

export const createPen = createAction(
  '[HMS-A] Create pen',
  props<{ pen: CreatePenCommand }>()
);
export const createPenSuccess = createAction('[HMS-A] Create pen: success');
export const createPenError = createAction('[HMS-A] Create pen: error');

// Species

export const getSpecies = createAction('[HMS-A] Get species');
export const getSpeciesSuccess = createAction(
  '[HMS-A] Get species: success',
  props<{ species: Species[] }>()
);
export const getSpeciesError = createAction('[HMS-A] Get species: error');

export const createSpecies = createAction(
  '[HMS-A] Create species',
  props<{ species: CreateSpeciesCommand }>()
);
export const createSpeciesSuccess = createAction(
  '[HMS-A] Create species: success'
);
export const createSpeciesError = createAction('[HMS-A] Create species: error');

export const createSpeciesAge = createAction(
  '[HMS-A] Create species age',
  props<{ age: CreateSpeciesAgeCommand }>()
);
export const createSpeciesAgeSuccess = createAction(
  '[HMS-A] Create species age: success'
);
export const createSpeciesAgeError = createAction(
  '[HMS-A] Create species age: error'
);

export const createSpeciesVariant = createAction(
  '[HMS-A] Create species variant',
  props<{ variant: CreateSpeciesVariantCommand }>()
);
export const createSpeciesVariantSuccess = createAction(
  '[HMS-A] Create species variant: success'
);
export const createSpeciesVariantError = createAction(
  '[HMS-A] Create species variant: error'
);

export const updateSpecies = createAction(
  '[HMS-A] Update species',
  props<{ species: UpdateSpeciesCommand }>()
);
export const updateSpeciesSuccess = createAction(
  '[HMS-A] Update species: success'
);
export const updateSpeciesError = createAction('[HMS-A] Update species: error');

export const updateSpeciesAge = createAction(
  '[HMS-A] Update species age',
  props<{ age: UpdateSpeciesAgeCommand }>()
);
export const updateSpeciesAgeSuccess = createAction(
  '[HMS-A] Update species age: success'
);
export const updateSpeciesAgeError = createAction(
  '[HMS-A] Update species age: error'
);

export const updateSpeciesVariant = createAction(
  '[HMS-A] Update species variant',
  props<{ variant: UpdateSpeciesVariantCommand }>()
);
export const updateSpeciesVariantSuccess = createAction(
  '[HMS-A] Update species variant: success'
);
export const updateSpeciesVariantError = createAction(
  '[HMS-A] Update species variant: error'
);
