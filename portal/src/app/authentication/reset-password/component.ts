import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { resetPassword } from './actions';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import {
  selectResetPasswordComplete,
  selectResetPasswordError,
  selectResetPasswordLoading,
} from './selectors';
import { SpinnerComponent } from '../../shared/spinner/component';

@Component({
  selector: 'reset-password',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, RouterLink, ReactiveFormsModule, SpinnerComponent],
})
export class ResetPasswordComponent {
  private token: string = '';

  loading$: Observable<boolean>;
  complete$: Observable<boolean>;
  error$: Observable<boolean>;

  passwordNotSecure = false;
  passwordNotMatch = false;

  form = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
      ],
    }),
    confirmPassword: new FormControl(''),
    showPassword: new FormControl(false),
  });

  constructor(private store: Store, route: ActivatedRoute) {
    this.loading$ = this.store.select(selectResetPasswordLoading);
    this.complete$ = this.store.select(selectResetPasswordComplete);
    this.error$ = this.store.select(selectResetPasswordError);
    route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  submit() {
    this.passwordNotSecure = false;
    this.passwordNotMatch = false;
    if (this.form.invalid) {
      this.passwordNotSecure = true;
    } else if (
      this.form.controls.password.value !=
      this.form.controls.confirmPassword.value
    ) {
      this.passwordNotMatch = true;
    } else {
      this.passwordNotSecure = false;
      this.passwordNotMatch = false;
      this.store.dispatch(
        resetPassword({
          token: this.token,
          password: this.form.controls.password.value,
        })
      );
    }
  }
}
