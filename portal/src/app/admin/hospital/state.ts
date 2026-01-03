export interface AdminHospitalManagementState {
  diets: Wrapper<Diet>;
  tags: Wrapper<Tag>;
  dispositionReasons: Wrapper<DispositionReason>;
  releaseTypes: Wrapper<ReleaseType>;
  transferLocations: Wrapper<TransferLocation>;
  administrationMethods: Wrapper<AdministrationMethod>;
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

export interface CreateAdministrationMethodCommand {
  description: string;
}

export interface AdministrationMethod
  extends CreateAdministrationMethodCommand {
  id: number;
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
  pens: { code: string }[];
}

export interface CreateSpeciesCommand {
  name: string;
}

export interface CreateSpeciesAgeCommand {
  speciesId: number;
  name: string;
  associatedVariantId: number;
}

export interface CreateSpeciesVariantCommand {
  speciesId: number;
  name: string;
  feedingGuidance: string;
}

export interface UpdateSpeciesCommand extends CreateSpeciesCommand {
  id: number;
}

export interface UpdateSpeciesAgeCommand extends CreateSpeciesAgeCommand {
  id: number;
}

export interface UpdateSpeciesVariantCommand
  extends CreateSpeciesVariantCommand {
  id: number;
}

export interface Species extends CreateSpeciesCommand {
  id: number;
  ages: UpdateSpeciesAgeCommand[];
  variants: UpdateSpeciesVariantCommand[];
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
    administrationMethods: createWrapper<AdministrationMethod>(),
    medications: createWrapper<Medication>(),
    areas: createWrapper<Area>(),
    species: createWrapper<Species>(),
  };
