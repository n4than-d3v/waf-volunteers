import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Interaction, Notice } from './state';
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

@Injectable()
export class NoticeManagementEffects {
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

  viewNoticeInteractions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(viewNoticeInteractions),
      switchMap((action) =>
        this.http.get<Interaction[]>('notices/' + action.id).pipe(
          map((interactions) =>
            viewNoticeInteractionsSuccess({ interactions })
          ),
          catchError(() => of(viewNoticeInteractionsError()))
        )
      )
    )
  );

  createNotice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createNotice),
      switchMap((action) => {
        const formData = new FormData();
        formData.append('title', action.title);
        formData.append('content', action.content);
        formData.append('roles', String(action.roles));
        for (const file of action.files) {
          formData.append('files', file);
        }
        return this.http.post('notices', formData).pipe(
          map(() => createNoticeSuccess()),
          catchError(() => of(createNoticeError()))
        );
      })
    )
  );

  updateNotice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateNotice),
      switchMap((action) => {
        const formData = new FormData();
        formData.append('title', action.title);
        formData.append('content', action.content);
        formData.append('roles', String(action.roles));
        for (const file of action.files) {
          formData.append('files', file);
        }
        return this.http.put('notices/' + action.id, formData).pipe(
          map(() => updateNoticeSuccess()),
          catchError(() => of(updateNoticeError()))
        );
      })
    )
  );

  deleteNotice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteNotice),
      switchMap((action) =>
        this.http.delete('notices/' + action.id).pipe(
          map(() => deleteNoticeSuccess()),
          catchError(() => of(deleteNoticeError()))
        )
      )
    )
  );
}
