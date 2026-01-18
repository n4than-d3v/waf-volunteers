import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  AdministrationMethod,
  Area,
  Diet,
  DispositionReason,
  Medication,
  ReleaseType,
  Species,
  Tag,
  TransferLocation,
} from './state';
import {
  changeAreaStatus,
  changeAreaStatusError,
  changeAreaStatusSuccess,
  changePenStatus,
  changePenStatusError,
  changePenStatusSuccess,
  createArea,
  createAreaError,
  createAreaSuccess,
  createDiet,
  createDietError,
  createDietSuccess,
  createDispositionReason,
  createDispositionReasonError,
  createDispositionReasonSuccess,
  upsertMedication,
  upsertMedicationConcentration,
  upsertMedicationConcentrationError,
  upsertMedicationConcentrationSpeciesDose,
  upsertMedicationConcentrationSpeciesDoseError,
  upsertMedicationConcentrationSpeciesDoseSuccess,
  upsertMedicationConcentrationSuccess,
  upsertMedicationError,
  upsertMedicationSuccess,
  createPen,
  createPenError,
  createPenSuccess,
  createReleaseType,
  createReleaseTypeError,
  createReleaseTypeSuccess,
  createSpecies,
  createSpeciesError,
  createSpeciesSuccess,
  createSpeciesVariant,
  createSpeciesVariantError,
  createSpeciesVariantSuccess,
  createTag,
  createTagError,
  createTagSuccess,
  createTransferLocation,
  createTransferLocationError,
  createTransferLocationSuccess,
  getAreas,
  getAreasError,
  getAreasSuccess,
  getDiets,
  getDietsError,
  getDietsSuccess,
  getDispositionReasons,
  getDispositionReasonsError,
  getDispositionReasonsSuccess,
  getMedications,
  getMedicationsError,
  getMedicationsSuccess,
  getReleaseTypes,
  getReleaseTypesError,
  getReleaseTypesSuccess,
  getSpecies,
  getSpeciesError,
  getSpeciesSuccess,
  getTags,
  getTagsError,
  getTagsSuccess,
  getTransferLocations,
  getTransferLocationsError,
  getTransferLocationsSuccess,
  movePen,
  movePenError,
  movePenSuccess,
  updateDiet,
  updateDietError,
  updateDietSuccess,
  updateDispositionReason,
  updateDispositionReasonError,
  updateDispositionReasonSuccess,
  updateReleaseType,
  updateReleaseTypeError,
  updateReleaseTypeSuccess,
  updateSpecies,
  updateSpeciesError,
  updateSpeciesSuccess,
  updateSpeciesVariant,
  updateSpeciesVariantError,
  updateSpeciesVariantSuccess,
  updateTag,
  updateTagError,
  updateTagSuccess,
  updateTransferLocation,
  updateTransferLocationError,
  updateTransferLocationSuccess,
} from './actions';

@Injectable()
export class AdminHospitalManagementEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  // Diets

  getDiets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDiets),
      switchMap(() =>
        this.http.get<Diet[]>('hospital/husbandry/diets').pipe(
          map((diets) => getDietsSuccess({ diets })),
          catchError(() => of(getDietsError()))
        )
      )
    )
  );

  createDiet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createDiet),
      switchMap((action) =>
        this.http.put('hospital/husbandry/diet', action.diet).pipe(
          map((_) => createDietSuccess()),
          catchError(() => of(createDietError()))
        )
      )
    )
  );

  createDietSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createDietSuccess),
      switchMap((_) => of(getDiets()))
    )
  );

  updateDiet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateDiet),
      switchMap((action) =>
        this.http.put('hospital/husbandry/diet', action.diet).pipe(
          map((_) => updateDietSuccess()),
          catchError(() => of(updateDietError()))
        )
      )
    )
  );

  updateDietSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateDietSuccess),
      switchMap((_) => of(getDiets()))
    )
  );

  // Tags

  getTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTags),
      switchMap(() =>
        this.http.get<Tag[]>('hospital/husbandry/tags').pipe(
          map((tags) => getTagsSuccess({ tags })),
          catchError(() => of(getTagsError()))
        )
      )
    )
  );

  createTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTag),
      switchMap((action) =>
        this.http.put('hospital/husbandry/tag', action.tag).pipe(
          map((_) => createTagSuccess()),
          catchError(() => of(createTagError()))
        )
      )
    )
  );

  createTagSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTagSuccess),
      switchMap((_) => of(getTags()))
    )
  );

  updateTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTag),
      switchMap((action) =>
        this.http.put('hospital/husbandry/tag', action.tag).pipe(
          map((_) => updateTagSuccess()),
          catchError(() => of(updateTagError()))
        )
      )
    )
  );

  updateTagSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTagSuccess),
      switchMap((_) => of(getTags()))
    )
  );

  // Disposition reasons

  getDispositionReasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDispositionReasons),
      switchMap(() =>
        this.http
          .get<DispositionReason[]>(
            'hospital/options/outcome/disposition-reasons'
          )
          .pipe(
            map((dispositionReasons) =>
              getDispositionReasonsSuccess({ dispositionReasons })
            ),
            catchError(() => of(getDispositionReasonsError()))
          )
      )
    )
  );

  createDispositionReason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createDispositionReason),
      switchMap((action) =>
        this.http
          .put(
            'hospital/options/outcome/disposition-reason',
            action.dispositionReason
          )
          .pipe(
            map((_) => createDispositionReasonSuccess()),
            catchError(() => of(createDispositionReasonError()))
          )
      )
    )
  );

  createDispositionReasonSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createDispositionReasonSuccess),
      switchMap((_) => of(getDispositionReasons()))
    )
  );

  updateDispositionReason$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateDispositionReason),
      switchMap((action) =>
        this.http
          .put(
            'hospital/options/outcome/disposition-reason',
            action.dispositionReason
          )
          .pipe(
            map((_) => updateDispositionReasonSuccess()),
            catchError(() => of(updateDispositionReasonError()))
          )
      )
    )
  );

  updateDispositionReasonSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateDispositionReasonSuccess),
      switchMap((_) => of(getDispositionReasons()))
    )
  );

  // Release types

  getReleaseTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getReleaseTypes),
      switchMap(() =>
        this.http
          .get<ReleaseType[]>('hospital/options/outcome/release-types')
          .pipe(
            map((releaseTypes) => getReleaseTypesSuccess({ releaseTypes })),
            catchError(() => of(getReleaseTypesError()))
          )
      )
    )
  );

  createReleaseType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReleaseType),
      switchMap((action) =>
        this.http
          .put('hospital/options/outcome/release-type', action.releaseType)
          .pipe(
            map((_) => createReleaseTypeSuccess()),
            catchError(() => of(createReleaseTypeError()))
          )
      )
    )
  );

  createReleaseTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createReleaseTypeSuccess),
      switchMap((_) => of(getReleaseTypes()))
    )
  );

  updateReleaseType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateReleaseType),
      switchMap((action) =>
        this.http
          .put('hospital/options/outcome/release-type', action.releaseType)
          .pipe(
            map((_) => updateReleaseTypeSuccess()),
            catchError(() => of(updateReleaseTypeError()))
          )
      )
    )
  );

  updateReleaseTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateReleaseTypeSuccess),
      switchMap((_) => of(getReleaseTypes()))
    )
  );

  // Transfer locations

  getTransferLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTransferLocations),
      switchMap(() =>
        this.http
          .get<TransferLocation[]>(
            'hospital/options/outcome/transfer-locations'
          )
          .pipe(
            map((transferLocations) =>
              getTransferLocationsSuccess({ transferLocations })
            ),
            catchError(() => of(getTransferLocationsError()))
          )
      )
    )
  );

  createTransferLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTransferLocation),
      switchMap((action) =>
        this.http
          .put(
            'hospital/options/outcome/transfer-location',
            action.transferLocation
          )
          .pipe(
            map((_) => createTransferLocationSuccess()),
            catchError(() => of(createTransferLocationError()))
          )
      )
    )
  );

  createTransferLocationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTransferLocationSuccess),
      switchMap((_) => of(getTransferLocations()))
    )
  );

  updateTransferLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTransferLocation),
      switchMap((action) =>
        this.http
          .put(
            'hospital/options/outcome/transfer-location',
            action.transferLocation
          )
          .pipe(
            map((_) => updateTransferLocationSuccess()),
            catchError(() => of(updateTransferLocationError()))
          )
      )
    )
  );

  updateTransferLocationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTransferLocationSuccess),
      switchMap((_) => of(getTransferLocations()))
    )
  );

  // Medications

  getMedications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMedications),
      switchMap(() =>
        this.http.get<Medication[]>('hospital/medications').pipe(
          map((medications) => getMedicationsSuccess({ medications })),
          catchError(() => of(getMedicationsError()))
        )
      )
    )
  );

  upsertMedication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertMedication),
      switchMap((action) =>
        this.http.post(`hospital/medications`, action).pipe(
          map((_) => upsertMedicationSuccess()),
          catchError(() => of(upsertMedicationError()))
        )
      )
    )
  );

  upsertMedicationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertMedicationSuccess),
      switchMap((_) => of(getMedications()))
    )
  );

  upsertMedicationConcentration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertMedicationConcentration),
      switchMap((action) =>
        this.http.post(`hospital/medications/concentration`, action).pipe(
          map((_) => upsertMedicationConcentrationSuccess()),
          catchError(() => of(upsertMedicationConcentrationError()))
        )
      )
    )
  );

  upsertMedicationConcentrationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertMedicationConcentrationSuccess),
      switchMap((_) => of(getMedications()))
    )
  );

  upsertMedicationConcentrationSpeciesDose$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertMedicationConcentrationSpeciesDose),
      switchMap((action) =>
        this.http.post(`hospital/medications/species-dose`, action).pipe(
          map((_) => upsertMedicationConcentrationSpeciesDoseSuccess()),
          catchError(() => of(upsertMedicationConcentrationSpeciesDoseError()))
        )
      )
    )
  );

  upsertMedicationConcentrationSpeciesDoseSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertMedicationConcentrationSpeciesDoseSuccess),
      switchMap((_) => of(getMedications()))
    )
  );

  // Areas

  getAreas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAreas),
      switchMap(() =>
        this.http.get<Area[]>('hospital/locations').pipe(
          map((areas) => getAreasSuccess({ areas })),
          catchError(() => of(getAreasError()))
        )
      )
    )
  );

  createArea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createArea),
      switchMap((action) =>
        this.http.post('hospital/locations/area', action.area).pipe(
          map((_) => createAreaSuccess()),
          catchError(() => of(createAreaError()))
        )
      )
    )
  );

  createAreaSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createAreaSuccess),
      switchMap((_) => of(getAreas()))
    )
  );

  createPen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createPen),
      switchMap((action) =>
        this.http.post('hospital/locations/pen', action.pen).pipe(
          map((_) => createPenSuccess()),
          catchError(() => of(createPenError()))
        )
      )
    )
  );

  createPenSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createPenSuccess),
      switchMap((_) => of(getAreas()))
    )
  );

  movePen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(movePen),
      switchMap((action) =>
        this.http
          .put(
            `hospital/locations/pen/${action.penId}/area/${action.areaId}`,
            {}
          )
          .pipe(
            map((_) => movePenSuccess()),
            catchError(() => of(movePenError()))
          )
      )
    )
  );

  movePenSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(movePenSuccess),
      switchMap((_) => of(getAreas()))
    )
  );

  changePenStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changePenStatus),
      switchMap((action) =>
        this.http.put(`hospital/locations/pen/${action.penId}`, action).pipe(
          map((_) => changePenStatusSuccess()),
          catchError(() => of(changePenStatusError()))
        )
      )
    )
  );

  changePenStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changePenStatusSuccess),
      switchMap((_) => of(getAreas()))
    )
  );

  changeAreaStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeAreaStatus),
      switchMap((action) =>
        this.http.put(`hospital/locations/area/${action.areaId}`, action).pipe(
          map((_) => changeAreaStatusSuccess()),
          catchError(() => of(changeAreaStatusError()))
        )
      )
    )
  );

  changeAreaStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeAreaStatusSuccess),
      switchMap((_) => of(getAreas()))
    )
  );

  // Species

  getSpecies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSpecies),
      switchMap(() =>
        this.http.get<Species[]>('hospital/species').pipe(
          map((species) =>
            getSpeciesSuccess({
              species: species.map((s) => ({
                ...s,
                variants: s.variants.sort((a, b) => a.order - b.order),
              })),
            })
          ),
          catchError(() => of(getSpeciesError()))
        )
      )
    )
  );

  createSpecies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSpecies),
      switchMap((action) =>
        this.http.put('hospital/species', action.species).pipe(
          map((_) => createSpeciesSuccess()),
          catchError(() => of(createSpeciesError()))
        )
      )
    )
  );

  createSpeciesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSpeciesSuccess),
      switchMap((_) => of(getSpecies()))
    )
  );

  updateSpecies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSpecies),
      switchMap((action) =>
        this.http.put('hospital/species', action.species).pipe(
          map((_) => updateSpeciesSuccess()),
          catchError(() => of(updateSpeciesError()))
        )
      )
    )
  );

  updateSpeciesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSpeciesSuccess),
      switchMap((_) => of(getSpecies()))
    )
  );

  createSpeciesVariant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSpeciesVariant),
      switchMap((action) =>
        this.http.put('hospital/species/variant', action.variant).pipe(
          map((_) => createSpeciesVariantSuccess()),
          catchError(() => of(createSpeciesVariantError()))
        )
      )
    )
  );

  createSpeciesVariantSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSpeciesVariantSuccess),
      switchMap((_) => of(getSpecies()))
    )
  );

  updateSpeciesVariant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSpeciesVariant),
      switchMap((action) =>
        this.http.put('hospital/species/variant', action.variant).pipe(
          map((_) => updateSpeciesVariantSuccess()),
          catchError(() => of(updateSpeciesVariantError()))
        )
      )
    )
  );

  updateSpeciesVariantSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSpeciesVariantSuccess),
      switchMap((_) => of(getSpecies()))
    )
  );
}
