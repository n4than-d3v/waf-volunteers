export interface ProfileState {
  loading: boolean;
  profile: Profile | null;
  error: boolean;
  updated: boolean;
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    lineOne: string;
    lineTwo: string;
    city: string;
    county: string;
    postcode: string;
  };
  subscribed?: boolean;
}

export const initialProfileState: ProfileState = {
  loading: false,
  profile: null,
  error: false,
  updated: false,
};
