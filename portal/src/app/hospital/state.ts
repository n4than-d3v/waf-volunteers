export interface HospitalState {
  tab: Tab;

  patientCounts: ReadOnlyWrapper<PatientCounts>;
  patientsByStatus: ReadOnlyWrapper<ListPatient[]>;

  patient: ReadOnlyWrapper<Patient>;

  // Exams
  attitudes: ReadOnlyWrapper<Attitude[]>;
  bodyConditions: ReadOnlyWrapper<BodyCondition[]>;
  dehydrations: ReadOnlyWrapper<Dehydration[]>;
  mucousMembraneColours: ReadOnlyWrapper<MucousMembraneColour[]>;
  mucousMembraneTextures: ReadOnlyWrapper<MucousMembraneTexture[]>;

  // Patient details
  tags: ReadOnlyWrapper<Tag[]>;
  diets: ReadOnlyWrapper<Diet[]>;
  areas: ReadOnlyWrapper<Area[]>;
  species: ReadOnlyWrapper<Species[]>;

  // Disposition
  releaseTypes: ReadOnlyWrapper<ReleaseType[]>;
  transferLocations: ReadOnlyWrapper<TransferLocation[]>;
  dispositionReasons: ReadOnlyWrapper<DispositionReason[]>;

  // Medications
  medications: ReadOnlyWrapper<Medication[]>;
  administrationMethods: ReadOnlyWrapper<AdministrationMethod[]>;
}

export type TabCode = 'DASHBOARD' | 'LIST_PATIENTS_BY_STATUS' | 'VIEW_PATIENT';

export interface Tab {
  code: TabCode;
  title: string;

  id?: number;
}

export interface ReadOnlyWrapper<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

export interface Wrapper<T> extends ReadOnlyWrapper<T> {
  created: boolean;
  updated: boolean;
}

export interface PatientCounts {
  pendingInitialExam: number;
  inpatient: number;
  pendingHomeCare: number;
  receivingHomeCare: number;
  readyForRelease: number;
  dispositioned: number;
}

export enum PatientStatus {
  PendingInitialExam = 1,
  Inpatient = 2,
  PendingHomeCare = 3,
  ReceivingHomeCare = 4,
  ReadyForRelease = 5,
  Dispositioned = 6,
}

export interface ListPatient {
  beaconId: number;
  admitted: string;
  admitter: {
    beaconId: number;
    fullName: string;
    address: string;
    telephone: string;
    email: string;
    id: number;
  } | null;
  foundAt: string;
  initialLocation: {
    description: string;
    id: number;
  };
  suspectedSpecies: {
    description: string;
    id: number;
  };
  admissionReasons: {
    description: string;
    id: number;
  }[];
  reference: string;
  name: string | null;
  uniqueIdentifier: string | null;
  species: { name: string } | null;
  speciesVariant: {} | null;
  status: PatientStatus;
  pen: {} | null;
  tags: {}[];
  diets: {}[];
  disposition: {} | null;
  dispositioned: string | null;
  dispositionReason: {} | null;
  releaseType: {} | null;
  transferLocation: {} | null;
  dispositioner: {} | null;
  id: number;
}

export interface Patient extends ListPatient {
  exams: {}[];
  rechecks: {}[];
  prescriptionMedications: {}[];
  prescriptionInstructions: {}[];
  notes: {}[];
  movements: {}[];
  homeCareRequests: {}[];
  homeCareMessages: {}[];
}

export interface Attitude {
  id: number;
  description: string;
}

export interface BodyCondition {
  id: number;
  description: string;
}

export interface Dehydration {
  id: number;
  description: string;
}

export interface MucousMembraneColour {
  id: number;
  description: string;
}

export interface MucousMembraneTexture {
  id: number;
  description: string;
}

export interface Diet {
  id: number;
  name: string;
  description: string;
}

export interface Tag {
  id: number;
  name: string;
  description: string;
}

export interface DispositionReason {
  id: number;
  description: string;
  communication: string;
}

export interface ReleaseType {
  id: number;
  description: string;
}

export interface TransferLocation {
  id: number;
  description: string;
}

export interface AdministrationMethod {
  id: number;
  description: string;
}

export interface Medication {
  id: number;
  vmdProductNo: string;
  name: string;
  maHolder: string;
  distributors: string;
  vmNo: string;
  controlledDrug: boolean;
  activeSubstances: { name: string }[];
  targetSpecies: { name: string }[];
  pharmaceuticalForm: { name: string };
  therapeuticGroup: { name: string };
  spcLink: string;
  ukparLink: string;
  paarLink: string;
  used: boolean;
}

export interface Area {
  id: number;
  name: string;
  code: string;
  pens: { code: string }[];
}

export interface SpeciesAge {
  id: number;
  name: string;
  associatedVariant: { id: number; name: string };
}

export interface SpeciesVariant {
  id: number;
  name: string;
  feedingGuidance: string;
}

export interface Species {
  id: number;
  name: string;
  ages: SpeciesAge[];
  variants: SpeciesVariant[];
}

const createReadOnlyWrapper = <T>(): ReadOnlyWrapper<T> => ({
  data: null,
  loading: false,
  error: false,
});

const createWrapper = <T>(): Wrapper<T> => ({
  ...createReadOnlyWrapper<T>(),
  created: false,
  updated: false,
});

export const initialHospitalState: HospitalState = {
  tab: { code: 'DASHBOARD', title: 'Dashboard' },
  patientCounts: createReadOnlyWrapper<PatientCounts>(),
  patientsByStatus: createReadOnlyWrapper<ListPatient[]>(),
  patient: createReadOnlyWrapper<Patient>(),
  attitudes: createReadOnlyWrapper<Attitude[]>(),
  bodyConditions: createReadOnlyWrapper<BodyCondition[]>(),
  dehydrations: createReadOnlyWrapper<Dehydration[]>(),
  mucousMembraneColours: createReadOnlyWrapper<MucousMembraneColour[]>(),
  mucousMembraneTextures: createReadOnlyWrapper<MucousMembraneTexture[]>(),
  diets: createReadOnlyWrapper<Diet[]>(),
  tags: createReadOnlyWrapper<Tag[]>(),
  dispositionReasons: createReadOnlyWrapper<DispositionReason[]>(),
  releaseTypes: createReadOnlyWrapper<ReleaseType[]>(),
  transferLocations: createReadOnlyWrapper<TransferLocation[]>(),
  administrationMethods: createReadOnlyWrapper<AdministrationMethod[]>(),
  medications: createReadOnlyWrapper<Medication[]>(),
  areas: createReadOnlyWrapper<Area[]>(),
  species: createReadOnlyWrapper<Species[]>(),
};
