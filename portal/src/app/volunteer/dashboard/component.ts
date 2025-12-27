import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { getCurrentProfile } from '../profile/actions';
import { SubscribeBannerComponent } from './subscribe-banner/component';
import { UnreadNoticesComponent } from './unread-notices/component';

@Component({
  selector: 'volunteer-dashboard',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [RouterLink, SubscribeBannerComponent, UnreadNoticesComponent],
})
export class VolunteerDashboardComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(getCurrentProfile());
  }
}
