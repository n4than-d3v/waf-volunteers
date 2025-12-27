import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Notice, NoticeAttachment } from '../state';
import {
  selectNotice,
  selectNoticesLoading,
  selectNoticesError,
} from '../selectors';
import {
  closeNotice,
  downloadNoticeAttachment,
  getNotices,
  openNotice,
} from '../actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { toHTML } from 'ngx-editor';

@Component({
  standalone: true,
  selector: 'volunteer-notice-view',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, RouterLink],
})
export class VolunteerNoticeViewComponent implements OnInit, OnDestroy {
  id: number = 0;

  notice$: Observable<Notice | null>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  subscription: Subscription;

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer,
    private router: Router,
    route: ActivatedRoute
  ) {
    this.notice$ = this.store.select(selectNotice);
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
    this.subscription = route.params.subscribe((params) => {
      this.id = Number(params['id'] || 0);
      this.store.dispatch(
        openNotice({
          id: this.id,
        })
      );
    });
  }

  getNoticeContent(notice: Notice) {
    const json = JSON.parse(notice.content);
    const html = toHTML(json);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  download(notice: Notice, attachment: NoticeAttachment) {
    this.store.dispatch(
      downloadNoticeAttachment({
        notice,
        attachment,
      })
    );
    this.close(false);
  }

  private close(reload: boolean = true) {
    navigator.sendBeacon(`api/notices/${this.id}/close`);
    this.router.navigateByUrl('/volunteer/notices');
    if (reload) {
      setTimeout(() => window.location.reload(), 500);
    }
  }

  ngOnInit() {
    window.addEventListener('beforeunload', () => this.close());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.close();
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(
      closeNotice({
        id: this.id,
      })
    );
    this.subscription.unsubscribe();
  }
}
