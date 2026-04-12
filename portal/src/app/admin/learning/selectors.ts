import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminLearningState } from './state';

export const selectAdminLearningState =
  createFeatureSelector<AdminLearningState>('adminLearning');

export const selectLearningCategories = createSelector(
  selectAdminLearningState,
  (state) => state.categories,
);

export const selectLearningCategoriesLoading = createSelector(
  selectAdminLearningState,
  (state) => state.loading,
);

export const selectLearningCategoriesError = createSelector(
  selectAdminLearningState,
  (state) => state.error,
);
