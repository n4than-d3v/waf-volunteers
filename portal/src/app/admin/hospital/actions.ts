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
  Medication,
  Area,
  CreateAreaCommand,
  CreatePenCommand,
  CreateSpeciesCommand,
  Species,
  CreateSpeciesVariantCommand,
  UpdateSpeciesCommand,
  UpdateSpeciesVariantCommand,
  SpeciesType,
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

// Medications

export const getMedications = createAction('[HMS-A] Get medications');
export const getMedicationsSuccess = createAction(
  '[HMS-A] Get medications: success',
  props<{ medications: Medication[] }>()
);
export const getMedicationsError = createAction(
  '[HMS-A] Get medications: error'
);

export const createMedication = createAction(
  '[HMS-A] Create medication',
  props<{ activeSubstance: string; brands: string[]; notes: string }>()
);
export const createMedicationSuccess = createAction(
  '[HMS-A] Create medication: success'
);
export const createMedicationError = createAction(
  '[HMS-A] Create medication: error'
);

export const createMedicationConcentration = createAction(
  '[HMS-A] Create medication concentration',
  props<{
    medicationId: number;
    form: string;
    concentrationMgMl: number;
  }>()
);
export const createMedicationConcentrationSuccess = createAction(
  '[HMS-A] Create medication concentration: success'
);
export const createMedicationConcentrationError = createAction(
  '[HMS-A] Create medication concentration: error'
);

export const createMedicationConcentrationSpeciesDose = createAction(
  '[HMS-A] Create medication concentration species dose',
  props<{
    medicationConcentrationId: number;
    speciesId: number | null;
    speciesType: SpeciesType | null;
    doseMgKgRangeStart: number;
    doseMgKgRangeEnd: number;
    doseMlKgRangeStart: number;
    doseMlKgRangeEnd: number;
    administrationMethodId: number;
    frequency: string;
    notes: string;
  }>()
);
export const createMedicationConcentrationSpeciesDoseSuccess = createAction(
  '[HMS-A] Create medication concentration species dose: success'
);
export const createMedicationConcentrationSpeciesDoseError = createAction(
  '[HMS-A] Create medication concentration species dose: error'
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

export const movePen = createAction(
  '[HMS-A] Move pen',
  props<{ penId: number; areaId: number }>()
);
export const movePenSuccess = createAction('[HMS-A] Move pen: success');
export const movePenError = createAction('[HMS-A] Move pen: error');

export const changePenStatus = createAction(
  '[HMS-A] Change pen status',
  props<{ penId: number; enabled: boolean }>()
);
export const changePenStatusSuccess = createAction(
  '[HMS-A] Change pen status: success'
);
export const changePenStatusError = createAction(
  '[HMS-A] Change pen status: error'
);

export const changeAreaStatus = createAction(
  '[HMS-A] Change area status',
  props<{ areaId: number; enabled: boolean }>()
);
export const changeAreaStatusSuccess = createAction(
  '[HMS-A] Change area status: success'
);
export const changeAreaStatusError = createAction(
  '[HMS-A] Change area status: error'
);

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
