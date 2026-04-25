import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TokenProvider } from './shared/token.provider';
import moment from 'moment';
import 'moment-easter';
import { EasterEggsFlakesComponent } from './easter-eggs/flakes/component';
import { selectCurrentProfile } from './volunteer/profile/selectors';
import { Profile } from './volunteer/profile/state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { getCurrentProfile } from './volunteer/profile/actions';

declare module 'moment' {
  export function easter(year: number): moment.Moment;
}

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterOutlet, RouterLink, EasterEggsFlakesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  year: number = new Date().getFullYear();

  profile$: Observable<Profile | null>;

  easterEggs = {
    christmas: false,
    valentines: false,
    easter: false,
    halloween: false,
    newYear: false,
    pancakeDay: false,
  };

  constructor(
    private store: Store,
    private tokenProvider: TokenProvider,
    public router: Router,
  ) {
    this.profile$ = this.store.select(selectCurrentProfile);
  }

  ngOnInit() {
    this.store.dispatch(getCurrentProfile());

    const today = moment();
    const year = today.year();

    const easterSunday = moment.easter(year);

    this.easterEggs = {
      christmas: today.isBetween(`${year}-12-24`, `${year}-12-26`, 'day', '[]'),
      valentines: today.isSame(`${year}-02-14`, 'day'),
      easter: today.isBetween(
        easterSunday.clone().subtract(2, 'days'),
        easterSunday.clone().add(1, 'days'),
        'day',
        '[]',
      ),
      halloween: today.isSame(`${year}-10-31`, 'day'),
      newYear: today.isSame(`${year}-01-01`, 'day'),
      pancakeDay: today.isSame(
        easterSunday.clone().subtract(47, 'days'),
        'day',
      ),
    };
  }

  signOut() {
    this.tokenProvider.setToken('');
  }
}
