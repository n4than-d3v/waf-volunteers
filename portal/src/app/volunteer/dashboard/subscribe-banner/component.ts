import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getCurrentProfile, updateSubscription } from '../../profile/actions';
import { Observable } from 'rxjs';
import { selectCurrentProfile, selectSubcribed } from '../../profile/selectors';
import { AsyncPipe } from '@angular/common';
import { Profile } from '../../profile/state';
import { SwPush } from '@angular/service-worker';

@Component({
  standalone: true,
  selector: 'subscribe-banner',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe],
})
export class SubscribeBannerComponent implements OnInit {
  private readonly VAPID_PUBLIC_KEY =
    'BDESsOCmo5enRlChd2451EQB-HVsPgUcLpqAccpoDPnL67NmrX9lAzi9qFuB7PIgbgmhY2ACgaAFlK26fqeBQFM';

  profile$: Observable<Profile | null>;
  subscribed$: Observable<boolean>;

  error = '';

  isPermissionGranted() {
    return Notification.permission === 'granted';
  }

  constructor(private store: Store, private swPush: SwPush) {
    this.profile$ = this.store.select(selectCurrentProfile);
    this.subscribed$ = this.store.select(selectSubcribed);
  }

  ngOnInit() {
    this.store.dispatch(getCurrentProfile());
  }

  submit() {
    this.error = '';
    try {
      this.swPush
        .requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })
        .then((subscription) => {
          console.log('[Push] New subscription');
          console.log(subscription.toJSON());
          this.store.dispatch(updateSubscription({ subscription }));
        })
        .catch((reason) => {
          if (reason instanceof DOMException) {
            this.error = JSON.stringify({
              name: reason.name,
              message: reason.message,
              cause: reason.cause,
              stack: reason.stack,
            });
          } else {
            this.error = JSON.stringify(
              reason || {},
              Object.getOwnPropertyNames(reason)
            );
          }
        });
    } catch (err) {
      this.error = JSON.stringify(err || {});
    }
  }
}
