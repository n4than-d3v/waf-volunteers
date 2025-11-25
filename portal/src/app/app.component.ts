import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { TokenProvider } from './shared/token.provider';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  year: number = new Date().getFullYear();

  constructor(
    private tokenProvider: TokenProvider,
    public router: Router,
    private swUpdate: SwUpdate
  ) {}

  signOut() {
    this.tokenProvider.setToken('');
  }

  ngOnInit() {
    this.swUpdate.versionUpdates.subscribe(() => {
      this.swUpdate.activateUpdate().then(() => document.location.reload());
    });
  }
}
