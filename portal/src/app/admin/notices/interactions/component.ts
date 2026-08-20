import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Interaction, QuestionResponses } from '../state';
import {
  selectInteractions,
  selectNoticesLoading,
  selectNoticesError,
  selectNoticeQuestionResponses,
} from '../selectors';
import {
  viewNoticeInteractions,
  viewNoticeQuestionResponses,
} from '../actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'admin-notices-interactions',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, RouterLink, DatePipe, FormsModule],
})
export class AdminNoticeInteractionsComponent {
  id: number = 0;

  interactions$: Observable<Interaction[]>;
  responses$: Observable<QuestionResponses>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  filter: 'none' | 'read' | 'unread' | 'seconds' = 'none';
  seconds = 0;

  constructor(
    private store: Store,
    route: ActivatedRoute,
  ) {
    this.interactions$ = this.store.select(selectInteractions);
    this.responses$ = this.store.select(selectNoticeQuestionResponses);
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
    route.params.subscribe((params) => {
      this.id = Number(params['id'] || 0);
      this.store.dispatch(
        viewNoticeInteractions({
          id: this.id,
        }),
      );
      this.store.dispatch(
        viewNoticeQuestionResponses({
          id: this.id,
        }),
      );
    });
  }

  getAnswers(answers: { [answer: string]: number }) {
    return Object.entries(answers).map((a) => ({
      answer: a[0],
      count: a[1],
    }));
  }

  getResponse(
    responses: QuestionResponses,
    question: { id: number },
    interaction: Interaction,
  ) {
    const response = responses.users.find((u) => u.name === interaction.name);
    if (!response) return '';
    const answers = response.answers[question.id];
    if (!answers) return '';
    return answers.join(', ');
  }

  shouldShow(interaction: Interaction) {
    if (this.filter === 'none') return true;
    if (this.filter === 'read') return interaction.read;
    if (this.filter === 'unread') return !interaction.read;
    if (this.filter === 'seconds') {
      if (!interaction.read) return false;
      const interactions = interaction.interactions;
      const shortInteractions = interactions.filter(
        (x) => x.durationSeconds && x.durationSeconds <= this.seconds,
      );
      return shortInteractions.length == interactions.length;
    }
    return true;
  }
}
