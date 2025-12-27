import { createReducer, on } from '@ngrx/store';
import { initialNoticeManagementState, NoticeManagementState } from './state';
import {
  createNotice,
  createNoticeError,
  createNoticeSuccess,
  deleteNotice,
  deleteNoticeError,
  deleteNoticeSuccess,
  getNotices,
  getNoticesError,
  getNoticesSuccess,
  updateNotice,
  updateNoticeError,
  updateNoticeSuccess,
  viewNoticeInteractions,
  viewNoticeInteractionsError,
  viewNoticeInteractionsSuccess,
} from './actions';

export const noticeManagementReducer = createReducer<NoticeManagementState>(
  initialNoticeManagementState,
  on(getNotices, (state) => ({
    ...state,
    notices: [],
    loading: true,
    error: false,
    created: false,
    deleted: false,
  })),
  on(getNoticesSuccess, (state, { notices }) => ({
    ...state,
    notices: notices,
    loading: false,
    error: false,
  })),
  on(getNoticesError, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),
  on(viewNoticeInteractions, (state) => ({
    ...state,
    interactions: [],
    loading: true,
    error: false,
  })),
  on(viewNoticeInteractionsSuccess, (state, { interactions }) => ({
    ...state,
    interactions: interactions,
    loading: false,
    error: false,
  })),
  on(viewNoticeInteractionsError, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),
  on(createNotice, (state) => ({
    ...state,
    created: false,
    loading: true,
    error: false,
  })),
  on(createNoticeSuccess, (state) => ({
    ...state,
    created: true,
    loading: false,
    error: false,
  })),
  on(createNoticeError, (state) => ({
    ...state,
    created: false,
    loading: false,
    error: true,
  })),
  on(updateNotice, (state) => ({
    ...state,
    updated: false,
    loading: true,
    error: false,
  })),
  on(updateNoticeSuccess, (state) => ({
    ...state,
    updated: true,
    loading: false,
    error: false,
  })),
  on(updateNoticeError, (state) => ({
    ...state,
    updated: false,
    loading: false,
    error: true,
  })),
  on(deleteNotice, (state) => ({
    ...state,
    deleted: false,
    loading: true,
    error: false,
  })),
  on(deleteNoticeSuccess, (state) => ({
    ...state,
    deleted: true,
    loading: false,
    error: false,
  })),
  on(deleteNoticeError, (state) => ({
    ...state,
    deleted: false,
    loading: false,
    error: true,
  }))
);
