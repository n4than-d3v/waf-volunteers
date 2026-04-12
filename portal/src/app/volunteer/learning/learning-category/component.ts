import { Component, Input } from '@angular/core';
import { LearningCategory } from '../state';
import { SafeYoutubePipe } from '../../../vet/aux-dev-plans/tasks/component';

@Component({
  selector: 'learning-category',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [SafeYoutubePipe, LearningCategoryComponent],
})
export class LearningCategoryComponent {
  @Input({ required: true }) category!: LearningCategory;
  @Input({ required: true }) parent!: LearningCategory | null;

  showChildren = false;
}
