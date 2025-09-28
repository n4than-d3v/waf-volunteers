import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getCurrentProfile, updateSubscription } from '../../profile/actions';
import { Observable } from 'rxjs';
import { selectCurrentProfile, selectSubcribed } from '../../profile/selectors';
import { AsyncPipe } from '@angular/common';
import { Profile } from '../../profile/state';

@Component({
  standalone: true,
  selector: 'subscribe-banner',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe],
})
export class SubscribeBannerComponent implements OnInit {
  profile$: Observable<Profile | null>;
  subscribed$: Observable<boolean>;

  constructor(private store: Store) {
    this.profile$ = this.store.select(selectCurrentProfile);
    this.subscribed$ = this.store.select(selectSubcribed);
  }

  ngOnInit() {
    this.store.dispatch(getCurrentProfile());
  }

  submit() {
    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        navigator.serviceWorker
          .register('ngsw-worker.js')
          .then((registration) => registration.pushManager.getSubscription())
          .then((subscription) => {
            this.store.dispatch(
              updateSubscription({ subscription: subscription! })
            );
          });
      }
    });
  }
}
