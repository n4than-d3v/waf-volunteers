import { BeaconInfo } from '../../shared/beacon/types';

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
  beaconInfo: BeaconInfo;
  cars: string[];
  subscribed?: boolean;
}

export const initialProfileState: ProfileState = {
  loading: false,
  profile: null,
  error: false,
  updated: false,
};
