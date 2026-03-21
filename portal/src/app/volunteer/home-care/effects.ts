import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {} from './state';
import {
  acceptHomeCareRequest,
  acceptHomeCareRequestError,
  acceptHomeCareRequestSuccess,
  downloadHomeCareMessageAttachment,
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
import { HomeCareMessage, HomeCareRequest } from '../../hospital/state';

@Injectable()
export class OrphanFeederEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getOutstandingHomeCareRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getOutstandingHomeCareRequests),
      switchMap(() =>
        this.http.get<HomeCareRequest[]>('hospital/home-care/outstanding').pipe(
          map((requests) =>
            getOutstandingHomeCareRequestsSuccess({ requests }),
          ),
          catchError(() => of(getOutstandingHomeCareRequestsError())),
        ),
      ),
    ),
  );

  acceptHomeCareRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acceptHomeCareRequest),
      switchMap((action) =>
        this.http
          .post(`hospital/home-care/${action.homeCareRequestId}/accept`, action)
          .pipe(
            map(() => acceptHomeCareRequestSuccess()),
            catchError(() => of(acceptHomeCareRequestError())),
          ),
      ),
    ),
  );

  acceptHomeCareRequestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(acceptHomeCareRequestSuccess),
      switchMap(() =>
        of(getOutstandingHomeCareRequests(), getMyActiveHomeCareRequests()),
      ),
    ),
  );

  getMyActiveHomeCareRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMyActiveHomeCareRequests),
      switchMap(() =>
        this.http.get<HomeCareRequest[]>('hospital/home-care/active').pipe(
          map((requests) => getMyActiveHomeCareRequestsSuccess({ requests })),
          catchError(() => of(getMyActiveHomeCareRequestsError())),
        ),
      ),
    ),
  );

  getHomeCareMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getHomeCareMessages),
      switchMap((action) =>
        this.http
          .get<
            HomeCareMessage[]
          >(`hospital/home-care/${action.homeCareRequestId}/messages`)
          .pipe(
            map((messages) => getHomeCareMessagesSuccess({ messages })),
            catchError(() => of(getHomeCareMessagesError())),
          ),
      ),
    ),
  );

  sendHomeCareMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendHomeCareMessage),
      switchMap((action) => {
        const formData = new FormData();
        formData.append('homeCareRequestId', String(action.homeCareRequestId));
        formData.append('weightValue', String(action.weightValue || ''));
        formData.append('weightUnit', String(action.weightUnit || ''));
        formData.append('message', action.message);
        for (const file of action.files) {
          formData.append('files', file);
        }
        return this.http
          .post(
            `hospital/home-care/${action.homeCareRequestId}/message`,
            formData,
          )
          .pipe(
            map(() =>
              sendHomeCareMessageSuccess({
                homeCareRequestId: action.homeCareRequestId,
              }),
            ),
            catchError(() => of(sendHomeCareMessageError())),
          );
      }),
    ),
  );

  sendHomeCareMessageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendHomeCareMessageSuccess),
      switchMap((action) =>
        of(
          getHomeCareMessages({ homeCareRequestId: action.homeCareRequestId }),
        ),
      ),
    ),
  );

  downloadHomeCareMessageAttachment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(downloadHomeCareMessageAttachment),
        switchMap((action) => {
          this.http
            .get(
              `hospital/home-care/message/${action.messageId}/attachments/${action.attachment.id}`,
              {
                responseType: 'blob',
              },
            )
            .subscribe((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = action.attachment.fileName;
              a.click();

              window.URL.revokeObjectURL(url);
            });
          return of();
        }),
      ),
    { dispatch: false },
  );
}
