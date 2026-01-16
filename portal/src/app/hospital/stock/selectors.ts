import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HospitalStockState } from './state';

export const selectHospitalStockState =
  createFeatureSelector<HospitalStockState>('hospitalStock');

export const selectPage = createSelector(
  selectHospitalStockState,
  (state) => state.page
);

export const selectStock = createSelector(
  selectHospitalStockState,
  (state) => state.stock
);

export const selectItems = createSelector(
  selectHospitalStockState,
  (state) => state.items
);

export const selectStockLoading = createSelector(
  selectHospitalStockState,
  (state) => state.loading
);

export const selectStockError = createSelector(
  selectHospitalStockState,
  (state) => state.error
);
