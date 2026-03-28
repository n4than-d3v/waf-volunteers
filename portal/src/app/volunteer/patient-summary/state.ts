import { createReadOnlyWrapper, ReadOnlyWrapper } from '../../hospital/state';

export interface PatientSummaryState {
  summary: ReadOnlyWrapper<PatientSummary>;
}

export interface PatientSummary {
  total: number;
  uniqueSpecies: number;

  mammals: number;

  waterfowl: number;
  pigeons: number;
  raptors: number;
  otherBirds: number;

  amphibians: number;
  reptiles: number;
  rodents: number;

  species: PatientSummarySpecies[];
}

export interface PatientSummarySpecies {
  total: number;
  name: string;
  variants: PatientSummarySpeciesVariant[];
}

export interface PatientSummarySpeciesVariant {
  total: number;
  name: string;
}

export const initialPatientSummaryState: PatientSummaryState = {
  summary: createReadOnlyWrapper<PatientSummary>(),
};
