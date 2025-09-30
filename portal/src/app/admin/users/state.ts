export interface ProfilesState {
  loading: boolean;
  profiles: Profile[] | null;
  error: boolean;
  updated: boolean;
}

export interface Profile {
  id: number;
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
  roles: number;
  status: number;
}

export const initialProfilesState: ProfilesState = {
  loading: false,
  profiles: null,
  error: false,
  updated: false,
};
