import { createReducer, on } from '@ngrx/store';
import { HospitalStockState, initialHospitalStockState } from './state';
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

export const hospitalStockReducer = createReducer<HospitalStockState>(
  initialHospitalStockState,
  on(setPage, (state, { page }) => ({
    ...state,
    page: {
      ...state.page,
      ...page,
    },
  })),
  on(
    viewStock,
    getStockItems,
    addBatchForNewItem,
    addBatchForExistingItem,
    useBatch,
    disposeUsage,
    disposeBatch,
    (state) => ({
      ...state,
      loading: true,
      error: false,
    })
  ),
  on(viewStockSuccess, (state, { stock }) => ({
    ...state,
    stock,
    loading: false,
  })),
  on(getStockItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
  })),
  on(
    addBatchForExistingItemSuccess,
    useBatchSuccess,
    disposeUsageSuccess,
    (state) => ({
      ...state,
      loading: false,
      error: false,
    })
  ),
  on(setError, (state) => ({
    ...state,
    loading: false,
    error: true,
  }))
);
