import { createReducer, on } from '@ngrx/store';
import {
  initialAdminHospitalManagementState,
  AdminHospitalManagementState,
} from './state';
import {
  changePenStatus,
  changePenStatusError,
  changePenStatusSuccess,
  createArea,
  createAreaError,
  createAreaSuccess,
  createDiet,
  createDietError,
  createDietSuccess,
  createDispositionReason,
  createDispositionReasonError,
  createDispositionReasonSuccess,
  upsertMedication,
  upsertMedicationConcentration,
  upsertMedicationConcentrationError,
  upsertMedicationConcentrationSpeciesDose,
  upsertMedicationConcentrationSpeciesDoseError,
  upsertMedicationConcentrationSpeciesDoseSuccess,
  upsertMedicationConcentrationSuccess,
  upsertMedicationError,
  upsertMedicationSuccess,
  createPen,
  createPenError,
  createPenSuccess,
  createReleaseType,
  createReleaseTypeError,
  createReleaseTypeSuccess,
  createSpecies,
  createSpeciesError,
  createSpeciesSuccess,
  createSpeciesVariant,
  createSpeciesVariantError,
  createSpeciesVariantSuccess,
  createTag,
  createTagError,
  createTagSuccess,
  createTransferLocation,
  createTransferLocationError,
  createTransferLocationSuccess,
  getAreas,
  getAreasError,
  getAreasSuccess,
  getDiets,
  getDietsError,
  getDietsSuccess,
  getDispositionReasons,
  getDispositionReasonsError,
  getDispositionReasonsSuccess,
  getMedications,
  getMedicationsError,
  getMedicationsSuccess,
  getReleaseTypes,
  getReleaseTypesError,
  getReleaseTypesSuccess,
  getSpecies,
  getSpeciesError,
  getSpeciesSuccess,
  getTags,
  getTagsError,
  getTagsSuccess,
  getTransferLocations,
  getTransferLocationsError,
  getTransferLocationsSuccess,
  movePen,
  movePenError,
  movePenSuccess,
  updateDiet,
  updateDietError,
  updateDietSuccess,
  updateDispositionReason,
  updateDispositionReasonError,
  updateDispositionReasonSuccess,
  updateReleaseType,
  updateReleaseTypeError,
  updateReleaseTypeSuccess,
  updateSpecies,
  updateSpeciesError,
  updateSpeciesSuccess,
  updateSpeciesVariant,
  updateSpeciesVariantError,
  updateSpeciesVariantSuccess,
  updateTag,
  updateTagError,
  updateTagSuccess,
  updateTransferLocation,
  updateTransferLocationError,
  updateTransferLocationSuccess,
  getBoards,
  getBoardsSuccess,
  getBoardsError,
} from './actions';

export const adminHospitalManagementReducer =
  createReducer<AdminHospitalManagementState>(
    initialAdminHospitalManagementState,
    // Diets
    on(getDiets, (state) => ({
      ...state,
      diets: {
        ...state.diets,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(getDietsSuccess, (state, { diets }) => ({
      ...state,
      diets: {
        ...state.diets,
        data: diets,
        loading: false,
      },
    })),
    on(getDietsError, (state) => ({
      ...state,
      diets: {
        ...state.diets,
        loading: false,
        error: true,
      },
    })),
    on(createDiet, (state) => ({
      ...state,
      diets: {
        ...state.diets,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(createDietSuccess, (state) => ({
      ...state,
      diets: {
        ...state.diets,
        loading: false,
        created: true,
      },
    })),
    on(createDietError, (state) => ({
      ...state,
      diets: {
        ...state.diets,
        loading: false,
        error: true,
      },
    })),
    on(updateDiet, (state) => ({
      ...state,
      diets: {
        ...state.diets,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(updateDietSuccess, (state) => ({
      ...state,
      diets: {
        ...state.diets,
        loading: false,
        updated: true,
      },
    })),
    on(updateDietError, (state) => ({
      ...state,
      diets: {
        ...state.diets,
        loading: false,
        error: true,
      },
    })),
    // Tags
    on(getTags, (state) => ({
      ...state,
      tags: {
        ...state.tags,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(getTagsSuccess, (state, { tags }) => ({
      ...state,
      tags: {
        ...state.tags,
        data: tags,
        loading: false,
      },
    })),
    on(getTagsError, (state) => ({
      ...state,
      tags: {
        ...state.tags,
        loading: false,
        error: true,
      },
    })),
    on(createTag, (state) => ({
      ...state,
      tags: {
        ...state.tags,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(createTagSuccess, (state) => ({
      ...state,
      tags: {
        ...state.tags,
        loading: false,
        created: true,
      },
    })),
    on(createTagError, (state) => ({
      ...state,
      tags: {
        ...state.tags,
        loading: false,
        error: true,
      },
    })),
    on(updateTag, (state) => ({
      ...state,
      tags: {
        ...state.tags,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(updateTagSuccess, (state) => ({
      ...state,
      tags: {
        ...state.tags,
        loading: false,
        updated: true,
      },
    })),
    on(updateTagError, (state) => ({
      ...state,
      tags: {
        ...state.tags,
        loading: false,
        error: true,
      },
    })),
    // Disposition reasons
    on(getDispositionReasons, (state) => ({
      ...state,
      dispositionReasons: {
        ...state.dispositionReasons,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(getDispositionReasonsSuccess, (state, { dispositionReasons }) => ({
      ...state,
      dispositionReasons: {
        ...state.dispositionReasons,
        data: dispositionReasons,
        loading: false,
      },
    })),
    on(getDispositionReasonsError, (state) => ({
      ...state,
      dispositionReasons: {
        ...state.dispositionReasons,
        loading: false,
        error: true,
      },
    })),
    on(createDispositionReason, (state) => ({
      ...state,
      dispositionReasons: {
        ...state.dispositionReasons,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(createDispositionReasonSuccess, (state) => ({
      ...state,
      dispositionReasons: {
        ...state.dispositionReasons,
        loading: false,
        created: true,
      },
    })),
    on(createDispositionReasonError, (state) => ({
      ...state,
      dispositionReasons: {
        ...state.dispositionReasons,
        loading: false,
        error: true,
      },
    })),
    on(updateDispositionReason, (state) => ({
      ...state,
      dispositionReasons: {
        ...state.dispositionReasons,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(updateDispositionReasonSuccess, (state) => ({
      ...state,
      dispositionReasons: {
        ...state.dispositionReasons,
        loading: false,
        updated: true,
      },
    })),
    on(updateDispositionReasonError, (state) => ({
      ...state,
      dispositionReasons: {
        ...state.dispositionReasons,
        loading: false,
        error: true,
      },
    })),
    // Release types
    on(getReleaseTypes, (state) => ({
      ...state,
      releaseTypes: {
        ...state.releaseTypes,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(getReleaseTypesSuccess, (state, { releaseTypes }) => ({
      ...state,
      releaseTypes: {
        ...state.releaseTypes,
        data: releaseTypes,
        loading: false,
      },
    })),
    on(getReleaseTypesError, (state) => ({
      ...state,
      releaseTypes: {
        ...state.releaseTypes,
        loading: false,
        error: true,
      },
    })),
    on(createReleaseType, (state) => ({
      ...state,
      releaseTypes: {
        ...state.releaseTypes,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(createReleaseTypeSuccess, (state) => ({
      ...state,
      releaseTypes: {
        ...state.releaseTypes,
        loading: false,
        created: true,
      },
    })),
    on(createReleaseTypeError, (state) => ({
      ...state,
      releaseTypes: {
        ...state.releaseTypes,
        loading: false,
        error: true,
      },
    })),
    on(updateReleaseType, (state) => ({
      ...state,
      releaseTypes: {
        ...state.releaseTypes,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(updateReleaseTypeSuccess, (state) => ({
      ...state,
      releaseTypes: {
        ...state.releaseTypes,
        loading: false,
        updated: true,
      },
    })),
    on(updateReleaseTypeError, (state) => ({
      ...state,
      releaseTypes: {
        ...state.releaseTypes,
        loading: false,
        error: true,
      },
    })),
    // Transfer locations
    on(getTransferLocations, (state) => ({
      ...state,
      transferLocations: {
        ...state.transferLocations,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(getTransferLocationsSuccess, (state, { transferLocations }) => ({
      ...state,
      transferLocations: {
        ...state.transferLocations,
        data: transferLocations,
        loading: false,
      },
    })),
    on(getTransferLocationsError, (state) => ({
      ...state,
      transferLocations: {
        ...state.transferLocations,
        loading: false,
        error: true,
      },
    })),
    on(createTransferLocation, (state) => ({
      ...state,
      transferLocations: {
        ...state.transferLocations,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(createTransferLocationSuccess, (state) => ({
      ...state,
      transferLocations: {
        ...state.transferLocations,
        loading: false,
        created: true,
      },
    })),
    on(createTransferLocationError, (state) => ({
      ...state,
      transferLocations: {
        ...state.transferLocations,
        loading: false,
        error: true,
      },
    })),
    on(updateTransferLocation, (state) => ({
      ...state,
      transferLocations: {
        ...state.transferLocations,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(updateTransferLocationSuccess, (state) => ({
      ...state,
      transferLocations: {
        ...state.transferLocations,
        loading: false,
        updated: true,
      },
    })),
    on(updateTransferLocationError, (state) => ({
      ...state,
      transferLocations: {
        ...state.transferLocations,
        loading: false,
        error: true,
      },
    })),
    // Medications
    on(getMedications, (state) => ({
      ...state,
      medications: {
        ...state.medications,
        loading: true,
        error: false,
        updated: false,
      },
    })),
    on(getMedicationsSuccess, (state, { medications }) => ({
      ...state,
      medications: {
        ...state.medications,
        data: medications,
        loading: false,
      },
    })),
    on(getMedicationsError, (state) => ({
      ...state,
      medications: {
        ...state.medications,
        loading: false,
        error: true,
      },
    })),
    on(
      upsertMedication,
      upsertMedicationConcentration,
      upsertMedicationConcentrationSpeciesDose,
      (state) => ({
        ...state,
        medications: {
          ...state.medications,
          loading: true,
          error: false,
        },
      }),
    ),
    on(
      upsertMedicationSuccess,
      upsertMedicationConcentrationSuccess,
      upsertMedicationConcentrationSpeciesDoseSuccess,
      (state) => ({
        ...state,
        medications: {
          ...state.medications,
          loading: false,
          updated: true,
        },
      }),
    ),
    on(
      upsertMedicationError,
      upsertMedicationConcentrationError,
      upsertMedicationConcentrationSpeciesDoseError,
      (state) => ({
        ...state,
        medications: {
          ...state.medications,
          loading: false,
          error: true,
        },
      }),
    ),
    // Areas
    on(getAreas, (state) => ({
      ...state,
      areas: {
        ...state.areas,
        loading: true,
        error: false,
        created: false,
      },
    })),
    on(getAreasSuccess, (state, { areas }) => ({
      ...state,
      areas: {
        ...state.areas,
        data: areas,
        loading: false,
      },
    })),
    on(getAreasError, (state) => ({
      ...state,
      areas: {
        ...state.areas,
        loading: false,
        error: true,
      },
    })),
    on(createArea, (state) => ({
      ...state,
      areas: {
        ...state.areas,
        loading: true,
        error: false,
      },
    })),
    on(createAreaSuccess, (state) => ({
      ...state,
      areas: {
        ...state.areas,
        loading: false,
        created: true,
      },
    })),
    on(createAreaError, (state) => ({
      ...state,
      areas: {
        ...state.areas,
        loading: false,
        error: true,
      },
    })),
    on(createPen, movePen, changePenStatus, (state) => ({
      ...state,
      areas: {
        ...state.areas,
        loading: true,
        error: false,
      },
    })),
    on(createPenSuccess, movePenSuccess, changePenStatusSuccess, (state) => ({
      ...state,
      areas: {
        ...state.areas,
        loading: false,
        created: true,
      },
    })),
    on(createPenError, movePenError, changePenStatusError, (state) => ({
      ...state,
      areas: {
        ...state.areas,
        loading: false,
        error: true,
      },
    })),
    // Species
    on(getSpecies, (state) => ({
      ...state,
      species: {
        ...state.species,
        loading: true,
        error: false,
        created: false,
        updated: false,
      },
    })),
    on(getSpeciesSuccess, (state, { species }) => ({
      ...state,
      species: {
        ...state.species,
        data: species,
        loading: false,
      },
    })),
    on(getSpeciesError, (state) => ({
      ...state,
      species: {
        ...state.species,
        loading: false,
        error: true,
      },
    })),
    on(createSpecies, createSpeciesVariant, (state) => ({
      ...state,
      species: {
        ...state.species,
        loading: true,
        error: false,
      },
    })),
    on(createSpeciesSuccess, createSpeciesVariantSuccess, (state) => ({
      ...state,
      species: {
        ...state.species,
        loading: false,
        created: true,
      },
    })),
    on(createSpeciesError, createSpeciesVariantError, (state) => ({
      ...state,
      species: {
        ...state.species,
        loading: false,
        error: true,
      },
    })),
    on(updateSpecies, updateSpeciesVariant, (state) => ({
      ...state,
      species: {
        ...state.species,
        loading: true,
        error: false,
      },
    })),
    on(updateSpeciesSuccess, updateSpeciesVariantSuccess, (state) => ({
      ...state,
      species: {
        ...state.species,
        loading: false,
        updated: true,
      },
    })),
    on(updateSpeciesError, updateSpeciesVariantError, (state) => ({
      ...state,
      species: {
        ...state.species,
        loading: false,
        error: true,
      },
    })),
    on(getBoards, (state) => ({
      ...state,
      boards: {
        ...state.boards,
        loading: true,
        error: false,
      },
    })),
    on(getBoardsSuccess, (state, { boards }) => ({
      ...state,
      boards: {
        ...state.boards,
        data: boards,
        loading: false,
      },
    })),
    on(getBoardsError, (state) => ({
      ...state,
      boards: {
        ...state.boards,
        loading: false,
        error: true,
      },
    })),
  );
