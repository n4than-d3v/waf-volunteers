export interface RotaManagementState {
  jobs: Wrapper<Job>;
  times: Wrapper<Time>;
  missingReasons: Wrapper<MissingReason>;
  requirements: Wrapper<Requirement>;
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

export const initialRotaManagementState: RotaManagementState = {
  jobs: { loading: false, error: false, data: [], updated: false },
  times: { loading: false, error: false, data: [], updated: false },
  missingReasons: { loading: false, error: false, data: [], updated: false },
  requirements: { loading: false, error: false, data: [], updated: false },
};
