export interface HospitalState {
  tab: Tab;

  patientCounts: ReadOnlyWrapper<PatientCounts>;
  patientsByStatus: ReadOnlyWrapper<ListPatient[]>;

  patient: ReadOnlyWrapper<Patient>;
  searchPatient: Task & { id: number | null };

  // Exams
  performExam: Task;
  attitudes: ReadOnlyWrapper<Attitude[]>;
  bodyConditions: ReadOnlyWrapper<BodyCondition[]>;
  dehydrations: ReadOnlyWrapper<Dehydration[]>;
  mucousMembraneColours: ReadOnlyWrapper<MucousMembraneColour[]>;
  mucousMembraneTextures: ReadOnlyWrapper<MucousMembraneTexture[]>;

  // Tasks
  addNote: Task;
  addRecheck: Task;
  removeRecheck: Task;
  addPrescription: Task;
  removePrescription: Task;
  movePatient: Task;
  setDisposition: Task;
  requestHomeCare: Task;
  dropOffHomeCare: Task;
  messageHomeCare: Task;
  updateBasicDetails: Task;
  updateDiets: Task;
  updateTags: Task;
  addLabs: Task;

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

  // View daily tasks
  dailyTasksReport: ReadOnlyWrapper<DailyTasksReport>;
  performRecheck: Task;
  administerPrescription: Task;

  // View patient boards
  boards: ReadOnlyWrapper<ListPatientBoard[]>;
  board: ReadOnlyWrapper<PatientBoard>;
}

export type TabCode =
  | 'DASHBOARD'
  | 'LIST_PATIENTS_BY_STATUS'
  | 'VIEW_PATIENT'
  | 'VIEW_DAILY_TASKS'
  | 'VIEW_STOCK'
  | 'VIEW_BOARDS';

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

export interface DailyTasksReport {
  rechecks: number;
  prescriptions: number;
  areas: DailyTasksReportArea[];
}

export interface DailyTasksReportArea {
  name: string;
  code: string;
  rechecks: number;
  prescriptions: number;
  pens: DailyTasksReportAreaPen[];
}

export interface DailyTasksReportAreaPen {
  code: string;
  reference: string;
  rechecks: number;
  prescriptions: number;
  patients: DailyTasksReportAreaPenPatient[];
}

export interface DailyTasksReportAreaPenPatient {
  id: number;
  reference: string;
  uniqueIdentifier: string;
  species: Species;
  variant: SpeciesVariant;
  rechecks: ListRecheck[];
  prescriptionInstructions: PrescriptionInstruction[];
  prescriptionMedications: PrescriptionMedication[];
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
  sex: number | null;
  lastUpdatedDetails: string | null;
  isLongTerm: boolean;
  isOutdated: boolean;
  status: PatientStatus;
  pen: Pen | null;
  area: Area | null;
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
  notes: string;
  responded: string | null;
  responder: { firstName: string; lastName: string } | null;
  pickup: string | null;
  dropoff: string | null;

  reference: string;
  species: Species;
  variant: SpeciesVariant;
  pen: Pen;
}

export interface HomeCareMessage {
  id: number;
  author: { firstName: string; lastName: string };
  date: string;
  message: string;
  me: boolean;
}

export interface Patient extends ListPatient {
  exams: ListExam[];
  rechecks: ListRecheck[];
  prescriptionMedications: PrescriptionMedication[];
  prescriptionInstructions: PrescriptionInstruction[];
  notes: ListNote[];
  movements: Movement[];
  homeCareMessages: HomeCareMessage[];
  faecalTests: ListFaecalTest[];
  bloodTests: ListBloodTest[];
  latestWeight: {
    weightUnit: number;
    weightValue: number;
  } | null;
}

export interface ListFaecalTest {
  id: number;
  tester: { firstName: string; lastName: string };
  tested: string;
  float: boolean | null;
  direct: boolean | null;
  comments: string;
}

export interface ListBloodTest {
  id: number;
  tester: { firstName: string; lastName: string };
  tested: string;
  comments: string;
  attachments: { id: number; fileName: string }[];
}

export interface Movement {
  id: number;
  moved: string;
  from: Pen;
  to: Pen;
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
  requireWeight: boolean;
  weightValue: number | null;
  weightUnit: number | null;

  viewPatientId: number;
  reference: string;
  species: Species;
  variant: SpeciesVariant;
  pen: Pen;
  uniqueIdentifier: string;
}

export interface ListNote {
  id: number;
  noter: { firstName: string; lastName: string };
  noted: string;
  weightValue: number | null;
  weightUnit: number | null;
  comments: string;
  attachments: { id: number; fileName: string }[];
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
  speciesVariant: SpeciesVariant;
  sex: number;
  weightValue: number | null;
  weightUnit: number | null;
  temperature: number | null;
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

  viewPatientId: number;
  reference: string;
  species: Species;
  variant: SpeciesVariant;
  pen: Pen;
  uniqueIdentifier: string;
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

  viewPatientId: number;
  reference: string;
  species: Species;
  variant: SpeciesVariant;
  pen: Pen;
  uniqueIdentifier: string;
  hasRechecks: boolean;
}

export interface TreatmentMedication {
  id: number;
  quantityValue: number;
  quantityUnit: string;
  medication: Medication;
  medicationConcentration: MedicationConcentration;
  administrationMethod: AdministrationMethod;
  comments: string;
}

export type Prescription = PrescriptionInstruction | PrescriptionMedication;

export interface Administration {
  id: number;
  administered: string;
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

export function getDisposition(patient: ListPatient) {
  switch (patient.disposition) {
    case 1:
      return 'Released';
    case 2:
      return 'Transferred';
    case 3:
      return 'Dead on arrival';
    case 4:
      return 'Died before 24 hrs';
    case 5:
      return 'Died after 24 hrs';
    case 6:
      return 'Euthanised before 24 hrs';
    case 7:
      return 'Euthanised after 24 hrs';
    default:
      return 'Unknown';
  }
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
  code: string;
}

export interface Medication {
  id: number;
  activeSubstance: string;
  brands: string[];
  notes: string[];
  concentrations: MedicationConcentration[];
}

export interface MedicationConcentration {
  id: number;
  form: string;
  concentrationMgMl: number;
  speciesDoses: MedicationConcentrationSpeciesDose[];
}

export interface MedicationConcentrationSpeciesDose {
  id: number;
  species: Species;
  speciesType: SpeciesType;
  doseMgKgRangeStart: number;
  doseMgKgRangeEnd: number;
  doseMlKgRangeStart: number;
  doseMlKgRangeEnd: number;
  administrationMethod: AdministrationMethod;
  frequency: string;
  notes: string;
}

export enum SpeciesType {
  Mammal = 1,
  Bird = 2,
  Amphibian = 3,
  Reptile = 4,
}

export interface Pen {
  id: number;
  code: string;
  reference: string;

  // Only available on getAreas()
  empty: boolean;
}

export interface Area {
  id: number;
  name: string;
  code: string;
  pens: Pen[];

  // Only available on getAreas()
  empty: boolean;
}

export interface SpeciesVariant {
  id: number;
  name: string;
  friendlyName: string;
  feedingGuidance: string;
  order: number;
}

export interface Species {
  id: number;
  speciesType: SpeciesType;
  name: string;
  variants: SpeciesVariant[];
}

export interface Exam {
  patientId: number;
  speciesId: number;
  speciesVariantId: number;
  sex: number;
  weightValue: number | null;
  weightUnit: number | null;
  temperature: number | null;
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
    medicationConcentrationId: number;
    administrationMethodId: number;
    comments: string;
  }[];
  comments: string;
}

export type Outcome =
  | 'alive'
  | 'release'
  | 'diedOnTable'
  | 'deadOnArrival'
  | 'pts';

export interface ListPatientBoard {
  id: number;
  name: string;
}

export interface PatientBoard {
  board: { name: string; messages: { id: number; message: string }[] };
  areas: PatientBoardArea[];
}

export interface PatientBoardArea {
  area: { id: number; area: { name: string } };
  summary: string[] | null;
  pens: PatientBoardAreaPen[] | null;
}

export interface PatientBoardAreaPen {
  reference: string;
  patients: ListPatient[];
}

export const createReadOnlyWrapper = <T>(): ReadOnlyWrapper<T> => ({
  data: null,
  loading: false,
  error: false,
});

export const createTask = (): Task => ({
  loading: false,
  success: false,
  error: false,
});

export const initialHospitalState: HospitalState = {
  tab: { code: 'DASHBOARD', title: 'Dashboard' },
  patientCounts: createReadOnlyWrapper<PatientCounts>(),
  patientsByStatus: createReadOnlyWrapper<ListPatient[]>(),
  patient: createReadOnlyWrapper<Patient>(),
  searchPatient: { ...createTask(), id: null },
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
  removeRecheck: createTask(),
  addPrescription: createTask(),
  removePrescription: createTask(),
  movePatient: createTask(),
  requestHomeCare: createTask(),
  dropOffHomeCare: createTask(),
  messageHomeCare: createTask(),
  updateBasicDetails: createTask(),
  updateDiets: createTask(),
  updateTags: createTask(),
  dailyTasksReport: createReadOnlyWrapper<DailyTasksReport>(),
  performRecheck: createTask(),
  administerPrescription: createTask(),
  addLabs: createTask(),
  boards: createReadOnlyWrapper<ListPatientBoard[]>(),
  board: createReadOnlyWrapper<PatientBoard>(),
};
