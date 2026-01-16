import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  addBatchForExistingItem,
  addBatchForExistingItemSuccess,
  addBatchForNewItem,
  disposeBatch,
  disposeUsage,
  disposeUsageSuccess,
  getStockItems,
  getStockItemsSuccess,
  setError,
  setPage,
  useBatch,
  useBatchSuccess,
  viewStock,
  viewStockSuccess,
} from './actions';
import { Item, Stock } from './state';

@Injectable()
export class HospitalStockEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  // View stock

  viewStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(viewStock),
      switchMap(() =>
        this.http.get<Stock[]>('stock').pipe(
          map((stock) => viewStockSuccess({ stock })),
          catchError(() => of(setError()))
        )
      )
    )
  );

  // Get stock items

  getStockItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getStockItems),
      switchMap(() =>
        this.http.get<Item[]>('stock/items').pipe(
          map((items) => getStockItemsSuccess({ items })),
          catchError(() => of(setError()))
        )
      )
    )
  );

  // Add item

  addBatchForNewItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBatchForNewItem),
      switchMap((action) =>
        this.http.post<{ id: number }>('stock/item', action).pipe(
          map(({ id }) =>
            addBatchForExistingItem({
              ...action,
              itemId: id,
            })
          ),
          catchError(() => of(setError()))
        )
      )
    )
  );

  // Add batch

  addBatchForExistingItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBatchForExistingItem),
      switchMap((action) =>
        this.http.post('stock/batch', action).pipe(
          map((_) => addBatchForExistingItemSuccess()),
          catchError(() => of(setError()))
        )
      )
    )
  );

  addBatchForExistingItemSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBatchForExistingItemSuccess),
      switchMap((_) =>
        of(viewStock(), setPage({ page: { pageType: 'dashboard' } }))
      )
    )
  );

  // Use batch

  useBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(useBatch),
      switchMap((action) =>
        this.http.put('stock/batch/' + action.batchId, action).pipe(
          map((_) => useBatchSuccess()),
          catchError(() => of(setError()))
        )
      )
    )
  );

  useBatchSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(useBatchSuccess),
      switchMap((_) =>
        of(viewStock(), setPage({ page: { pageType: 'dashboard' } }))
      )
    )
  );

  // Dispose batch

  disposeBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(disposeBatch),
      switchMap((action) =>
        this.http
          .put<{ id: number }>('stock/batch/' + action.batchId, action)
          .pipe(
            map(({ id }) =>
              disposeUsage({ usageId: id, initials: action.initials })
            ),
            catchError(() => of(setError()))
          )
      )
    )
  );

  // Dispose usage

  disposeUsage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(disposeUsage),
      switchMap((action) =>
        this.http.put('stock/usage/' + action.usageId, action).pipe(
          map((_) => disposeUsageSuccess()),
          catchError(() => of(setError()))
        )
      )
    )
  );

  disposeUsageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(disposeUsageSuccess),
      switchMap((_) =>
        of(viewStock(), setPage({ page: { pageType: 'dashboard' } }))
      )
    )
  );
}
