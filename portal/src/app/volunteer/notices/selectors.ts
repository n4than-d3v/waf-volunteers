import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NoticesState } from './state';

export const selectNoticesState =
  createFeatureSelector<NoticesState>('notices');

export const selectNotices = createSelector(
  selectNoticesState,
  (state) => state.notices
);

export const selectNotice = createSelector(
  selectNoticesState,
  (state) => state.notice
);

export const selectNoticesLoading = createSelector(
  selectNoticesState,
  (state) => state.loading
);

export const selectNoticesError = createSelector(
  selectNoticesState,
  (state) => state.error
);
