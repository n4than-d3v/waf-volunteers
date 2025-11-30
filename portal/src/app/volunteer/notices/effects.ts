import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Notice } from './state';
import {
  closeNotice,
  closeNoticeError,
  closeNoticeSuccess,
  getNotices,
  getNoticesError,
  getNoticesSuccess,
  openNotice,
  openNoticeError,
  openNoticeSuccess,
} from './actions';

@Injectable()
export class NoticesEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getNotices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getNotices),
      switchMap(() =>
        this.http.get<Notice[]>('notices').pipe(
          map((notices) => getNoticesSuccess({ notices })),
          catchError(() => of(getNoticesError()))
        )
      )
    )
  );

  openNotice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(openNotice),
      switchMap((action) =>
        this.http.post<Notice>(`notices/${action.id}/open`, {}).pipe(
          map((notice) => openNoticeSuccess({ notice })),
          catchError(() => of(openNoticeError()))
        )
      )
    )
  );

  closeNotice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(closeNotice),
      switchMap((action) =>
        this.http.post<Notice>(`notices/${action.id}/close`, {}).pipe(
          map((notice) => closeNoticeSuccess({ notice })),
          catchError(() => of(closeNoticeError()))
        )
      )
    )
  );
}
