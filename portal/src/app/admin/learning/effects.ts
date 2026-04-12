import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
import { catchError, map, of, switchMap } from 'rxjs';
import { LearningCategory, CreateLearningCategoryCommand } from './state';

@Injectable()
export class AdminLearningEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  getLearningCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getLearningCategories),
      switchMap(() =>
        this.http.get<LearningCategory[]>('learning').pipe(
          map((categories) => getLearningCategoriesSuccess({ categories })),
          catchError(() => of(getLearningCategoriesError())),
        ),
      ),
    ),
  );

  addLearningCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addLearningCategory),
      switchMap((action) => {
        return this.http
          .post<CreateLearningCategoryCommand>(`learning`, action.category)
          .pipe(
            map(() => addLearningCategorySuccess()),
            catchError(() => of(addLearningCategoryError())),
          );
      }),
    ),
  );

  addLearningCategorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addLearningCategorySuccess),
      map((_) => getLearningCategories()),
    ),
  );

  removeLearningCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeLearningCategory),
      switchMap((action) => {
        return this.http.delete(`learning/${action.id}`).pipe(
          map(() => removeLearningCategorySuccess()),
          catchError(() => of(removeLearningCategoryError())),
        );
      }),
    ),
  );

  removeLearningCategorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeLearningCategorySuccess),
      map((_) => getLearningCategories()),
    ),
  );
}
