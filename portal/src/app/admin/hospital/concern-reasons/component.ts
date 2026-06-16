import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import {
  ConcernCategoryReadOnly,
  ConcernReason,
  ReleaseType,
  Wrapper,
} from '../state';
import { Store } from '@ngrx/store';
import { selectConcernReasons, selectReleaseTypes } from '../selectors';
import {
  createConcernCategory,
  createConcernReason,
  createReleaseType,
  getConcernReasons,
  getReleaseTypes,
  updateConcernCategory,
  updateConcernReason,
  updateReleaseType,
} from '../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'admin-hospital-concern-reasons',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    RouterLink,
    AsyncPipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminHospitalConcernReasonsComponent implements OnInit {
  concerns$: Observable<Wrapper<ConcernCategoryReadOnly>>;

  creatingCategory = false;
  creatingReason: ConcernCategoryReadOnly | null = null;

  updatingCategory: ConcernCategoryReadOnly | null = null;
  updatingReason: ConcernReason | null = null;

  filter = '';

  form = new FormGroup({
    description: new FormControl(''),
    categoryId: new FormControl(0),
  });

  constructor(private store: Store) {
    this.concerns$ = this.store.select(selectConcernReasons);
  }

  beginCreateCategory() {
    this.cancel();
    this.creatingCategory = true;
  }

  beginCreateReason(category: ConcernCategoryReadOnly) {
    this.cancel();
    this.creatingReason = category;

    this.form.controls.categoryId.setValue(category.id);
  }

  beginUpdateCategory(category: ConcernCategoryReadOnly) {
    this.cancel();
    this.updatingCategory = category;

    this.form.controls.description.setValue(category.description);
  }

  beginUpdateReason(category: ConcernCategoryReadOnly, reason: ConcernReason) {
    this.cancel();
    this.updatingReason = reason;

    this.form.controls.description.setValue(reason.description);
    this.form.controls.categoryId.setValue(category.id);
  }

  cancel() {
    this.updatingCategory = null;
    this.updatingReason = null;
    this.creatingReason = null;
    this.creatingCategory = false;
    this.form.reset();
    window.scroll(0, 0);
  }

  createCategory() {
    this.store.dispatch(
      createConcernCategory({
        concernCategory: {
          description: this.form.controls.description.value || '',
        },
      }),
    );
    this.cancel();
  }

  updateCategory() {
    this.store.dispatch(
      updateConcernCategory({
        concernCategory: {
          id: this.updatingCategory!.id,
          description: this.form.controls.description.value || '',
        },
      }),
    );
    this.cancel();
  }

  createReason() {
    this.store.dispatch(
      createConcernReason({
        concernReason: {
          description: this.form.controls.description.value || '',
          categoryId: Number(this.form.controls.categoryId.value || 0),
        },
      }),
    );
    this.cancel();
  }

  updateReason() {
    this.store.dispatch(
      updateConcernReason({
        concernReason: {
          id: this.updatingReason!.id,
          description: this.form.controls.description.value || '',
          categoryId: Number(this.form.controls.categoryId.value || 0),
        },
      }),
    );
    this.cancel();
  }

  ngOnInit() {
    this.store.dispatch(getConcernReasons());
  }
}
