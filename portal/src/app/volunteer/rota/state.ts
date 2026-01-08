import { Job, MissingReason, RegularShift, Time } from '../../admin/rota/state';

export interface RotaState {
  loading: boolean;
  error: boolean;
  rota: Rota;

  confirming: boolean;
  confirmed: boolean;

  denying: boolean;
  denied: boolean;
}

export interface Rota {
  regularShifts: RegularShift[];
  nextShift: Shift | null;
  rota: Shift[];
  extraShifts: Shift[];
  missingReasons: MissingReason[];
  urgentShifts: UrgentShift[];
  allowedJobs: Job[];
}

export interface Shift {
  date: string;
  time: Time;
  job: Job;
  confirmed: boolean | null;
  missingReason?: MissingReason;
  customMissingReason?: string;
  others: { name: string; area?: AssignableArea }[];
  area?: AssignableArea;
  type: ShiftType;
}

export enum ShiftType {
  Regular = 1,
  Urgent = 2,
  Extra = 3,
}

export interface UrgentShift {
  date: string;
  time: Time;
  job: Job;
  confirmed: boolean | null;
  coming: number;
  required: number;
  others: { name: string; area?: AssignableArea }[];
  area?: AssignableArea;
  type: ShiftType;
}

export interface AssignableArea {
  id: number;
  name: string;
}

export const initialRotaState: RotaState = {
  loading: false,
  error: false,
  rota: {
    regularShifts: [],
    nextShift: null,
    rota: [],
    missingReasons: [],
    urgentShifts: [],
    allowedJobs: [],
    extraShifts: [],
  },
  confirming: false,
  confirmed: false,
  denying: false,
  denied: false,
};
