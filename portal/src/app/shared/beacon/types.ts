import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { countries } from './countries';

export interface BeaconInfo {
  name: BeaconInfoName;
  phone_numbers: BeaconInfoPhoneNumber[];
  title: string;
  gender: string[];
  address: BeaconInfoAddress[];
  volunteer_notes: string | null;
  emergency_contact_name: string;
  emergency_contact_phone: BeaconInfoEmergencyContactPhone[];
  emergency_contact_relationship: string;
  c_emergency_contact_name_2: string;
  c_emergency_contact_phone_2: string;
  c_emergency_contact_relationship_2: string;
  c_preferred_name: string | null;
  c_first_aid_trained: boolean;
  c_first_aid_expiry_date: string | null;
}

export interface BeaconInfoName {
  full: string;
  last: string;
  first: string;
  prefix: string;
}

export interface BeaconInfoPhoneNumber {
  number: string;
  is_primary: boolean;
}

export interface BeaconInfoAddress {
  city: string;
  region: string;
  country: string;
  is_primary: boolean;
  postal_code: string;
  country_code: string;
  address_line_one: string;
  address_line_two: string | null;
  address_line_three: string | null;
}

export interface BeaconInfoEmergencyContactPhone {
  number: string;
  is_primary: boolean;
}

export type BeaconForm = FormGroup<{
  name: FormGroup<{
    full: FormControl<string | null>;
    last: FormControl<string | null>;
    first: FormControl<string | null>;
    prefix: FormControl<string | null>;
  }>;
  phone_numbers: FormArray<
    FormGroup<{
      number: FormControl<string | null>;
      is_primary: FormControl<boolean | null>;
    }>
  >;
  title: FormControl<string | null>;
  gender: FormArray<FormControl<string | null>>;
  address: FormArray<
    FormGroup<{
      city: FormControl<string | null>;
      region: FormControl<string | null>;
      country: FormControl<string | null>;
      is_primary: FormControl<boolean | null>;
      postal_code: FormControl<string | null>;
      country_code: FormControl<string | null>;
      address_line_one: FormControl<string | null>;
      address_line_two: FormControl<string | null>;
      address_line_three: FormControl<string | null>;
    }>
  >;
  volunteer_notes: FormControl<string | null>;
  emergency_contact_name: FormControl<string | null>;
  emergency_contact_phone: FormArray<
    FormGroup<{
      number: FormControl<string | null>;
      is_primary: FormControl<boolean | null>;
    }>
  >;
  emergency_contact_relationship: FormControl<string | null>;
  c_emergency_contact_name_2: FormControl<string | null>;
  c_emergency_contact_phone_2: FormControl<string | null>;
  c_emergency_contact_relationship_2: FormControl<string | null>;
  c_preferred_name: FormControl<string | null>;
  c_first_aid_trained: FormControl<boolean | null>;
  c_first_aid_expiry_date: FormControl<string | null>;
}>;

export const createBeaconForm = (): BeaconForm =>
  new FormGroup({
    name: new FormGroup({
      full: new FormControl(''),
      last: new FormControl(''),
      first: new FormControl(''),
      prefix: new FormControl(''),
    }),
    phone_numbers: new FormArray<
      FormGroup<{
        number: FormControl<string | null>;
        is_primary: FormControl<boolean | null>;
      }>
    >([]),
    title: new FormControl(''),
    gender: new FormArray<FormControl<string | null>>([]),
    address: new FormArray<
      FormGroup<{
        city: FormControl<string | null>;
        region: FormControl<string | null>;
        country: FormControl<string | null>;
        is_primary: FormControl<boolean | null>;
        postal_code: FormControl<string | null>;
        country_code: FormControl<string | null>;
        address_line_one: FormControl<string | null>;
        address_line_two: FormControl<string | null>;
        address_line_three: FormControl<string | null>;
      }>
    >([]),
    volunteer_notes: new FormControl(''),
    emergency_contact_name: new FormControl(''),
    emergency_contact_phone: new FormArray<
      FormGroup<{
        number: FormControl<string | null>;
        is_primary: FormControl<boolean | null>;
      }>
    >([]),
    emergency_contact_relationship: new FormControl(''),
    c_emergency_contact_name_2: new FormControl(''),
    c_emergency_contact_phone_2: new FormControl(''),
    c_emergency_contact_relationship_2: new FormControl(''),
    c_preferred_name: new FormControl(''),
    c_first_aid_trained: new FormControl(false),
    c_first_aid_expiry_date: new FormControl(''),
  });

const getFullName = (form: BeaconForm) => {
  let name = '';
  if (form.controls.name.controls.prefix.value)
    name += form.controls.name.controls.prefix.value + ' ';
  if (form.controls.c_preferred_name.value)
    name += form.controls.c_preferred_name.value + ' ';
  else if (form.controls.name.controls.first.value)
    name += form.controls.name.controls.first.value + ' ';
  if (form.controls.name.controls.last.value)
    name += form.controls.name.controls.last.value + ' ';
  return name.trim();
};

export const getBeaconInfo = (form: BeaconForm): BeaconInfo => ({
  name: {
    full: getFullName(form),
    last: form.controls.name.controls.last.value || '',
    first: form.controls.name.controls.first.value || '',
    prefix: form.controls.name.controls.prefix.value || '',
  },
  phone_numbers: form.controls.phone_numbers.controls.map((x) => ({
    is_primary: x.controls.is_primary.value || false,
    number: x.controls.number.value || '',
  })),
  title: form.controls.title.value || '',
  gender: form.controls.gender.controls.map((x) => x.value || ''),
  address: form.controls.address.controls.map((x) => ({
    city: x.controls.city.value || '',
    region: x.controls.region.value || '',
    country: x.controls.country.value || '',
    is_primary: x.controls.is_primary.value || false,
    postal_code: x.controls.postal_code.value || '',
    country_code:
      countries.find((c) => c.name === x.controls.country.value)?.iso2 || 'GB',
    address_line_one: x.controls.address_line_one.value || '',
    address_line_two: x.controls.address_line_two.value || '',
    address_line_three: x.controls.address_line_three.value || '',
  })),
  volunteer_notes: form.controls.volunteer_notes.value || '',
  emergency_contact_name: form.controls.emergency_contact_name.value || '',
  emergency_contact_phone: form.controls.emergency_contact_phone.controls.map(
    (x) => ({
      is_primary: x.controls.is_primary.value || false,
      number: x.controls.number.value || '',
    })
  ),
  emergency_contact_relationship:
    form.controls.emergency_contact_relationship.value || '',
  c_emergency_contact_name_2:
    form.controls.c_emergency_contact_name_2.value || '',
  c_emergency_contact_phone_2:
    form.controls.c_emergency_contact_phone_2.value || '',
  c_emergency_contact_relationship_2:
    form.controls.c_emergency_contact_relationship_2.value || '',
  c_preferred_name: form.controls.c_preferred_name.value || '',
  c_first_aid_trained: form.controls.c_first_aid_trained.value || false,
  c_first_aid_expiry_date: form.controls.c_first_aid_expiry_date.value
    ? form.controls.c_first_aid_expiry_date.value + 'T12:00:00Z'
    : null,
});
