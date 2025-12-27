import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TokenProvider } from './shared/token.provider';
import moment from 'moment';
import { EasterEggsSnowflakesComponent } from './easter-eggs/snowflakes/component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, EasterEggsSnowflakesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  year: number = new Date().getFullYear();

  easterEggs = {
    xmas: false,
  };

  constructor(private tokenProvider: TokenProvider, public router: Router) {}

  ngOnInit() {
    this.easterEggs.xmas = moment().isBetween(
      `${this.year}-12-18`,
      `${this.year}-12-25`,
      'day',
      '[]'
    );
  }

  signOut() {
    this.tokenProvider.setToken('');
  }
}
