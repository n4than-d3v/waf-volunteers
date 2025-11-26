import { Component, Input, OnInit } from '@angular/core';
import { roleList, Roles } from '../../shared/token.provider';

@Component({
  selector: 'admin-users-role',
  standalone: true,
  template: `{{ rolesFormatted }}`,
})
export class AdminUsersRoleComponent implements OnInit {
  @Input({ required: true }) roles: number = 0;

  rolesFormatted: string = '';

  ngOnInit() {
    const list = [];

    for (const role of roleList) {
      if (this.roles & role.value) {
        list.push(role.display);
      }
    }

    this.rolesFormatted = list.join(', ');
  }
}
