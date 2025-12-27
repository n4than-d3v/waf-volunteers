import { createReducer, on } from '@ngrx/store';
import { initialRotaManagementState, RotaManagementState } from './state';
import {
  confirmShift,
  confirmShiftError,
  confirmShiftSuccess,
  denyShift,
  denyShiftError,
  denyShiftSuccess,
  getAdminRota,
  getAdminRotaError,
  getAdminRotaSuccess,
  getAssignableAreas,
  getAssignableAreasError,
  getAssignableAreasSuccess,
  getAssignableShifts,
  getAssignableShiftsError,
  getAssignableShiftsSuccess,
  getJobs,
  getJobsError,
  getJobsSuccess,
  getMissingReasons,
  getMissingReasonsError,
  getMissingReasonsSuccess,
  getRegularShifts,
  getRegularShiftsError,
  getRegularShiftsSuccess,
  getReports,
  getReportsError,
  getReportsSuccess,
  getRequirements,
  getRequirementsError,
  getRequirementsSuccess,
  getTimes,
  getTimesError,
  getTimesSuccess,
  updateAssignableAreas,
  updateAssignableAreasError,
  updateAssignableAreasSuccess,
  updateAssignableShifts,
  updateAssignableShiftsError,
  updateAssignableShiftsSuccess,
  updateJobs,
  updateJobsError,
  updateJobsSuccess,
  updateMissingReasons,
  updateMissingReasonsError,
  updateMissingReasonsSuccess,
  updateRequirements,
  updateRequirementsError,
  updateRequirementsSuccess,
  updateTimes,
  updateTimesError,
  updateTimesSuccess,
} from './actions';

export const rotaManagementReducer = createReducer<RotaManagementState>(
  initialRotaManagementState,
  // Jobs
  on(getJobs, (state) => ({
    ...state,
    jobs: { ...state.jobs, loading: true, error: false },
  })),
  on(getJobsSuccess, (state, { jobs }) => ({
    ...state,
    jobs: { ...state.jobs, data: jobs, loading: false, error: false },
  })),
  on(getJobsError, (state) => ({
    ...state,
    jobs: { ...state.jobs, loading: false, error: true },
  })),
  on(updateJobs, (state) => ({
    ...state,
    jobs: { ...state.jobs, loading: true, error: false },
  })),
  on(updateJobsSuccess, (state) => ({
    ...state,
    jobs: { ...state.jobs, loading: false, error: false, updated: true },
  })),
  on(updateJobsError, (state) => ({
    ...state,
    jobs: { ...state.jobs, loading: false, error: true },
  })),
  // Missing Reasons
  on(getMissingReasons, (state) => ({
    ...state,
    missingReasons: { ...state.missingReasons, loading: true, error: false },
  })),
  on(getMissingReasonsSuccess, (state, { missingReasons }) => ({
    ...state,
    missingReasons: {
      ...state.missingReasons,
      data: missingReasons,
      loading: false,
      error: false,
    },
  })),
  on(getMissingReasonsError, (state) => ({
    ...state,
    missingReasons: { ...state.missingReasons, loading: false, error: true },
  })),
  on(updateMissingReasons, (state) => ({
    ...state,
    missingReasons: { ...state.missingReasons, loading: true, error: false },
  })),
  on(updateMissingReasonsSuccess, (state) => ({
    ...state,
    missingReasons: {
      ...state.missingReasons,
      loading: false,
      error: false,
      updated: true,
    },
  })),
  on(updateMissingReasonsError, (state) => ({
    ...state,
    missingReasons: { ...state.missingReasons, loading: false, error: true },
  })),
  // Times
  on(getTimes, (state) => ({
    ...state,
    times: { ...state.times, loading: true, error: false },
  })),
  on(getTimesSuccess, (state, { times }) => ({
    ...state,
    times: { ...state.times, data: times, loading: false, error: false },
  })),
  on(getTimesError, (state) => ({
    ...state,
    times: { ...state.times, loading: false, error: true },
  })),
  on(updateTimes, (state) => ({
    ...state,
    times: { ...state.times, loading: true, error: false },
  })),
  on(updateTimesSuccess, (state) => ({
    ...state,
    times: { ...state.times, loading: false, error: false, updated: true },
  })),
  on(updateTimesError, (state) => ({
    ...state,
    times: { ...state.times, loading: false, error: true },
  })),
  // Requirements
  on(getRequirements, (state) => ({
    ...state,
    requirements: { ...state.requirements, loading: true, error: false },
  })),
  on(getRequirementsSuccess, (state, { requirements }) => ({
    ...state,
    requirements: {
      ...state.requirements,
      data: requirements,
      loading: false,
      error: false,
    },
  })),
  on(getRequirementsError, (state) => ({
    ...state,
    requirements: { ...state.requirements, loading: false, error: true },
  })),
  on(updateRequirements, (state) => ({
    ...state,
    requirements: { ...state.requirements, loading: true, error: false },
  })),
  on(updateRequirementsSuccess, (state) => ({
    ...state,
    requirements: {
      ...state.requirements,
      loading: false,
      error: false,
      updated: true,
    },
  })),
  on(updateRequirementsError, (state) => ({
    ...state,
    requirements: { ...state.requirements, loading: false, error: true },
  })),
  // Assignable shifts
  on(getAssignableShifts, (state) => ({
    ...state,
    assignableShifts: {
      ...state.assignableShifts,
      loading: true,
      error: false,
    },
  })),
  on(getAssignableShiftsSuccess, (state, { assignableShifts }) => ({
    ...state,
    assignableShifts: {
      ...state.assignableShifts,
      data: assignableShifts,
      loading: false,
      error: false,
    },
  })),
  on(getAssignableShiftsError, (state) => ({
    ...state,
    assignableShifts: {
      ...state.assignableShifts,
      loading: false,
      error: true,
    },
  })),
  on(updateAssignableShifts, (state) => ({
    ...state,
    assignableShifts: {
      ...state.assignableShifts,
      loading: true,
      error: false,
    },
  })),
  on(updateAssignableShiftsSuccess, (state) => ({
    ...state,
    assignableShifts: {
      ...state.assignableShifts,
      loading: false,
      error: false,
      updated: true,
    },
  })),
  on(updateAssignableShiftsError, (state) => ({
    ...state,
    assignableShifts: {
      ...state.assignableShifts,
      loading: false,
      error: true,
    },
  })),
  // Assignable areas
  on(getAssignableAreas, (state) => ({
    ...state,
    assignableAreas: { ...state.assignableAreas, loading: true, error: false },
  })),
  on(getAssignableAreasSuccess, (state, { assignableAreas }) => ({
    ...state,
    assignableAreas: {
      ...state.assignableAreas,
      data: assignableAreas,
      loading: false,
      error: false,
    },
  })),
  on(getAssignableAreasError, (state) => ({
    ...state,
    assignableAreas: { ...state.assignableAreas, loading: false, error: true },
  })),
  on(updateAssignableAreas, (state) => ({
    ...state,
    assignableAreas: { ...state.assignableAreas, loading: true, error: false },
  })),
  on(updateAssignableAreasSuccess, (state) => ({
    ...state,
    assignableAreas: {
      ...state.assignableAreas,
      loading: false,
      error: false,
      updated: true,
    },
  })),
  on(updateAssignableAreasError, (state) => ({
    ...state,
    assignableAreas: { ...state.assignableAreas, loading: false, error: true },
  })),
  // Regular shifts
  on(getRegularShifts, (state) => ({
    ...state,
    regularShifts: { ...state.regularShifts, loading: true, error: false },
  })),
  on(getRegularShiftsSuccess, (state, { regularShifts }) => ({
    ...state,
    regularShifts: {
      ...state.regularShifts,
      data: regularShifts,
      loading: false,
      error: false,
    },
  })),
  on(getRegularShiftsError, (state) => ({
    ...state,
    regularShifts: { ...state.regularShifts, loading: false, error: true },
  })),
  on(getAdminRota, (state, action) => ({
    ...state,
    rota: { ...state.rota, loading: !action.silent, error: false },
  })),
  on(getAdminRotaSuccess, (state, { rota }) => ({
    ...state,
    rota: { ...state.rota, loading: false, data: rota, error: false },
  })),
  on(getAdminRotaError, (state) => ({
    ...state,
    rota: { ...state.rota, loading: false, error: true },
  })),
  on(confirmShift, (state) => ({
    ...state,
    rota: { ...state.rota, error: false },
  })),
  on(confirmShiftSuccess, (state) => ({
    ...state,
    rota: { ...state.rota, loading: false, error: false },
  })),
  on(confirmShiftError, (state) => ({
    ...state,
    rota: { ...state.rota, loading: false, error: true },
  })),
  on(denyShift, (state) => ({
    ...state,
    rota: { ...state.rota, error: false },
  })),
  on(denyShiftSuccess, (state) => ({
    ...state,
    rota: { ...state.rota, loading: false, error: false },
  })),
  on(denyShiftError, (state) => ({
    ...state,
    rota: { ...state.rota, loading: false, error: true },
  })),
  on(getReports, (state) => ({
    ...state,
    reports: { ...state.reports, loading: true, error: false },
  })),
  on(getReportsSuccess, (state, { reports }) => ({
    ...state,
    reports: { ...state.reports, loading: false, data: reports, error: false },
  })),
  on(getReportsError, (state) => ({
    ...state,
    reports: { ...state.reports, loading: false, error: true },
  }))
);
