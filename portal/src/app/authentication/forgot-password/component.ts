import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { forgotPassword } from './actions';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import {
  selectForgotPasswordComplete,
  selectForgotPasswordError,
  selectForgotPasswordLoading,
} from './selectors';
import { SpinnerComponent } from '../../shared/spinner/component';

@Component({
  selector: 'forgot-password',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, RouterLink, ReactiveFormsModule, SpinnerComponent],
})
export class ForgotPasswordComponent {
  loading$: Observable<boolean>;
  complete$: Observable<boolean>;
  error$: Observable<boolean>;

  form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private store: Store) {
    this.loading$ = this.store.select(selectForgotPasswordLoading);
    this.complete$ = this.store.select(selectForgotPasswordComplete);
    this.error$ = this.store.select(selectForgotPasswordError);
  }

  submit() {
    this.store.dispatch(
      forgotPassword({ username: this.form.controls.username.value })
    );
  }
}
