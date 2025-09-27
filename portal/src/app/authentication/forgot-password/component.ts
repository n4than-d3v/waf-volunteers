import { Component } from '@angular/core';

@Component({
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class ForgotPasswordComponent {
  constructor() {}

  forgotPassword() {
    alert('ok');
  }
}
