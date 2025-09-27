import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLoginError, selectLoginLoading } from './selectors';
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
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, RouterLink, ReactiveFormsModule, SpinnerComponent],
})
export class LoginComponent implements OnInit {
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectLoginLoading);
    this.error$ = this.store.select(selectLoginError);
  }

  ngOnInit() {
    this.store.dispatch(checkIfAlreadyLoggedIn());
  }

  submit() {
    this.store.dispatch(
      login({
        username: this.form.controls.username.value,
        password: this.form.controls.password.value,
      })
    );
  }
}
