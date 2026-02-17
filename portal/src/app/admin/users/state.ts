import { BeaconInfo } from '../../shared/beacon/types';

export interface ProfilesState {
  loading: boolean;
  profiles: ProfileSummary[] | null;
  profile: Profile | null;
  error: boolean;
  updated: boolean;
  created: string | null;
}

export interface ProfileSummary {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  lastLoggedIn: string | null;
  userAgent: string | null;
  email: string;
  cars?: string[];
  subscribed?: boolean;
  roles: number;
  status: number;
}

export interface Profile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  beaconInfo?: BeaconInfo;
  cars?: string[];
  subscribed?: boolean;
  roles: number;
  status: number;
}

export const initialProfilesState: ProfilesState = {
  loading: false,
  profiles: null,
  profile: null,
  error: false,
  updated: false,
  created: null,
};
