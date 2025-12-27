import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Notice } from './state';
import {
  selectNotices,
  selectNoticesError,
  selectNoticesLoading,
} from './selectors';
import { getNotices } from './actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'admin-notices',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, RouterLink, DatePipe],
})
export class AdminNoticesComponent implements OnInit {
  notices$: Observable<Notice[]>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  constructor(private store: Store) {
    this.notices$ = this.store.select(selectNotices);
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
  }

  ngOnInit() {
    this.store.dispatch(getNotices());
  }
}
