import { PatientBoardAreaDisplayType } from '../admin/hospital/state';

export interface HospitalState {
  tab: Tab;
  tabHistory: Tab[];

  dashboard: ReadOnlyWrapper<Dashboard>;

  patientCounts: ReadOnlyWrapper<PatientCounts>;
  patientsByStatus: ReadOnlyWrapper<{ total: number; patients: ListPatient[] }>;

  patient: ReadOnlyWrapper<Patient>;
  searchPatient: Task & { id: number | null };

  attachment: EmbeddedContent | null;

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
  transferHomeCare: Task;
  dropOffHomeCare: Task;
  messageHomeCare: Task;
  updateBasicDetails: Task;
  updateDiets: Task;
  updateTags: Task;
  addLabs: Task;
  markBoard: Task;
  markPenClean: Task;

  // Patient details
  foods: ReadOnlyWrapper<Food[]>;
  tags: ReadOnlyWrapper<Tag[]>;
  areas: ReadOnlyWrapper<Area[]>;
  species: ReadOnlyWrapper<Species[]>;

  // Disposition
  releaseTypes: ReadOnlyWrapper<ReleaseType[]>;
  transferLocations: ReadOnlyWrapper<TransferLocation[]>;
  dispositionReasons: ReadOnlyWrapper<DispositionReason[]>;
  homeCarers: ReadOnlyWrapper<HomeCarer[]>;

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
  | ''
  | 'DASHBOARD'
  | 'LIST_PATIENTS_BY_STATUS'
  | 'VIEW_PATIENT'
  | 'VIEW_DAILY_TASKS'
  | 'VIEW_STOCK'
  | 'VIEW_BOARDS'
  | 'VIEW_EMBEDDED_CONTENT';

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

export interface Dashboard {
  speciesRescues: { [year: number]: { [species: string]: number[] } };
  patientAdmissionsByDate: { [year: number]: { [date: string]: number } };
  patientsInCareByDate: { [year: number]: { [date: string]: number } };
  patientsByAdmissionReason: { [year: number]: { [reason: string]: number } };
  patientsBySpecies: { [year: number]: { [species: string]: number } };
  patientsByDisposition: { [year: number]: { [disposition: number]: number } };
  patientsBySpeciesDisposition: {
    [year: number]: { [species: string]: number[] };
  };
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
  warnings: DailyTasksReportAreaPenPatientWarning[];
}

export interface DailyTasksReportAreaPenPatientWarning {
  batchNumber: string;
  brand: string;
  expiry: boolean;
  expiryInUse: boolean;
}

export interface HomeCarer {
  id: number;
  firstName: string;
  lastName: string;
}

export interface ListPatient {
  beaconId: number;
  admitted: string;
  lastUpdatedStatus: string;
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
  microchip: string | null;
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
  feeding: Feeding[];
  disposition: Disposition | null;
  dispositioned: string | null;
  dispositionReasons: DispositionReason[];
  releaseType: ReleaseType | null;
  transferLocation: TransferLocation | null;
  dispositioner: {} | null;
  homeCareRequests: HomeCareRequest[];
  lastMessageSentByOrphanFeeder: boolean | null;
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

export interface EmbeddedContent extends Attachment {
  url: string;
}

export const supportedEmbeddedImageTypes = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/svg+xml',
  'image/bmp',
  'image/x-icon',
];

export const supportedEmbeddedVideoTypes = [
  'video/mp4',
  'video/webm',
  'video/ogg',
];

export const supportedEmbeddedAudioTypes = [
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/aac',
  'audio/flac',
];

export const supportedEmbeddedContentTypes = [
  ...supportedEmbeddedImageTypes,
  ...supportedEmbeddedVideoTypes,
  ...supportedEmbeddedAudioTypes,
  'application/pdf',
  'text/html',
  'text/plain',
];

export interface Attachment {
  id: number;
  fileName: string;
  contentType: string;
}

export interface HomeCareMessage {
  id: number;
  author: { firstName: string; lastName: string };
  date: string;
  message: string;
  weightValue: number | null;
  weightUnit: number | null;
  attachments: Attachment[];
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
  weightHistory: PatientWeight[];
  initialWeight: PatientWeight | null;
  latestWeight: PatientWeight | null;
}

export interface PatientWeight {
  date: string;
  weightUnit: number;
  weightValue: number;
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
  attachments: Attachment[];
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

export function getWeightUnit(
  weightUnit: number | null,
): 'g' | 'kg' | 'oz' | 'lbs' | '' {
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

export function getRecheckRoles(
  roles: number,
): 'Veterinarian' | 'Technician' | '' {
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
  attachments: Attachment[];
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

  administerToday: number;
  administeredToday: number;
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

  administerToday: number;
  administeredToday: number;
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

export interface Feeding {
  time: string;
  quantityValue: number;
  quantityUnit: string;
  notes: string;
  dish: string;
  topUp: boolean;
  food: { id: number; name: string };
}

export interface Food {
  id: number;
  name: string;
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
  concentrationValue: number;
  concentrationUnit: string;
  defaultUnit: string;
  speciesDoses: MedicationConcentrationSpeciesDose[];
}

export interface MedicationConcentrationSpeciesDose {
  id: number;
  species: Species;
  speciesType: SpeciesType;
  concentrationDoseRangeStart: number;
  concentrationDoseRangeEnd: number;
  defaultDoseRangeStart: number;
  defaultDoseRangeEnd: number;
  administrationMethod: AdministrationMethod;
  frequency: string;
  notes: string;
}

export enum SpeciesType {
  Mammal = 1,
  Bird = 2,
  Amphibian = 3,
  Reptile = 4,

  Waterfowl = 5,
  Pigeon = 6,
  Raptor = 7,
  Rodent = 8,
}

export interface Pen {
  id: number;
  code: string;
  reference: string;
  deleted: boolean;

  // Only available on getAreas()
  empty: boolean;
  needsCleaning: boolean;
}

export interface Area {
  id: number;
  name: string;
  code: string;
  deleted: boolean;
  pens: Pen[];

  // Only available on getAreas()
  empty: boolean;
}

export interface SpeciesVariant {
  id: number;
  name: string;
  friendlyName: string;
  order: number;
  feedingGuidance: Feeding[];
}

export interface Species {
  id: number;
  speciesType: SpeciesType;
  name: string;
  variants: SpeciesVariant[];
}

export interface Exam {
  examId: number | null;
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
  | 'pts'
  | 'none';

export interface ListPatientBoard {
  id: number;
  name: string;
}

export interface PatientBoard {
  board: {
    name: string;
    forBirds: boolean;
    messages: {
      id: number;
      message: string;
      emergency: boolean;
    }[];
  };
  areas: PatientBoardArea[];
  summary: PatientBoardSummary[];
}

export interface PatientBoardSummary {
  species: string;
  quantity: number;
  variants: PatientBoardSummaryVariant[];
}

export interface PatientBoardSummaryVariant {
  name: string;
  quantity: number;
  locations: string[];
  feeding: PatientBoardSummaryFeeding[];
}

export interface PatientBoardSummaryFeeding {
  time: string;
  items: PatientBoardSummaryFeedingItem[];
}

export interface PatientBoardSummaryFeedingItem {
  quantityValue: number;
  quantityUnit: string;
  food: string;
}

export interface PatientBoardArea {
  displayType: PatientBoardAreaDisplayType;
  area: { id: number; area: { name: string } };
  summary: string[];
  pens: PatientBoardAreaPen[] | null;
}

export interface PatientBoardAreaPen {
  id: number;
  reference: string;
  patients: string[] | null;
  patientReferences: string[] | null;
  tags: string[] | null;

  hasCustomDiet: boolean;

  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  tasks: number[];

  feedings: PatientBoardAreaPenFeeding[];
  feedingSummaries: PatientBoardAreaPenFeedingSummary[];

  needsCleaning: boolean;
}

export interface PatientBoardAreaPenFeedingSummary {
  interval: string;
  food: string;
  quantityEach: number;
  quantityUnit: string;
}

export interface PatientBoardAreaPenFeeding {
  time: string;
  timeId: number;
  details: PatientBoardAreaPenTaskDetails[];
}

export interface PatientBoardAreaPenTaskDetails {
  quantityEach: number;
  quantityTotal: number;
  quantityUnit: string;
  food: string;
  forceFeed: boolean;
  topUp: string;
  notes: string;
  dish: string;
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
  tabHistory: [{ code: 'DASHBOARD', title: 'Dashboard' }],
  markBoard: createTask(),
  markPenClean: createTask(),
  dashboard: createReadOnlyWrapper<Dashboard>(),
  patientCounts: createReadOnlyWrapper<PatientCounts>(),
  patientsByStatus: createReadOnlyWrapper<{
    total: number;
    patients: ListPatient[];
  }>(),
  patient: createReadOnlyWrapper<Patient>(),
  searchPatient: { ...createTask(), id: null },
  attachment: null,
  attitudes: createReadOnlyWrapper<Attitude[]>(),
  bodyConditions: createReadOnlyWrapper<BodyCondition[]>(),
  dehydrations: createReadOnlyWrapper<Dehydration[]>(),
  mucousMembraneColours: createReadOnlyWrapper<MucousMembraneColour[]>(),
  mucousMembraneTextures: createReadOnlyWrapper<MucousMembraneTexture[]>(),
  foods: createReadOnlyWrapper<Food[]>(),
  tags: createReadOnlyWrapper<Tag[]>(),
  dispositionReasons: createReadOnlyWrapper<DispositionReason[]>(),
  releaseTypes: createReadOnlyWrapper<ReleaseType[]>(),
  transferLocations: createReadOnlyWrapper<TransferLocation[]>(),
  homeCarers: createReadOnlyWrapper<HomeCarer[]>(),
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
  transferHomeCare: createTask(),
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
