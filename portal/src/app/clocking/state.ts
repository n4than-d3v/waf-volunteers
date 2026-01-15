export interface ClockingState {
  rota: ClockingRota[];
  loading: boolean;
  error: boolean;
}

export const initialClockingState: ClockingState = {
  rota: [],
  loading: false,
  error: false,
};

export interface ClockingRota {
  time: {
    name: string;
    start: string;
    end: string;
    id: number;
  };
  volunteers: Volunteer[];
}

export interface Volunteer {
  job: { id: number; name: string };
  fullName: string;
  name: string;
  confirmed: boolean;
  attendanceId?: number;
  visitorId?: number;
  cars: string[];
  car: string | null;
  in: string | null;
  out: string | null;
}
