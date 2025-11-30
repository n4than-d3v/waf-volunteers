import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Interaction, Notice } from './state';
import {
  createNotice,
  createNoticeError,
  createNoticeSuccess,
  getNotices,
  getNoticesError,
  getNoticesSuccess,
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
      switchMap((action) =>
        this.http.post('notices', action).pipe(
          map(() => createNoticeSuccess()),
          catchError(() => of(createNoticeError()))
        )
      )
    )
  );
}
