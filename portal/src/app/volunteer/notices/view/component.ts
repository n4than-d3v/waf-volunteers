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
  openNotice,
  sendNoticeResponse,
} from '../actions';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { toHTML } from 'ngx-editor';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'volunteer-notice-view',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, FormsModule, SpinnerComponent, RouterLink],
})
export class VolunteerNoticeViewComponent implements OnInit, OnDestroy {
  id: number = 0;

  notice$: Observable<Notice | null>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  questions: Record<number, string[]> = {};
  otherAnswers: Record<number, string> = {};

  subscription: Subscription;

  constructor(
    private store: Store,
    private sanitizer: DomSanitizer,
    private router: Router,
    route: ActivatedRoute,
  ) {
    this.notice$ = this.store.select(selectNotice);
    this.loading$ = this.store.select(selectNoticesLoading);
    this.error$ = this.store.select(selectNoticesError);
    this.subscription = route.params.subscribe((params) => {
      this.id = Number(params['id'] || 0);
      this.store.dispatch(
        openNotice({
          id: this.id,
        }),
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
      }),
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
      }),
    );
    this.subscription.unsubscribe();
  }

  getResponse(notice: Notice, questionId: number) {
    return (
      notice.responses.find((n) => n.viewQuestionId === questionId)?.answers ??
      []
    ).join(', ');
  }

  isSelected(questionId: number, answer: string): boolean {
    return this.questions[questionId]?.includes(answer) ?? false;
  }

  selectAnswer(questionId: number, answer: string): void {
    this.questions[questionId] = [answer];
    delete this.otherAnswers[questionId];
  }

  toggleAnswer(questionId: number, answer: string, checked: boolean): void {
    const current = this.questions[questionId] ?? [];

    if (checked) {
      if (!current.includes(answer)) {
        this.questions[questionId] = [...current, answer];
      }
    } else {
      this.questions[questionId] = current.filter((a) => a !== answer);
    }
  }

  onOtherChange(
    questionId: number,
    allowMultiple: boolean,
    event: Event,
  ): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.otherAnswers[questionId] = '';

      if (!allowMultiple) {
        this.questions[questionId] = [];
      }
    } else {
      delete this.otherAnswers[questionId];
    }
  }

  submit(): void {
    const answers: Record<number, string[]> = {};

    for (const [questionId, values] of Object.entries(this.questions)) {
      answers[+questionId] = [...values];
    }

    for (const [questionId, value] of Object.entries(this.otherAnswers)) {
      if (value.trim()) {
        answers[+questionId] ??= [];
        answers[+questionId].push(value.trim());
      }
    }

    const answerEntries = Object.entries(answers);
    if (answerEntries.length === 0) return;

    this.store.dispatch(
      sendNoticeResponse({
        id: this.id,
        responses: answerEntries.map(([questionId, answers]) => ({
          questionId: Number(questionId),
          answers,
        })),
      }),
    );
  }
}
