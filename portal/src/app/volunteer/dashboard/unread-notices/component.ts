import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Notice } from '../../notices/state';
import {
  selectNotices,
  selectNoticesError,
  selectNoticesLoading,
} from '../../notices/selectors';
import { getNotices } from '../../notices/actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'unread-notices',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, RouterLink],
})
export class UnreadNoticesComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  unread = 0;

  subscription: Subscription;

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
    this.subscription = this.store
      .select(selectNotices)
      .subscribe((notices) => {
        if (!notices) return;

        this.unread = notices.filter((x) => !x.read).length;
      });
  }

  ngOnInit() {
    this.store.dispatch(getNotices());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
