import { createAction, props } from '@ngrx/store';
import { Notice, NoticeAttachment } from './state';

export const getNotices = createAction('[Notices] Get notices');
export const getNoticesSuccess = createAction(
  '[Notices] Get notices: success',
  props<{ notices: Notice[] }>()
);
export const getNoticesError = createAction('[Notices] Get notices: error');

export const openNotice = createAction(
  '[Notices] Open notice',
  props<{ id: number }>()
);
export const openNoticeSuccess = createAction(
  '[Notices] Open notice: success',
  props<{ notice: Notice }>()
);
export const openNoticeError = createAction('[Notices] Open notice: error');

export const closeNotice = createAction(
  '[Notices] Close notice',
  props<{ id: number }>()
);
export const closeNoticeSuccess = createAction(
  '[Notices] Close notice: success',
  props<{ notice: Notice }>()
);
export const closeNoticeError = createAction('[Notices] Close notice: error');

export const downloadNoticeAttachment = createAction(
  '[Notices] Download attachment',
  props<{ notice: Notice; attachment: NoticeAttachment }>()
);
