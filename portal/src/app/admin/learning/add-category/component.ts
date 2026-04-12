import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { addLearningCategory, removeLearningCategory } from '../actions';
import { LearningCategory } from '../state';

@Component({
  selector: 'admin-learning-categories-add',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class AdminLearningCategoriesAddComponent {
  @Input({ required: true }) parent!: LearningCategory | null;

  adding = false;

  form = new FormGroup({
    name: new FormControl(''),
    youTube: new FormControl(''),
  });

  constructor(private store: Store) {}

  save() {
    this.store.dispatch(
      addLearningCategory({
        category: {
          name: this.form.value.name!,
          youTube: this.form.value.youTube || null,
          parentId: this.parent?.id || null,
        },
      }),
    );
    this.cancel();
  }

  cancel() {
    this.form.reset();
    this.adding = false;
  }

  remove() {
    this.store.dispatch(
      removeLearningCategory({
        id: this.parent?.id || 0,
      }),
    );
  }
}
