import { Component } from '@angular/core';

@Component({
  selector: 'fake-phone',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class FakePhoneComponent {
  year: string;

  constructor() {
    this.year = new Date().getFullYear().toString();
  }
}
