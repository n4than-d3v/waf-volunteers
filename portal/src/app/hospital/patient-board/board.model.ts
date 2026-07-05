import { PatientBoardAreaDisplayType } from '../../admin/hospital/state';
import { PenCleanStatus } from '../state';
import { FoodSection } from './food-section';

export type Shift = 'M' | 'A' | 'E';

export interface PatientBoardVm {
  board: {
    name: string;
    forBirds: boolean;
    messages: {
      id: number;
      message: string;
      emergency: boolean;
    }[];
  };

  pens: PatientBoardAreaPenVm[];
  areaSummaries: PatientBoardAreaVm[];

  summary: PatientBoardSummaryVm[];
  summedUp:
    | {
        quantityValue: number;
        quantityUnit: string;
        food: string;
      }[]
    | null;

  anyOtherBoards: boolean;
  isMorning: boolean;
  isAfternoon: boolean;
  isEvening: boolean;
}

export interface PatientBoardSummaryVm {
  species: string;
  quantity: number;
  variants: PatientBoardSummaryVariantVm[];
  shouldShow: boolean;
}

export interface PatientBoardSummaryVariantVm {
  name: string;
  quantity: number;
  locations: PatientBoardSummaryLocationVm[];
  feeding: PatientBoardSummaryFeedingVm[];
  shouldShow: boolean;
}

export interface PatientBoardSummaryLocationVm {
  reference: string;
  patients: number;
  completed: boolean;
  shouldShow: boolean;
}

export interface PatientBoardSummaryFeedingVm {
  time: string;
  items: PatientBoardSummaryFeedingItemVm[];

  shouldShow: boolean;
}

export interface PatientBoardSummaryFeedingItemVm {
  quantityValue: number;
  quantityUnit: string;
  food: string;

  quantityValueFormatted: string;
}

export interface PatientBoardAreaVm {
  area: { id: number; area: { name: string } };
  summary: string[];
}

export interface PatientBoardAreaPenVm {
  id: number;
  reference: string;
  patients: string[] | null;
  patientReferences: string[] | null;
  patientNames: string[] | null;
  tags: string[] | null;

  flagged: boolean;
  concernReason: string | null;

  hasCustomDiet: boolean;
  custom: boolean;
  newest: string | null;
  plannedRelease: string | null;

  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  clean: boolean;
  completed: boolean;
  tasks: number[];

  feedings: PatientBoardAreaPenFeedingVm[];
  feedingSummaries: PatientBoardAreaPenFeedingSummaryVm[];

  cleanStatus: PenCleanStatus;
  customBoardMessage: string | null;

  shouldShow: boolean;
  isExpandable: boolean;
  prevFeeding: { isNow: boolean; time: string } | null;
  nextFeeding: { isNow: boolean; time: string } | null;
  forceFeeds: string[];
  isMorningRelevant: boolean;
  isAfternoonRelevant: boolean;
  isEveningRelevant: boolean;
}

export interface PatientBoardAreaPenFeedingSummaryVm {
  interval: string;
  food: string;
  quantityEach: number;
  quantityUnit: string;

  quantityEachFormatted: string;
}

export interface PatientBoardAreaPenFeedingVm {
  time: string;
  timeId: number;
  details: PatientBoardAreaPenTaskDetailsVm[];

  shouldShow: boolean;
  hasForceFeeds: boolean;
  hasNonForceFeeds: boolean;
  isNow: boolean;
  groups: FoodSection[];
}

export interface PatientBoardAreaPenTaskDetailsVm {
  quantityEach: number;
  quantityTotal: number;
  quantityUnit: string;
  food: string;
  forceFeed: boolean;
  topUp: string;
  notes: string;
  dish: string;

  quantityEachFormatted: string;
  quantityTotalFormatted: string;
}
