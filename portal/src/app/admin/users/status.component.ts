import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'admin-users-status',
  standalone: true,
  template: `{{ statusFormatted }}`,
})
export class AdminUsersStatusComponent implements OnInit {
  @Input({ required: true }) status: number = 0;

  statusFormatted: string = '';

  ngOnInit() {
    this.statusFormatted = this.status === 0 ? 'Active' : 'Inactive';
  }
}
