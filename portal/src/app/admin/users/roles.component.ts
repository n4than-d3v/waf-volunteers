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
    if (this.roles & Roles.Volunteer) list.push('Volunteer');
    if (this.roles & Roles.Reception) list.push('Reception');
    if (this.roles & Roles.TeamLeader) list.push('Team leader');
    if (this.roles & Roles.Vet) list.push('Vet');
    if (this.roles & Roles.Admin) list.push('Admin');
    if (this.roles & Roles.Clocking) list.push('Clocking');
    this.rolesFormatted = list.join(', ');
  }
}
