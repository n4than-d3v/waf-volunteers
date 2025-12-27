import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NoticeManagementState } from './state';

export const selectNoticeManagementState =
  createFeatureSelector<NoticeManagementState>('noticeManagement');

export const selectNotices = createSelector(
  selectNoticeManagementState,
  (state) => state.notices
);

export const selectInteractions = createSelector(
  selectNoticeManagementState,
  (state) => state.interactions
);

export const selectNoticesLoading = createSelector(
  selectNoticeManagementState,
  (state) => state.loading
);

export const selectNoticesError = createSelector(
  selectNoticeManagementState,
  (state) => state.error
);

export const selectNoticeCreated = createSelector(
  selectNoticeManagementState,
  (state) => state.created
);

export const selectNoticeUpdated = createSelector(
  selectNoticeManagementState,
  (state) => state.updated
);

export const selectNoticeDeleted = createSelector(
  selectNoticeManagementState,
  (state) => state.deleted
);
