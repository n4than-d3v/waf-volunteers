import { createAction, props } from '@ngrx/store';
import { Interaction, Notice } from './state';

export const getNotices = createAction('[Admin Notices] Get notices');
export const getNoticesSuccess = createAction(
  '[Admin Notices] Get notices: success',
  props<{ notices: Notice[] }>()
);
export const getNoticesError = createAction(
  '[Admin Notices] Get notices: error'
);

export const createNotice = createAction(
  '[Admin Notices] Create notice',
  props<{ title: string; content: string; files: File[]; roles: number }>()
);
export const createNoticeSuccess = createAction(
  '[Admin Notices] Create notice: success'
);
export const createNoticeError = createAction(
  '[Admin Notices] Create notice: error'
);

export const updateNotice = createAction(
  '[Admin Notices] Update notice',
  props<{
    id: number;
    title: string;
    content: string;
    files: File[];
    roles: number;
  }>()
);
export const updateNoticeSuccess = createAction(
  '[Admin Notices] Update notice: success'
);
export const updateNoticeError = createAction(
  '[Admin Notices] Update notice: error'
);

export const viewNoticeInteractions = createAction(
  '[Admin Notices] View notice interactions',
  props<{ id: number }>()
);
export const viewNoticeInteractionsSuccess = createAction(
  '[Admin Notices] View notice interactions: success',
  props<{ interactions: Interaction[] }>()
);
export const viewNoticeInteractionsError = createAction(
  '[Admin Notices] View notice interactions: error'
);

export const deleteNotice = createAction(
  '[Admin Notices] Delete notice',
  props<{ id: number }>()
);
export const deleteNoticeSuccess = createAction(
  '[Admin Notices] Delete notice: success'
);
export const deleteNoticeError = createAction(
  '[Admin Notices] Delete notice: error'
);
