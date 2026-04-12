import { createReducer, on } from '@ngrx/store';
import { AdminLearningState, initialAdminLearningState } from './state';
import {
  getLearningCategories,
  getLearningCategoriesSuccess,
  getLearningCategoriesError,
  addLearningCategory,
  addLearningCategorySuccess,
  addLearningCategoryError,
  removeLearningCategory,
  removeLearningCategorySuccess,
  removeLearningCategoryError,
} from './actions';

export const adminLearningReducer = createReducer<AdminLearningState>(
  initialAdminLearningState,
  on(getLearningCategories, (state) => ({
    ...state,
    loading: true,
    error: false,
    categories: [],
  })),
  on(getLearningCategoriesSuccess, (state, { categories }) => ({
    ...state,
    loading: false,
    error: false,
    categories,
  })),
  on(getLearningCategoriesError, (state) => ({
    ...state,
    loading: false,
    error: true,
    categories: [],
  })),
  on(addLearningCategory, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(addLearningCategorySuccess, (state) => ({
    ...state,
    loading: false,
    error: false,
  })),
  on(addLearningCategoryError, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),
  on(removeLearningCategory, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),
  on(removeLearningCategorySuccess, (state) => ({
    ...state,
    loading: false,
    error: false,
  })),
  on(removeLearningCategoryError, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),
);
