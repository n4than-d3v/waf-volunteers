import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { LearningCategory } from '../state';
import { AdminLearningCategoriesAddComponent } from '../add-category/component';
import { SafeYoutubePipe } from '../../../vet/aux-dev-plans/tasks/component';

@Component({
  selector: 'admin-learning-categories-render',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AdminLearningCategoriesAddComponent, SafeYoutubePipe],
})
export class AdminLearningCategoriesRenderComponent {
  @Input({ required: true }) parent!: LearningCategory | null;
  @Input({ required: true }) categories!: LearningCategory[];

  constructor(private store: Store) {}
}
