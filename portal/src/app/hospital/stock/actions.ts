import { createAction, props } from '@ngrx/store';
import { Item, Page, Stock, StockBatch } from './state';

export const setPage = createAction(
  '[HMS-S] Set page',
  props<{ page: Page; item?: Stock; batch?: StockBatch }>()
);

export const viewStock = createAction('[HMS-S] View stock');
export const viewStockSuccess = createAction(
  '[HMS-S] View stock: success',
  props<{ stock: Stock[] }>()
);

export const getStockItems = createAction('[HMS-S] Get stock items');
export const getStockItemsSuccess = createAction(
  '[HMS-S] Get stock items: success',
  props<{ items: Item[] }>()
);

export const addBatchForNewItem = createAction(
  '[HMS-S] Add batch for new item',
  props<{
    medicationId: number;
    medicationConcentrationId: number;
    brand: string;
    measurement: number;
    afterOpeningLifetimeDays: number;
    reorderQuantity: number;
    number: string;
    expiry: string;
    quantity: number;
    initials: string;
  }>()
);

export const addBatchForExistingItem = createAction(
  '[HMS-S] Add batch for existing item',
  props<{
    itemId: number;
    number: string;
    expiry: string;
    quantity: number;
    initials: string;
  }>()
);
export const addBatchForExistingItemSuccess = createAction(
  '[HMS-S] Add batch for existing item: success'
);

export const useBatch = createAction(
  '[HMS-S] Use batch',
  props<{
    batchId: number;
    quantity: number;
    initials: string;
  }>()
);
export const useBatchSuccess = createAction('[HMS-S] Use batch: success');

export const disposeBatch = createAction(
  '[HMS-S] Dispose batch',
  props<{
    batchId: number;
    quantity: number;
    initials: string;
  }>()
);

export const disposeUsage = createAction(
  '[HMS-S] Dispose usage',
  props<{
    usageId: number;
    initials: string;
  }>()
);
export const disposeUsageSuccess = createAction(
  '[HMS-S] Dispose usage: success'
);

export const setError = createAction('[HMS-S] Set error');
