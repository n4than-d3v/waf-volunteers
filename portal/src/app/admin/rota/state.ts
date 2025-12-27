import { ShiftType } from '../../volunteer/rota/state';

export interface RotaManagementState {
  jobs: Wrapper<Job>;
  times: Wrapper<Time>;
  missingReasons: Wrapper<MissingReason>;
  requirements: Wrapper<Requirement>;
  assignableShifts: Wrapper<AssignableShift>;
  assignableAreas: Wrapper<AssignableArea>;

  regularShifts: Wrapper<RegularShift>;

  rota: Wrapper<AdminRota>;

  reports: Wrapper<Report>;
}

export interface Wrapper<T> {
  loading: boolean;
  error: boolean;
  data: T[];
  updated: boolean;
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface Job {
  id?: number;
  name: string;
  beaconAssociatedRole: number;
  showOthersInJobIds: number[];
  canAlsoDoJobIds: number[];
}

export interface MissingReason {
  id?: number;
  name: string;
}

export interface Time {
  id?: number;
  name: string;
  start: string;
  end: string;
  beaconName: string;
}

export interface Requirement {
  id?: number;
  day: DayOfWeek;
  time: Time;
  job: Job;
  minimum: number;

  // Used for commands
  timeId?: number;
  jobId?: number;
}

export interface AssignableArea {
  id?: number;
  name: string;
}

export interface AssignableShift {
  id?: number;
  day: DayOfWeek;
  time: Time;
  job: Job;

  // Used for commands
  timeId?: number;
  jobId?: number;
}

export interface RegularShift {
  id: number;
  day: DayOfWeek;
  week: number | null;
  time: Time;
  job: Job;

  // Used for commands
  timeId?: number;
  jobId?: number;
}

export const daysOfWeek = [
  { name: 'Monday', value: 1 },
  { name: 'Tuesday', value: 2 },
  { name: 'Wednesday', value: 3 },
  { name: 'Thursday', value: 4 },
  { name: 'Friday', value: 5 },
  { name: 'Saturday', value: 6 },
  { name: 'Sunday', value: 0 },
];

export interface Report {
  id: number;
  fullName: string;
  regularUnresponded: number;
  regularYes: number;
  regularNo: number;
  urgentYes: number;
}

export interface AdminRota {
  date: string;
  shifts: AdminRotaShift[];
}

export interface AdminRotaShift {
  time: Time;
  jobs: AdminRotaShiftJob[];
  showOnRota: boolean;
}

export interface AdminRotaShiftJob {
  job: Job;
  volunteers: AdminRotaShiftJobVolunteer[];
  required: number;
  coming: number;
  notComing: number;
  unconfirmed: number;
  enough: boolean;
  isAssignable: boolean;
  showOnRota: boolean;
}

export interface AdminRotaShiftJobVolunteer {
  id: number;
  name: string;
  fullName: string;
  isRegularShift: boolean;
  confirmed?: boolean;
  missingReason?: MissingReason;
  customMissingReason?: string;
  attendanceId?: number;
  areaId?: number;
  type: ShiftType;
}

export const initialRotaManagementState: RotaManagementState = {
  jobs: { loading: false, error: false, data: [], updated: false },
  times: { loading: false, error: false, data: [], updated: false },
  missingReasons: { loading: false, error: false, data: [], updated: false },
  requirements: { loading: false, error: false, data: [], updated: false },
  assignableShifts: { loading: false, error: false, data: [], updated: false },
  assignableAreas: { loading: false, error: false, data: [], updated: false },
  regularShifts: { loading: false, error: false, data: [], updated: false },
  rota: { loading: false, error: false, data: [], updated: false },
  reports: { loading: false, error: false, data: [], updated: false },
};
