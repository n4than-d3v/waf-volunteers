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
import { LearningCategoryComponent } from './learning-category/component';

@Component({
  selector: 'volunteer-learning',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, RouterLink, SpinnerComponent, LearningCategoryComponent],
})
export class VolunteerLearningComponent implements OnInit {
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
