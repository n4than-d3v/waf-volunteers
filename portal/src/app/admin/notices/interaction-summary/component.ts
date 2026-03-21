import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InteractionSummary } from '../state';
import {
  selectNoticesLoading,
  selectNoticesError,
  selectInteractionSummary,
} from '../selectors';
import { viewNoticeInteractionSummary } from '../actions';
import { AsyncPipe, DatePipe, PercentPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InteractionSortPipe } from './sort.pipe';

@Component({
  standalone: true,
  selector: 'admin-notices-interaction-summary',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    RouterLink,
    FormsModule,
    InteractionSortPipe,
    PercentPipe,
  ],
})
export class AdminNoticeInteractionSummaryComponent implements OnInit {
  users$: Observable<InteractionSummary[]>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  sort: 'name' | 'most' | 'least' = 'name';

  constructor(private store: Store) {
    this.users$ = this.store.select(selectInteractionSummary);
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
  }

  ngOnInit() {
    this.store.dispatch(viewNoticeInteractionSummary());
  }
}
