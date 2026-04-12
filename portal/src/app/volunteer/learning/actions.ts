import { createAction, props } from '@ngrx/store';
import { LearningCategory } from './state';

export const getLearningCategories = createAction(
  '[Learning] Get learning categories',
);
export const getLearningCategoriesSuccess = createAction(
  '[Learning] Get learning categories success',
  props<{ categories: LearningCategory[] }>(),
);
export const getLearningCategoriesError = createAction(
  '[Learning] Get learning categories error',
);
