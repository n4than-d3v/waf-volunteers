import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'admin-users-address',
  standalone: true,
  template: `{{ addressFormatted }}`,
})
export class AdminUsersAddressComponent implements OnInit {
  @Input({ required: true }) address: {
    lineOne: string;
    lineTwo: string;
    city: string;
    county: string;
    postcode: string;
  } = {
    lineOne: '',
    lineTwo: '',
    city: '',
    county: '',
    postcode: '',
  };

  addressFormatted: string = '';

  ngOnInit() {
    const list = [];
    if (this.address.lineOne) list.push(this.address.lineOne);
    if (this.address.lineTwo) list.push(this.address.lineTwo);
    if (this.address.city) list.push(this.address.city);
    if (this.address.county) list.push(this.address.county);
    if (this.address.postcode) list.push(this.address.postcode);
    this.addressFormatted = list.join(', ');
  }
}
