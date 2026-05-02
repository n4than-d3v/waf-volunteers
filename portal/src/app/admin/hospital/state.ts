import { Feeding } from '../../hospital/state';
import { HomeCarerPermissions } from '../../shared/token.provider';

export interface AdminHospitalManagementState {
  foods: Wrapper<Food>;
  tags: Wrapper<Tag>;
  dispositionReasons: Wrapper<DispositionReason>;
  releaseTypes: Wrapper<ReleaseType>;
  transferLocations: Wrapper<TransferLocation>;
  medications: Wrapper<Medication>;
  areas: Wrapper<Area>;
  species: Wrapper<Species>;
  boards: Wrapper<PatientBoard>;
  boardMessages: Wrapper<PatientBoardMessage>;
  boardCustomPens: Wrapper<PatientBoardCustomPen>;
}

export interface Wrapper<T> {
  data: T[];
  loading: boolean;
  error: boolean;
  created: boolean;
  updated: boolean;
}

export interface CreateFoodCommand {
  name: string;
  notes: string;
  substitute: string;
  forceFeed: boolean;
  sumUp: boolean;
}

export interface Food extends CreateFoodCommand {
  id: number;
}

export interface CreateTagCommand {
  name: string;
  description: string;
}

export interface Tag extends CreateTagCommand {
  id: number;
}

export interface CreateDispositionReasonCommand {
  description: string;
  communication: string;
}

export interface DispositionReason extends CreateDispositionReasonCommand {
  id: number;
}

export interface CreateReleaseTypeCommand {
  description: string;
}

export interface ReleaseType extends CreateReleaseTypeCommand {
  id: number;
}

export interface CreateTransferLocationCommand {
  description: string;
}

export interface TransferLocation extends CreateTransferLocationCommand {
  id: number;
}

export interface Medication {
  id: number;
  activeSubstance: string;
  brands: string[];
  notes: string;
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

export interface AdministrationMethod {
  id: number;
  code: string;
  description: string;
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

export interface CreateAreaCommand {
  name: string;
  code: string;
}

export interface CreatePenCommand {
  areaId: number;
  code: string;
}

export interface Area extends CreateAreaCommand {
  id: number;
  deleted: boolean;
  pens: {
    id: number;
    code: string;
    reference: string;
    deleted: boolean;
  }[];
}

export interface CreateSpeciesCommand {
  name: string;
  speciesType: SpeciesType;
  homeCarerPermissions: HomeCarerPermissions | null;
}

export interface CreateSpeciesVariantCommand {
  speciesId: number;
  name: string;
  friendlyName: string;
  order: number;
  longTermDays: number;

  feedingGuidance: {
    foodId: number;
    time: string;
    quantityValue: number;
    quantityUnit: string;
  }[];
}

export interface UpdateSpeciesCommand extends CreateSpeciesCommand {
  id: number;
}

export interface UpdateSpeciesVariantCommand extends CreateSpeciesVariantCommand {
  id: number;
}

export interface SpeciesVariant {
  id: number;
  name: string;
  friendlyName: string;
  order: number;
  longTermDays: number;
  feedingGuidance: SpeciesVariantFeedingGuidance[];
}

export interface SpeciesVariantFeedingGuidance {
  id: number;
  food: { id: number; name: string };
  time: string;
  quantityValue: number;
  quantityUnit: string;
  notes: string;
  dish: string;
  topUp: boolean;
}

export interface Species extends UpdateSpeciesCommand {
  variants: SpeciesVariant[];
}

export function getSpeciesType(type: SpeciesType) {
  switch (type) {
    case SpeciesType.Amphibian:
      return 'Amphibians';
    case SpeciesType.Bird:
      return 'Birds';
    case SpeciesType.Waterfowl:
      return 'Waterfowl';
    case SpeciesType.Pigeon:
      return 'Pigeons';
    case SpeciesType.Raptor:
      return 'Raptors';
    case SpeciesType.Mammal:
      return 'Mammals';
    case SpeciesType.Rodent:
      return 'Rodents';
    case SpeciesType.Reptile:
      return 'Reptiles';
    default:
      return 'Unknown';
  }
}

export interface PatientBoard {
  id: number;
  name: string;
  forBirds: boolean;
  sumUp: boolean;
  areas: PatientBoardArea[];
}

export interface PatientBoardMessage {
  id: number;
  exposeBoardId: number;
  exposeBoardName: string;
  isActive: boolean;
  message: string;
  start: string;
  end: string;
  emergency: boolean;
}

export interface PatientBoardCustomPen {
  id: number;
  exposeBoardId: number;
  exposeBoardName: string;
  isActive: boolean;
  title: string;
  body: string[];
  tags: string[];
  expiresOn: string | null;
  tasks: PatientBoardCustomPenTask[];
}

export interface PatientBoardCustomPenTask {
  food: { id: number; name: string }; // Used as part of conversion
  foodOrTask: string;
  time: string;
  quantityValue: number;
  quantityUnit: string;
  notes: string;
  dish: string;
  topUp: boolean;
}

export interface PatientBoardArea {
  id: number;
  area: Area;
  displayType: PatientBoardAreaDisplayType;
}

export enum PatientBoardAreaDisplayType {
  Hidden = 0,
  ShowPatients = 1,
  SummarisePatients = 2,
}

export function convertTime(time: string) {
  time = String(time);
  if (time.includes(':')) {
    const timeSplit = time.split(':');
    return `${timeSplit[0]}:${timeSplit[1]}`;
  } else {
    const number = Number(time);
    if (number === 1) return 'Every hour';
    else if (number < 1) return `Every ${60 * number} minutes`;
    else return `Every ${number} hours`;
  }
}

export function unconvertTime(time: string) {
  if (time === 'Every hour') return 1;
  const number = Number(time.split(' ')[1]);
  if (time.includes('minutes')) {
    return number / 60;
  } else {
    return number;
  }
}

export function numberToTime(num: number) {
  const hours = Math.floor(num);
  const minutes = Math.round((num - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function formatFractionalNumber(value: number): string {
  // Convert decimal to fraction (closest simple fraction)
  function toFraction(x: number, maxDenominator = 16): string | null {
    for (let denom = 1; denom <= maxDenominator; denom++) {
      const num = Math.round(x * denom);
      if (Math.abs(num / denom - x) < 1e-3) return `${num}/${denom}`;
    }
    return null;
  }

  if (value > 0 && value < 1) {
    const fraction = toFraction(value);
    if (fraction) return fraction;
  }

  return value.toLocaleString();
}

export const formatFeeding = (feeding: Feeding[]) => {
  const grouped = feeding.reduce<Record<string, string[]>>((acc, guidance) => {
    const formattedTime = guidance.time;

    const every = formattedTime.includes('Every');
    const times: string[] = [];
    if (every) {
      const interval = unconvertTime(formattedTime);
      let hour = 9;
      while (hour <= 22) {
        times.push(numberToTime(hour));
        hour += interval;
      }
    }

    if (every) {
      for (const intervalTime of times) {
        if (!acc[intervalTime]) {
          acc[intervalTime] = [];
        }
      }
    } else {
      if (!acc[formattedTime]) {
        acc[formattedTime] = [];
      }
    }

    if (guidance.quantityValue >= 0) {
      const message =
        guidance.quantityValue === 0
          ? `${guidance.food.name} ${guidance.topUp ? '(top up)' : ''}`
          : `${formatFractionalNumber(guidance.quantityValue)} ${guidance.quantityUnit} ${guidance.food.name} ${guidance.topUp ? '(top up)' : ''}`;
      if (every) {
        for (const intervalTime of times) {
          acc[intervalTime].push(message);
        }
      } else {
        acc[formattedTime].push(message);
      }
    }

    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
    .map(([time, items]) => ({
      time,
      items,
    }));
};

const createWrapper = <T>(): Wrapper<T> => ({
  data: [],
  loading: false,
  error: false,
  created: false,
  updated: false,
});

export const initialAdminHospitalManagementState: AdminHospitalManagementState =
  {
    foods: createWrapper<Food>(),
    tags: createWrapper<Tag>(),
    dispositionReasons: createWrapper<DispositionReason>(),
    releaseTypes: createWrapper<ReleaseType>(),
    transferLocations: createWrapper<TransferLocation>(),
    medications: createWrapper<Medication>(),
    areas: createWrapper<Area>(),
    species: createWrapper<Species>(),
    boards: createWrapper<PatientBoard>(),
    boardMessages: createWrapper<PatientBoardMessage>(),
    boardCustomPens: createWrapper<PatientBoardCustomPen>(),
  };
