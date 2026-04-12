import { createReducer, on } from '@ngrx/store';
import { LearningState, initialLearningState } from './state';
import {
  getLearningCategories,
  getLearningCategoriesSuccess,
  getLearningCategoriesError,
} from './actions';

export const learningReducer = createReducer<LearningState>(
  initialLearningState,
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
);
