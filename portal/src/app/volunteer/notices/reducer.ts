import { createReducer, on } from '@ngrx/store';
import { initialNoticesState, NoticesState } from './state';
import {
  getNotices,
  getNoticesError,
  getNoticesSuccess,
  openNotice,
  openNoticeError,
  openNoticeSuccess,
} from './actions';

export const noticesReducer = createReducer<NoticesState>(
  initialNoticesState,
  on(getNotices, (state) => ({
    ...state,
    notices: [],
    loading: true,
    error: false,
    created: false,
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
  on(openNotice, (state) => ({
    ...state,
    notice: null,
    loading: true,
    error: false,
  })),
  on(openNoticeSuccess, (state, { notice }) => ({
    ...state,
    notice: notice,
    loading: false,
    error: false,
  })),
  on(openNoticeError, (state) => ({
    ...state,
    loading: false,
    error: true,
  }))
);
