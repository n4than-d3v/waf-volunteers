import { Medication, MedicationConcentration } from '../state';

export interface HospitalStockState {
  page: Page;
  stock: Stock[];
  items: Item[];
  loading: boolean;
  error: boolean;
}

export interface Page {
  pageType: PageType;
  item?: Stock;
  batch?: StockBatch;
  usage?: StockBatchUsage;
}

export type PageType =
  | 'dashboard'
  | 'viewBatches'
  | 'delivery'
  | 'use'
  | 'disposeBatch'
  | 'disposeUsage';

export function getMeasurement(value: string | number | null | undefined) {
  if (!value) return '';
  switch (Number(value)) {
    case 1:
      return 'ml';
    case 2:
      return 'tablet(s)';
    case 3:
      return 'box(es)';
    case 4:
      return 'ampoule(s)';
    default:
      return 'unknown';
  }
}

export enum Measurement {
  Ml = 1,
  Tablets = 2,
  Boxes = 3,
  Ampoules = 4,
}

export interface Stock {
  id: number;
  medication: string;
  medicationConcentration: string;
  brand: string;
  measurement: number;
  afterOpeningLifetimeDays: number;
  reorderQuantity: number;
  needsReordering: boolean;
  quantityInStock: number;
  quantityInUse: number;
  expired: boolean;
  expiredAfterOpening: boolean;
  batches: StockBatch[];
}

export interface StockBatch {
  id: number;
  date: string;
  number: string;
  expiry: string;
  deliveredQuantity: number;
  initials: string;
  quantityInStock: number;
  quantityInUse: number;
  quantityDisposed: number;
  expired: boolean;
  expiredAfterOpening: boolean;
  usages: StockBatchUsage[];
}

export interface StockBatchUsage {
  id: number;
  date: string;
  expiry: string;
  quantity: number;
  signedOutBy: string;
  disposed: string | null;
  disposedBy: string | null;
  expired: boolean;
}

export interface Item {
  id: number;
  medication: Medication;
  medicationConcentration: MedicationConcentration;
  brand: string;
  measurement: Measurement;
  afterOpeningLifetimeDays: number;
  reorderQuantity: number;
}

export const initialHospitalStockState: HospitalStockState = {
  page: { pageType: 'dashboard' },
  stock: [],
  items: [],
  loading: false,
  error: false,
};
