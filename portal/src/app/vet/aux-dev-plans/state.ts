export interface AuxDevPlanState {
  learners: AuxDevLearner[];
  tasks: AuxDevTask[];
  loading: boolean;
  error: boolean;
}

export interface AuxDevLearner {
  id: number;
  name: string;
  tasks: AuxDevTask[];
}

export interface AuxDevTask {
  id: number;
  name: string;
  explanation: string;
  youTube: string[];
  signedOff: boolean;
  witnesses: AuxDevTaskWitness[];
}

export interface AuxDevTaskWitness {
  id: number;
  witnessedBy: string;
  date: string;
  notes: string;
  signedOff: boolean;
}

export const initialAuxDevPlanState: AuxDevPlanState = {
  tasks: [],
  learners: [],
  loading: false,
  error: false,
};
