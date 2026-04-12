import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getLearningCategories,
  getLearningCategoriesSuccess,
  getLearningCategoriesError,
} from './actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { LearningCategory } from './state';

@Injectable()
export class LearningEffects {
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
}
