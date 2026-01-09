import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { getCurrentProfile } from '../profile/actions';
import { SubscribeBannerComponent } from './subscribe-banner/component';
import { UnreadNoticesComponent } from './unread-notices/component';
import { TokenProvider } from '../../shared/token.provider';

@Component({
  selector: 'volunteer-dashboard',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [RouterLink, SubscribeBannerComponent, UnreadNoticesComponent],
})
export class VolunteerDashboardComponent implements OnInit {
  isOrphanFeeder = false;
  isAuxiliary = false;

  constructor(private store: Store, private tokenProvider: TokenProvider) {}

  ngOnInit() {
    this.store.dispatch(getCurrentProfile());
    this.isOrphanFeeder = this.tokenProvider.isOrphanFeeder();
    this.isAuxiliary = this.tokenProvider.isAuxiliary();
  }
}
