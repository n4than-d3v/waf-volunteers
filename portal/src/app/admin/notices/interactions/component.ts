import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Interaction } from '../state';
import {
  selectInteractions,
  selectNoticesLoading,
  selectNoticesError,
} from '../selectors';
import { viewNoticeInteractions } from '../actions';
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
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  filter: 'none' | 'read' | 'unread' | 'seconds' = 'none';
  seconds = 0;

  constructor(private store: Store, route: ActivatedRoute) {
    this.interactions$ = this.store.select(selectInteractions);
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
    route.params.subscribe((params) => {
      this.id = Number(params['id'] || 0);
      this.store.dispatch(
        viewNoticeInteractions({
          id: this.id,
        })
      );
    });
  }

  shouldShow(interaction: Interaction) {
    if (this.filter === 'none') return true;
    if (this.filter === 'read') return interaction.read;
    if (this.filter === 'unread') return !interaction.read;
    if (this.filter === 'seconds') {
      if (!interaction.read) return false;
      const interactions = interaction.interactions;
      const shortInteractions = interactions.filter(
        (x) => x.durationSeconds && x.durationSeconds <= this.seconds
      );
      return shortInteractions.length == interactions.length;
    }
    return true;
  }
}
