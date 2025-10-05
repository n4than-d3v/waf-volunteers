export interface RotaState {
  loading: boolean;
  error: boolean;
  regularShifts: RegularShift[];
  missingReasons: MissingReason[];
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

export interface RegularShift {
  id: number;
  day: DayOfWeek;
  time: Time;
  job: Job;
}

export interface Job {
  id: number;
  name: string;
}

export interface MissingReason {
  id: number;
  name: string;
}

export interface Time {
  id: number;
  name: string;
  start: string;
  end: string;
}

export const initialRotaState: RotaState = {
  loading: false,
  error: false,
  regularShifts: [],
  missingReasons: [],
};
