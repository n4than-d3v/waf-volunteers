import { Component, Input, OnInit } from '@angular/core';
import { BeaconForm, BeaconInfo } from './types';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { countries } from './countries';

@Component({
  standalone: true,
  selector: 'beacon-info',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class BeaconInfoComponent implements OnInit {
  @Input({ required: true }) form!: BeaconForm;
  @Input({ required: true }) profile!: BeaconInfo;

  editing = '';

  countries = countries;

  addPhoneNumber() {
    this.form.controls.phone_numbers.push(
      new FormGroup({
        number: new FormControl<string | null>(''),
        is_primary: new FormControl<boolean | null>(false),
      })
    );
  }

  removePhoneNumber(index: number) {
    this.form.controls.phone_numbers.removeAt(index);
  }

  addAddress() {
    this.form.controls.address.push(
      new FormGroup({
        city: new FormControl<string | null>(''),
        region: new FormControl<string | null>(''),
        country: new FormControl<string | null>(''),
        is_primary: new FormControl<boolean | null>(false),
        postal_code: new FormControl<string | null>(''),
        country_code: new FormControl<string | null>(''),
        address_line_one: new FormControl<string | null>(''),
        address_line_two: new FormControl<string | null>(''),
        address_line_three: new FormControl<string | null>(''),
      })
    );
  }

  removeAddress(index: number) {
    this.form.controls.address.removeAt(index);
  }

  addEmergencyContactPhone() {
    this.form.controls.emergency_contact_phone.push(
      new FormGroup({
        number: new FormControl<string | null>(''),
        is_primary: new FormControl<boolean | null>(false),
      })
    );
  }

  removeEmergencyContactPhone(index: number) {
    this.form.controls.emergency_contact_phone.removeAt(index);
  }

  ngOnInit() {
    this.form.controls.phone_numbers.clear();
    this.form.controls.gender.clear();
    this.form.controls.address.clear();
    this.form.controls.emergency_contact_phone.clear();

    for (const _ of this.profile.phone_numbers) {
      this.addPhoneNumber();
    }

    for (const _ of this.profile.gender) {
      this.form.controls.gender.push(new FormControl(''));
    }

    for (const _ of this.profile.address) {
      this.addAddress();
    }

    for (const _ of this.profile.emergency_contact_phone) {
      this.addEmergencyContactPhone();
    }

    this.form.patchValue({
      ...this.profile,
      c_first_aid_expiry_date: this.profile.c_first_aid_expiry_date
        ? this.profile.c_first_aid_expiry_date.split('T')[0]
        : null,
    });
  }
}
