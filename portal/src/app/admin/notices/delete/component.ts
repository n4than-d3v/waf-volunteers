import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectNoticesLoading,
  selectNoticesError,
  selectNoticeDeleted,
} from '../selectors';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { deleteNotice } from '../actions';

@Component({
  standalone: true,
  selector: 'admin-notices-delete',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, RouterLink],
})
export class AdminNoticeDeleteComponent {
  id: number = 0;

  deleted$: Observable<boolean>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  constructor(private store: Store, route: ActivatedRoute) {
    this.deleted$ = this.store.select(selectNoticeDeleted);
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
    route.params.subscribe((params) => {
      this.id = Number(params['id'] || 0);
    });
  }

  confirm() {
    this.store.dispatch(
      deleteNotice({
        id: this.id,
      })
    );
  }
}
