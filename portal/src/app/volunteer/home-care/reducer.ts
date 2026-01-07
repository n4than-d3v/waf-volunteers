import { createReducer, on } from '@ngrx/store';
import { initialOrphanFeederState, OrphanFeederState } from './state';
import {
  acceptHomeCareRequest,
  acceptHomeCareRequestError,
  acceptHomeCareRequestSuccess,
  getHomeCareMessages,
  getHomeCareMessagesError,
  getHomeCareMessagesSuccess,
  getMyActiveHomeCareRequests,
  getMyActiveHomeCareRequestsError,
  getMyActiveHomeCareRequestsSuccess,
  getOutstandingHomeCareRequests,
  getOutstandingHomeCareRequestsError,
  getOutstandingHomeCareRequestsSuccess,
  sendHomeCareMessage,
  sendHomeCareMessageError,
  sendHomeCareMessageSuccess,
} from './actions';

export const orphanFeederReducer = createReducer<OrphanFeederState>(
  initialOrphanFeederState,
  on(getOutstandingHomeCareRequests, (state) => ({
    ...state,
    outstandingRequests: {
      ...state.outstandingRequests,
      loading: true,
      error: false,
    },
  })),
  on(getOutstandingHomeCareRequestsSuccess, (state, { requests }) => ({
    ...state,
    outstandingRequests: {
      ...state.outstandingRequests,
      data: requests,
      loading: false,
    },
  })),
  on(getOutstandingHomeCareRequestsError, (state) => ({
    ...state,
    outstandingRequests: {
      ...state.outstandingRequests,
      loading: false,
      error: true,
    },
  })),
  on(getMyActiveHomeCareRequests, (state) => ({
    ...state,
    myActiveRequests: {
      ...state.myActiveRequests,
      loading: true,
      error: false,
    },
  })),
  on(getMyActiveHomeCareRequestsSuccess, (state, { requests }) => ({
    ...state,
    myActiveRequests: {
      ...state.myActiveRequests,
      data: requests,
      loading: false,
    },
  })),
  on(getMyActiveHomeCareRequestsError, (state) => ({
    ...state,
    myActiveRequests: {
      ...state.myActiveRequests,
      loading: false,
      error: true,
    },
  })),
  on(getHomeCareMessages, (state) => ({
    ...state,
    messages: {
      ...state.messages,
      loading: true,
      error: false,
    },
  })),
  on(getHomeCareMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages: {
      ...state.messages,
      data: messages,
      loading: false,
    },
  })),
  on(getHomeCareMessagesError, (state) => ({
    ...state,
    messages: {
      ...state.messages,
      loading: false,
      error: true,
    },
  })),
  on(acceptHomeCareRequest, (state) => ({
    ...state,
    acceptRequest: {
      ...state.acceptRequest,
      loading: true,
      error: false,
    },
  })),
  on(acceptHomeCareRequestSuccess, (state) => ({
    ...state,
    acceptRequest: {
      ...state.acceptRequest,
      loading: false,
    },
  })),
  on(acceptHomeCareRequestError, (state) => ({
    ...state,
    acceptRequest: {
      ...state.acceptRequest,
      loading: false,
      error: true,
    },
  })),
  on(sendHomeCareMessage, (state) => ({
    ...state,
    sendMessage: {
      ...state.sendMessage,
      loading: true,
      error: false,
    },
  })),
  on(sendHomeCareMessageSuccess, (state) => ({
    ...state,
    sendMessage: {
      ...state.sendMessage,
      loading: false,
    },
  })),
  on(sendHomeCareMessageError, (state) => ({
    ...state,
    sendMessage: {
      ...state.sendMessage,
      loading: false,
      error: true,
    },
  }))
);
