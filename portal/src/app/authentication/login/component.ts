import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectLoginError,
  selectLoginErrorMessage,
  selectLoginLoading,
} from './selectors';
import { checkIfAlreadyLoggedIn, login } from './actions';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'login',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, RouterLink, ReactiveFormsModule, SpinnerComponent],
})
export class LoginComponent implements OnInit {
  isPwa: boolean = false;

  loading$: Observable<boolean>;
  error$: Observable<boolean>;
  errorMessage$: Observable<string | null>;

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    showPassword: new FormControl(false),
  });

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectLoginLoading);
    this.error$ = this.store.select(selectLoginError);
    this.errorMessage$ = this.store.select(selectLoginErrorMessage);
  }

  ngOnInit() {
    this.checkIfRunningPwa();
    this.store.dispatch(checkIfAlreadyLoggedIn());
  }

  private checkIfRunningPwa() {
    this.isPwa = window.matchMedia('(display-mode: standalone)').matches;
  }

  submit() {
    if (!this.form.valid) return;

    this.store.dispatch(
      login({
        username: this.form.controls.username.value,
        password: this.form.controls.password.value,
      }),
    );
  }
}
