import { PatientBoardAreaDisplayType } from '../../admin/hospital/state';
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
  areas: PatientBoardAreaVm[];
  summary: PatientBoardSummaryVm[];

  anyOtherBoards: boolean;
  isMorning: boolean;
  isAfternoon: boolean;
  isEvening: boolean;
}

export interface PatientBoardSummaryVm {
  species: string;
  quantity: number;
  variants: PatientBoardSummaryVariantVm[];
}

export interface PatientBoardSummaryVariantVm {
  name: string;
  quantity: number;
  locations: string[];
  feeding: PatientBoardSummaryFeedingVm[];
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
  displayType: PatientBoardAreaDisplayType;
  area: { id: number; area: { name: string } };
  summary: string[];
  pens: PatientBoardAreaPenVm[] | null;
}

export interface PatientBoardAreaPenVm {
  id: number;
  reference: string;
  patients: string[] | null;
  patientReferences: string[] | null;
  tags: string[] | null;

  hasCustomDiet: boolean;

  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  clean: boolean;
  tasks: number[];

  feedings: PatientBoardAreaPenFeedingVm[];
  feedingSummaries: PatientBoardAreaPenFeedingSummaryVm[];

  needsCleaning: boolean;

  shouldShow: boolean;
  isExpandable: boolean;
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
