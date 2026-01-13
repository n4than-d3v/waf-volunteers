export interface AdminHospitalManagementState {
  diets: Wrapper<Diet>;
  tags: Wrapper<Tag>;
  dispositionReasons: Wrapper<DispositionReason>;
  releaseTypes: Wrapper<ReleaseType>;
  transferLocations: Wrapper<TransferLocation>;
  medications: Wrapper<Medication>;
  areas: Wrapper<Area>;
  species: Wrapper<Species>;
}

export interface Wrapper<T> {
  data: T[];
  loading: boolean;
  error: boolean;
  created: boolean;
  updated: boolean;
}

export interface CreateDietCommand {
  name: string;
  description: string;
}

export interface Diet extends CreateDietCommand {
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
}

export interface CreateSpeciesVariantCommand {
  speciesId: number;
  name: string;
  friendlyName: string;
  order: number;
  feedingGuidance: string;
}

export interface UpdateSpeciesCommand extends CreateSpeciesCommand {
  id: number;
}

export interface UpdateSpeciesVariantCommand
  extends CreateSpeciesVariantCommand {
  id: number;
}

export interface SpeciesVariant {
  id: number;
  name: string;
  friendlyName: string;
  feedingGuidance: string;
  order: number;
}

export interface Species extends UpdateSpeciesCommand {
  variants: SpeciesVariant[];
}

export function getSpeciesType(type: SpeciesType) {
  switch (type) {
    case SpeciesType.Amphibian:
      return 'Amphibian';
    case SpeciesType.Bird:
      return 'Bird';
    case SpeciesType.Mammal:
      return 'Mammal';
    case SpeciesType.Reptile:
      return 'Reptile';
    default:
      return 'Unknown';
  }
}

const createWrapper = <T>(): Wrapper<T> => ({
  data: [],
  loading: false,
  error: false,
  created: false,
  updated: false,
});

export const initialAdminHospitalManagementState: AdminHospitalManagementState =
  {
    diets: createWrapper<Diet>(),
    tags: createWrapper<Tag>(),
    dispositionReasons: createWrapper<DispositionReason>(),
    releaseTypes: createWrapper<ReleaseType>(),
    transferLocations: createWrapper<TransferLocation>(),
    medications: createWrapper<Medication>(),
    areas: createWrapper<Area>(),
    species: createWrapper<Species>(),
  };
