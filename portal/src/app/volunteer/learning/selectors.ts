import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LearningState } from './state';

export const selectLearningState =
  createFeatureSelector<LearningState>('learning');

export const selectLearningCategories = createSelector(
  selectLearningState,
  (state) => state.categories,
);

export const selectLearningCategoriesLoading = createSelector(
  selectLearningState,
  (state) => state.loading,
);

export const selectLearningCategoriesError = createSelector(
  selectLearningState,
  (state) => state.error,
);
