import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LearningCategory } from './state';
import {
  selectLearningCategories,
  selectLearningCategoriesError,
  selectLearningCategoriesLoading,
} from './selectors';
import { getLearningCategories } from './actions';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../shared/spinner/component';
import { AdminLearningCategoriesRenderComponent } from './render-categories/component';
import { AdminLearningCategoriesAddComponent } from './add-category/component';

@Component({
  selector: 'admin-learning-categories',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    RouterLink,
    SpinnerComponent,
    AdminLearningCategoriesRenderComponent,
    AdminLearningCategoriesAddComponent,
  ],
})
export class AdminLearningCategoriesComponent implements OnInit {
  categories$: Observable<LearningCategory[]>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  constructor(private store: Store) {
    this.categories$ = this.store.select(selectLearningCategories);
    this.loading$ = this.store.select(selectLearningCategoriesLoading);
    this.error$ = this.store.select(selectLearningCategoriesError);
  }

  ngOnInit() {
    this.store.dispatch(getLearningCategories());
  }
}
