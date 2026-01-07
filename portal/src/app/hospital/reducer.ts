import { createReducer, on } from '@ngrx/store';
import { HospitalState, initialHospitalState } from './state';
import {
  getPatient,
  getPatientCounts,
  getPatientCountsError,
  getPatientCountsSuccess,
  getPatientError,
  getPatientsByStatus,
  getPatientsByStatusError,
  getPatientsByStatusSuccess,
  getPatientSuccess,
  setTab,
  getAttitudes,
  getAttitudesSuccess,
  getAttitudesError,
  getBodyConditions,
  getBodyConditionsSuccess,
  getBodyConditionsError,
  getDehydrations,
  getDehydrationsSuccess,
  getDehydrationsError,
  getMucousMembraneColours,
  getMucousMembraneColoursSuccess,
  getMucousMembraneColoursError,
  getMucousMembraneTextures,
  getMucousMembraneTexturesSuccess,
  getMucousMembraneTexturesError,
  getAdministrationMethods,
  getAdministrationMethodsError,
  getAdministrationMethodsSuccess,
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
  performExam,
  performExamSuccess,
  performExamError,
  markPatientDead,
  markPatientDeadSuccess,
  markPatientDeadError,
  markPatientReadyForRelease,
  markPatientReadyForReleaseError,
  markPatientReadyForReleaseSuccess,
  movePatient,
  movePatientError,
  movePatientSuccess,
  addNote,
  addNoteSuccess,
  addNoteError,
  addRecheck,
  addRecheckSuccess,
  addRecheckError,
  addPrescriptionInstruction,
  addPrescriptionMedication,
  addPrescriptionInstructionSuccess,
  addPrescriptionMedicationSuccess,
  addPrescriptionInstructionError,
  addPrescriptionMedicationError,
  removeRecheck,
  removeRecheckSuccess,
  removeRecheckError,
  removePrescriptionInstruction,
  removePrescriptionMedication,
  removePrescriptionInstructionSuccess,
  removePrescriptionMedicationSuccess,
  removePrescriptionInstructionError,
  removePrescriptionMedicationError,
  markPatientReleased,
  markPatientTransferred,
  markPatientReleasedSuccess,
  markPatientTransferredSuccess,
  markPatientReleasedError,
  markPatientTransferredError,
  requestHomeCare,
  requestHomeCareSuccess,
  requestHomeCareError,
  updatePatientBasicDetails,
  updatePatientBasicDetailsSuccess,
  updatePatientBasicDetailsError,
  homeCarerDropOff,
  homeCarerDropOffSuccess,
  homeCarerDropOffError,
} from './actions';

export const hospitalReducer = createReducer<HospitalState>(
  initialHospitalState,
  on(setTab, (state, { tab }) => ({
    ...state,
    tab: { ...tab },
  })),
  // Patient counts
  on(getPatientCounts, (state) => ({
    ...state,
    patientCounts: {
      ...state.patientCounts,
      loading: true,
      error: false,
    },
  })),
  on(getPatientCountsSuccess, (state, { patientCounts }) => ({
    ...state,
    patientCounts: {
      ...state.patientCounts,
      data: patientCounts,
      loading: false,
    },
  })),
  on(getPatientCountsError, (state) => ({
    ...state,
    patientCounts: {
      ...state.patientCounts,
      loading: false,
      error: true,
    },
  })),
  // Patients by status
  on(getPatientsByStatus, (state) => ({
    ...state,
    patientsByStatus: {
      ...state.patientsByStatus,
      loading: true,
      error: false,
    },
  })),
  on(getPatientsByStatusSuccess, (state, { patients }) => ({
    ...state,
    patientsByStatus: {
      ...state.patientsByStatus,
      data: patients,
      loading: false,
    },
  })),
  on(getPatientsByStatusError, (state) => ({
    ...state,
    patientsByStatus: {
      ...state.patientsByStatus,
      loading: false,
      error: true,
    },
  })),
  // Patient
  on(getPatient, (state, action) => ({
    ...state,
    patient: {
      ...state.patient,
      loading: action.silent ? false : true,
      error: false,
    },
  })),
  on(getPatientSuccess, (state, { patient }) => ({
    ...state,
    patient: {
      ...state.patient,
      data: patient,
      loading: false,
    },
  })),
  on(getPatientError, (state) => ({
    ...state,
    patient: {
      ...state.patient,
      loading: false,
      error: true,
    },
  })),
  // Attitude
  on(getAttitudes, (state) => ({
    ...state,
    attitudes: {
      ...state.attitudes,
      loading: true,
      error: false,
    },
  })),
  on(getAttitudesSuccess, (state, { attitudes }) => ({
    ...state,
    attitudes: {
      ...state.attitudes,
      data: attitudes,
      loading: false,
    },
  })),
  on(getAttitudesError, (state) => ({
    ...state,
    attitudes: {
      ...state.attitudes,
      loading: false,
      error: true,
    },
  })),

  // BodyCondition
  on(getBodyConditions, (state) => ({
    ...state,
    bodyConditions: {
      ...state.bodyConditions,
      loading: true,
      error: false,
    },
  })),
  on(getBodyConditionsSuccess, (state, { bodyConditions }) => ({
    ...state,
    bodyConditions: {
      ...state.bodyConditions,
      data: bodyConditions,
      loading: false,
    },
  })),
  on(getBodyConditionsError, (state) => ({
    ...state,
    bodyConditions: {
      ...state.bodyConditions,
      loading: false,
      error: true,
    },
  })),

  // Dehydration
  on(getDehydrations, (state) => ({
    ...state,
    dehydrations: {
      ...state.dehydrations,
      loading: true,
      error: false,
    },
  })),
  on(getDehydrationsSuccess, (state, { dehydrations }) => ({
    ...state,
    dehydrations: {
      ...state.dehydrations,
      data: dehydrations,
      loading: false,
    },
  })),
  on(getDehydrationsError, (state) => ({
    ...state,
    dehydrations: {
      ...state.dehydrations,
      loading: false,
      error: true,
    },
  })),

  // MucousMembraneColour
  on(getMucousMembraneColours, (state) => ({
    ...state,
    mucousMembraneColours: {
      ...state.mucousMembraneColours,
      loading: true,
      error: false,
    },
  })),
  on(getMucousMembraneColoursSuccess, (state, { mucousMembraneColours }) => ({
    ...state,
    mucousMembraneColours: {
      ...state.mucousMembraneColours,
      data: mucousMembraneColours,
      loading: false,
    },
  })),
  on(getMucousMembraneColoursError, (state) => ({
    ...state,
    mucousMembraneColours: {
      ...state.mucousMembraneColours,
      loading: false,
      error: true,
    },
  })),

  // MucousMembraneTexture
  on(getMucousMembraneTextures, (state) => ({
    ...state,
    mucousMembraneTextures: {
      ...state.mucousMembraneTextures,
      loading: true,
      error: false,
    },
  })),
  on(getMucousMembraneTexturesSuccess, (state, { mucousMembraneTextures }) => ({
    ...state,
    mucousMembraneTextures: {
      ...state.mucousMembraneTextures,
      data: mucousMembraneTextures,
      loading: false,
    },
  })),
  on(getMucousMembraneTexturesError, (state) => ({
    ...state,
    mucousMembraneTextures: {
      ...state.mucousMembraneTextures,
      loading: false,
      error: true,
    },
  })), // Diets
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
  // Administration methods
  on(getAdministrationMethods, (state) => ({
    ...state,
    administrationMethods: {
      ...state.administrationMethods,
      loading: true,
      error: false,
      created: false,
      updated: false,
    },
  })),
  on(getAdministrationMethodsSuccess, (state, { administrationMethods }) => ({
    ...state,
    administrationMethods: {
      ...state.administrationMethods,
      data: administrationMethods,
      loading: false,
    },
  })),
  on(getAdministrationMethodsError, (state) => ({
    ...state,
    administrationMethods: {
      ...state.administrationMethods,
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
  // Perform exam
  on(performExam, (state) => ({
    ...state,
    performExam: {
      ...state.performExam,
      loading: true,
      success: false,
      error: false,
    },
  })),
  on(performExamSuccess, (state) => ({
    ...state,
    performExam: {
      ...state.performExam,
      loading: false,
      success: true,
    },
  })),
  on(performExamError, (state) => ({
    ...state,
    performExam: {
      ...state.performExam,
      loading: false,
      error: true,
    },
  })),
  // Set disposition
  on(
    markPatientDead,
    markPatientReadyForRelease,
    markPatientReleased,
    markPatientTransferred,
    (state) => ({
      ...state,
      setDisposition: {
        ...state.setDisposition,
        loading: true,
        success: false,
        error: false,
      },
    })
  ),
  on(
    markPatientDeadSuccess,
    markPatientReadyForReleaseSuccess,
    markPatientReleasedSuccess,
    markPatientTransferredSuccess,
    (state) => ({
      ...state,
      setDisposition: {
        ...state.setDisposition,
        loading: false,
        success: true,
      },
    })
  ),
  on(
    markPatientDeadError,
    markPatientReadyForReleaseError,
    markPatientReleasedError,
    markPatientTransferredError,
    (state) => ({
      ...state,
      setDisposition: {
        ...state.setDisposition,
        loading: false,
        error: true,
      },
    })
  ),
  // Move patient
  on(movePatient, (state) => ({
    ...state,
    movePatient: {
      ...state.movePatient,
      loading: true,
      success: false,
      error: false,
    },
  })),
  on(movePatientSuccess, (state) => ({
    ...state,
    movePatient: {
      ...state.movePatient,
      loading: false,
      success: true,
    },
  })),
  on(movePatientError, (state) => ({
    ...state,
    movePatient: {
      ...state.movePatient,
      loading: false,
      error: true,
    },
  })),
  // Add note
  on(addNote, (state) => ({
    ...state,
    addNote: {
      ...state.addNote,
      loading: true,
      success: false,
      error: false,
    },
  })),
  on(addNoteSuccess, (state) => ({
    ...state,
    addNote: {
      ...state.addNote,
      loading: false,
      success: true,
    },
  })),
  on(addNoteError, (state) => ({
    ...state,
    addNote: {
      ...state.addNote,
      loading: false,
      error: true,
    },
  })),
  // Add recheck
  on(addRecheck, (state) => ({
    ...state,
    addRecheck: {
      ...state.addRecheck,
      loading: true,
      success: false,
      error: false,
    },
  })),
  on(addRecheckSuccess, (state) => ({
    ...state,
    addRecheck: {
      ...state.addRecheck,
      loading: false,
      success: true,
    },
  })),
  on(addRecheckError, (state) => ({
    ...state,
    addRecheck: {
      ...state.addRecheck,
      loading: false,
      error: true,
    },
  })),
  // Add prescription
  on(addPrescriptionInstruction, addPrescriptionMedication, (state) => ({
    ...state,
    addPrescription: {
      ...state.addPrescription,
      loading: true,
      success: false,
      error: false,
    },
  })),
  on(
    addPrescriptionInstructionSuccess,
    addPrescriptionMedicationSuccess,
    (state) => ({
      ...state,
      addPrescription: {
        ...state.addPrescription,
        loading: false,
        success: true,
      },
    })
  ),
  on(
    addPrescriptionInstructionError,
    addPrescriptionMedicationError,
    (state) => ({
      ...state,
      addPrescription: {
        ...state.addPrescription,
        loading: false,
        error: true,
      },
    })
  ),
  // Remove recheck
  on(removeRecheck, (state) => ({
    ...state,
    removeRecheck: {
      ...state.removeRecheck,
      loading: true,
      success: false,
      error: false,
    },
  })),
  on(removeRecheckSuccess, (state) => ({
    ...state,
    removeRecheck: {
      ...state.removeRecheck,
      loading: false,
      success: true,
    },
  })),
  on(removeRecheckError, (state) => ({
    ...state,
    removeRecheck: {
      ...state.removeRecheck,
      loading: false,
      error: true,
    },
  })),
  // Remove prescription
  on(removePrescriptionInstruction, removePrescriptionMedication, (state) => ({
    ...state,
    removePrescription: {
      ...state.removePrescription,
      loading: true,
      success: false,
      error: false,
    },
  })),
  on(
    removePrescriptionInstructionSuccess,
    removePrescriptionMedicationSuccess,
    (state) => ({
      ...state,
      removePrescription: {
        ...state.removePrescription,
        loading: false,
        success: true,
      },
    })
  ),
  on(
    removePrescriptionInstructionError,
    removePrescriptionMedicationError,
    (state) => ({
      ...state,
      removePrescription: {
        ...state.removePrescription,
        loading: false,
        error: true,
      },
    })
  ),
  // Update patient basic details
  on(updatePatientBasicDetails, (state, { update }) => ({
    ...state,
    updateBasicDetails: {
      ...state.updateBasicDetails,
      loading: update === 'details',
      success: false,
      error: false,
    },
    updateDiets: {
      ...state.updateDiets,
      loading: update === 'diets',
      success: false,
      error: false,
    },
    updateTags: {
      ...state.updateTags,
      loading: update === 'tags',
      success: false,
      error: false,
    },
  })),
  on(updatePatientBasicDetailsSuccess, (state, { update }) => ({
    ...state,
    updateBasicDetails: {
      ...state.updateBasicDetails,
      loading: false,
      success: update === 'details',
    },
    updateDiets: {
      ...state.updateDiets,
      loading: false,
      success: update === 'diets',
    },
    updateTags: {
      ...state.updateTags,
      loading: false,
      success: update === 'tags',
    },
  })),
  on(updatePatientBasicDetailsError, (state, { update }) => ({
    ...state,
    updateBasicDetails: {
      ...state.updateBasicDetails,
      loading: false,
      error: update === 'details',
    },
    updateDiets: {
      ...state.updateDiets,
      loading: false,
      error: update === 'diets',
    },
    updateTags: {
      ...state.updateTags,
      loading: false,
      error: update === 'tags',
    },
  })),
  // Request home care
  on(requestHomeCare, (state) => ({
    ...state,
    requestHomeCare: {
      ...state.requestHomeCare,
      loading: true,
      success: false,
      error: false,
    },
  })),
  on(requestHomeCareSuccess, (state) => ({
    ...state,
    requestHomeCare: {
      ...state.requestHomeCare,
      loading: false,
      success: true,
    },
  })),
  on(requestHomeCareError, (state) => ({
    ...state,
    requestHomeCare: {
      ...state.requestHomeCare,
      loading: false,
      error: true,
    },
  })),
  // Home carer drop-off
  on(homeCarerDropOff, (state) => ({
    ...state,
    dropOffHomeCare: {
      ...state.dropOffHomeCare,
      loading: true,
      success: false,
      error: false,
    },
  })),
  on(homeCarerDropOffSuccess, (state) => ({
    ...state,
    dropOffHomeCare: {
      ...state.dropOffHomeCare,
      loading: false,
      success: true,
    },
  })),
  on(homeCarerDropOffError, (state) => ({
    ...state,
    dropOffHomeCare: {
      ...state.dropOffHomeCare,
      loading: false,
      error: true,
    },
  }))
);
