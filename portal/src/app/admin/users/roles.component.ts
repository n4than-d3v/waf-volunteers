import { Component, Input, OnInit } from '@angular/core';
import { Roles } from '../../shared/token.provider';

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
    if (this.roles & Roles.None) list.push('None');
    if (this.roles & Roles.Shift_AnimalHusbandry) list.push('Animal husbandry');
    if (this.roles & Roles.Shift_Reception) list.push('Reception');
    if (this.roles & Roles.Shift_TeamLeader) list.push('Team leader');
    if (this.roles & Roles.Admin) list.push('Admin');
    this.rolesFormatted = list.join(', ');
  }
}
