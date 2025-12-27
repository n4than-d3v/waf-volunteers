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
    if (this.status === 0) this.statusFormatted = 'Active';
    else if (this.status === 1) this.statusFormatted = 'Inactive';
    else if (this.status === 2) this.statusFormatted = 'On hold';
  }
}
