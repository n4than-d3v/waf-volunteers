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
  missingReasons: MissingReason[];
  urgentShifts: UrgentShift[];
}

export interface Shift {
  date: string;
  time: Time;
  job: Job;
  confirmed: boolean | null;
  missingReason?: MissingReason;
  customMissingReason?: string;
  others: string[];
}

export interface UrgentShift {
  date: string;
  time: Time;
  job: Job;
  confirmed: boolean | null;
  coming: number;
  required: number;
  others: string[];
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
  },
  confirming: false,
  confirmed: false,
  denying: false,
  denied: false,
};
