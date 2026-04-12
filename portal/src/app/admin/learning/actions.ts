import { createAction, props } from '@ngrx/store';
import { LearningCategory, CreateLearningCategoryCommand } from './state';

export const getLearningCategories = createAction(
  '[Admin Learning] Get learning categories',
);
export const getLearningCategoriesSuccess = createAction(
  '[Admin Learning] Get learning categories success',
  props<{ categories: LearningCategory[] }>(),
);
export const getLearningCategoriesError = createAction(
  '[Admin Learning] Get learning categories error',
);

export const addLearningCategory = createAction(
  '[Admin Learning] Add learning category',
  props<{ category: CreateLearningCategoryCommand }>(),
);
export const addLearningCategorySuccess = createAction(
  '[Admin Learning] Add learning category success',
);
export const addLearningCategoryError = createAction(
  '[Admin Learning] Add learning category error',
);

export const removeLearningCategory = createAction(
  '[Admin Learning] Remove learning category',
  props<{ id: number }>(),
);
export const removeLearningCategorySuccess = createAction(
  '[Admin Learning] Remove learning category success',
);
export const removeLearningCategoryError = createAction(
  '[Admin Learning] Remove learning category error',
);
