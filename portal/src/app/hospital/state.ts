export interface HospitalState {
  tab: Tab;

  patientCounts: ReadOnlyWrapper<PatientCounts>;
  patientsByStatus: ReadOnlyWrapper<ListPatient[]>;

  patient: ReadOnlyWrapper<Patient>;

  // Exams
  performExam: Task;
  attitudes: ReadOnlyWrapper<Attitude[]>;
  bodyConditions: ReadOnlyWrapper<BodyCondition[]>;
  dehydrations: ReadOnlyWrapper<Dehydration[]>;
  mucousMembraneColours: ReadOnlyWrapper<MucousMembraneColour[]>;
  mucousMembraneTextures: ReadOnlyWrapper<MucousMembraneTexture[]>;

  // Disposition
  setDisposition: Task;

  // Tasks
  addNote: Task;
  addRecheck: Task;
  addPrescription: Task;
  movePatient: Task;

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

export interface Task {
  loading: boolean;
  success: boolean;
  error: boolean;
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
  species: Species | null;
  speciesVariant: SpeciesVariant | null;
  status: PatientStatus;
  pen: Pen | null;
  tags: Tag[];
  diets: Diet[];
  disposition: Disposition | null;
  dispositioned: string | null;
  dispositionReason: DispositionReason | null;
  releaseType: ReleaseType | null;
  transferLocation: TransferLocation | null;
  dispositioner: {} | null;
  homeCareRequests: HomeCareRequest[];
  id: number;
}

export interface HomeCareRequest {
  id: number;
  requested: string;
  requester: { firstName: string; lastName: string } | null;
  responded: string | null;
  responder: { firstName: string; lastName: string } | null;
  pickup: string | null;
  dropoff: string | null;
}

export interface Patient extends ListPatient {
  exams: ListExam[];
  rechecks: ListRecheck[];
  prescriptionMedications: PrescriptionMedication[];
  prescriptionInstructions: PrescriptionInstruction[];
  notes: ListNote[];
  movements: {}[];
  homeCareMessages: {}[];
}

export function getSex(sex: number): string {
  switch (sex) {
    case 1:
      return 'Male';
    case 2:
      return 'Female';
    default:
      return 'Unknown';
  }
}

export function getWeightUnit(weightUnit: number | null): string {
  switch (weightUnit) {
    case 1:
      return 'g';
    case 2:
      return 'kg';
    case 3:
      return 'oz';
    case 4:
      return 'lbs';
    default:
      return '';
  }
}

export function getTemperatureUnit(temperatureUnit: number | null): string {
  switch (temperatureUnit) {
    case 1:
      return '°C';
    case 2:
      return '°F';
    default:
      return '';
  }
}

export function getRecheckRoles(roles: number): string {
  if (roles === 1) return 'Veterinarian';
  if (roles === 2) return 'Technician';
  return '';
}

export interface ListRecheck {
  id: number;
  due: string;
  description: string;
  roles: number;
  rechecker: { firstName: string; lastName: string } | null;
  rechecked: string | null;
  comments: string | null;
}

export interface ListNote {
  id: number;
  noter: { firstName: string; lastName: string };
  noted: string;
  weightValue: number | null;
  weightUnit: number | null;
  comments: string;
}

export enum ExamType {
  Initial = 1,
  FollowUp = 2,
}

export interface ListExam {
  id: number;
  type: ExamType;
  examiner: { firstName: string; lastName: string };
  date: string;
  species: Species;
  speciesAge: SpeciesAge;
  sex: number;
  weightValue: number | null;
  weightUnit: number | null;
  temperatureValue: number | null;
  temperatureUnit: number | null;
  attitude: Attitude | null;
  bodyCondition: BodyCondition | null;
  dehydration: Dehydration | null;
  mucousMembraneColour: MucousMembraneColour | null;
  mucousMembraneTexture: MucousMembraneTexture | null;
  treatmentInstructions: TreatmentInstruction[];
  treatmentMedications: TreatmentMedication[];
  comments: string;
}

export interface PrescriptionInstruction extends TreatmentInstruction {
  start: string;
  end: string;
  frequency: string;
  administrations: Administration[];
}

export interface TreatmentInstruction {
  id: number;
  instructions: string;
}

export interface PrescriptionMedication extends TreatmentMedication {
  start: string;
  end: string;
  frequency: string;
  administrations: Administration[];
}

export interface TreatmentMedication {
  id: number;
  quantityValue: number;
  quantityUnit: string;
  medication: Medication;
  administrationMethod: AdministrationMethod;
  comments: string;
}

export interface Administration {
  administrator: { firstName: string; lastName: string };
  success: boolean;
  comments: string;
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

export enum Disposition {
  Released = 1,
  Transferred = 2,
  DeadOnArrival = 3,
  DiedBefore24Hrs = 4,
  DiedAfter24Hrs = 5,
  PtsBefore24Hrs = 6,
  PtsAfter24Hrs = 7,
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

export interface Pen {
  id: number;
  code: string;
  reference: string;
}

export interface Area {
  id: number;
  name: string;
  code: string;
  pens: Pen[];
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

export interface Exam {
  patientId: number;
  speciesId: number;
  speciesAgeId: number;
  sex: number;
  weightValue: number | null;
  weightUnit: number | null;
  temperatureValue: number | null;
  temperatureUnit: number | null;
  attitudeId: number | null;
  bodyConditionId: number | null;
  dehydrationId: number | null;
  mucousMembraneColourId: number | null;
  mucousMembraneTextureId: number | null;
  treatmentInstructions: {
    instructions: string;
  }[];
  treatmentMedications: {
    quantityValue: number;
    quantityUnit: string;
    medicationId: number;
    administrationMethodId: number;
    comments: string;
  }[];
  comments: string;
}

export type Outcome = 'alive' | 'release' | 'deadOnArrival' | 'pts';

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

const createTask = (): Task => ({
  loading: false,
  success: false,
  error: false,
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
  performExam: createTask(),
  setDisposition: createTask(),
  addNote: createTask(),
  addRecheck: createTask(),
  addPrescription: createTask(),
  movePatient: createTask(),
};
