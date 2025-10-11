import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { TokenProvider } from './shared/token.provider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  year: number = new Date().getFullYear();

  constructor(private tokenProvider: TokenProvider, public router: Router) {}

  signOut() {
    this.tokenProvider.setToken('');
  }
}
