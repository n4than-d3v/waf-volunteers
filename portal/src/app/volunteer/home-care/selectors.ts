import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrphanFeederState } from './state';

export const selectOrphanFeederState =
  createFeatureSelector<OrphanFeederState>('orphanFeeder');

export const selectOutstandingHomeCareRequests = createSelector(
  selectOrphanFeederState,
  (state) => state.outstandingRequests
);

export const selectMyActiveHomeCareRequests = createSelector(
  selectOrphanFeederState,
  (state) => state.myActiveRequests
);

export const selectHomeCareMessages = createSelector(
  selectOrphanFeederState,
  (state) => state.messages
);

export const selectSendHomeCareMessage = createSelector(
  selectOrphanFeederState,
  (state) => state.sendMessage
);

export const selectAcceptHomeCareRequest = createSelector(
  selectOrphanFeederState,
  (state) => state.acceptRequest
);
