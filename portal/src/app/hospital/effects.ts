import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  ListPatient,
  Patient,
  PatientCounts,
  Attitude,
  BodyCondition,
  Dehydration,
  MucousMembraneColour,
  MucousMembraneTexture,
  Diet,
  Tag,
  DispositionReason,
  ReleaseType,
  TransferLocation,
  AdministrationMethod,
  Medication,
  Area,
  Species,
} from './state';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import {
  getPatient,
  getPatientCounts,
  getPatientCountsError,
  getPatientCountsSuccess,
  getPatientError,
  getPatientsByStatus,
  getPatientsByStatusError,
  getPatientsByStatusSuccess,
  getPatientSuccess,
  getAttitudes,
  getAttitudesSuccess,
  getAttitudesError,
  getBodyConditions,
  getBodyConditionsSuccess,
  getBodyConditionsError,
  getDehydrations,
  getDehydrationsSuccess,
  getDehydrationsError,
  getMucousMembraneColours,
  getMucousMembraneColoursSuccess,
  getMucousMembraneColoursError,
  getMucousMembraneTextures,
  getMucousMembraneTexturesSuccess,
  getMucousMembraneTexturesError,
  getAdministrationMethods,
  getAdministrationMethodsError,
  getAdministrationMethodsSuccess,
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
  performExam,
  performExamSuccess,
  performExamError,
  markPatientDead,
  markPatientReadyForRelease,
  markPatientDeadSuccess,
  markPatientDeadError,
  markPatientReadyForReleaseSuccess,
  markPatientReadyForReleaseError,
  movePatient,
  movePatientSuccess,
  movePatientError,
  addNote,
  addNoteSuccess,
  addNoteError,
  addRecheck,
  addRecheckSuccess,
  addRecheckError,
  addPrescriptionInstruction,
  addPrescriptionInstructionSuccess,
  addPrescriptionInstructionError,
  addPrescriptionMedication,
  addPrescriptionMedicationSuccess,
  addPrescriptionMedicationError,
  removeRecheck,
  removeRecheckSuccess,
  removeRecheckError,
  removePrescriptionInstruction,
  removePrescriptionInstructionSuccess,
  removePrescriptionInstructionError,
  removePrescriptionMedication,
  removePrescriptionMedicationSuccess,
  removePrescriptionMedicationError,
  updatePatientBasicDetails,
  updatePatientBasicDetailsSuccess,
  updatePatientBasicDetailsError,
  markPatientReleased,
  markPatientReleasedSuccess,
  markPatientReleasedError,
  markPatientTransferred,
  markPatientTransferredSuccess,
  markPatientTransferredError,
} from './actions';

@Injectable()
export class HospitalEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  // Patient counts

  getPatientCounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPatientCounts),
      switchMap(() =>
        this.http.get<PatientCounts>('hospital/patients/status').pipe(
          map((patientCounts) => getPatientCountsSuccess({ patientCounts })),
          catchError(() => of(getPatientCountsError()))
        )
      )
    )
  );

  // Patients by status

  getPatientsByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPatientsByStatus),
      switchMap((action) =>
        this.http
          .get<ListPatient[]>('hospital/patients/status/' + action.status)
          .pipe(
            map((patients) => getPatientsByStatusSuccess({ patients })),
            catchError(() => of(getPatientsByStatusError()))
          )
      )
    )
  );

  // Patient

  getPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPatient),
      switchMap((action) =>
        this.http.get<Patient>('hospital/patients/' + action.id).pipe(
          map((patient) => getPatientSuccess({ patient })),
          catchError(() => of(getPatientError()))
        )
      )
    )
  );

  // Attitudes

  getAttitudes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAttitudes),
      switchMap((action) =>
        this.http.get<Attitude[]>('hospital/options/exams/attitudes').pipe(
          map((attitudes) => getAttitudesSuccess({ attitudes })),
          catchError(() => of(getAttitudesError()))
        )
      )
    )
  );

  // BodyConditions

  getBodyConditions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBodyConditions),
      switchMap((action) =>
        this.http
          .get<BodyCondition[]>('hospital/options/exams/body-conditions')
          .pipe(
            map((bodyConditions) =>
              getBodyConditionsSuccess({ bodyConditions })
            ),
            catchError(() => of(getBodyConditionsError()))
          )
      )
    )
  );

  // Dehydrations

  getDehydrations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDehydrations),
      switchMap((action) =>
        this.http
          .get<Dehydration[]>('hospital/options/exams/dehydrations')
          .pipe(
            map((dehydrations) => getDehydrationsSuccess({ dehydrations })),
            catchError(() => of(getDehydrationsError()))
          )
      )
    )
  );

  // MucousMembraneColours

  getMucousMembraneColours$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMucousMembraneColours),
      switchMap((action) =>
        this.http
          .get<MucousMembraneColour[]>(
            'hospital/options/exams/mucous-membrane-colours'
          )
          .pipe(
            map((mucousMembraneColours) =>
              getMucousMembraneColoursSuccess({ mucousMembraneColours })
            ),
            catchError(() => of(getMucousMembraneColoursError()))
          )
      )
    )
  );

  // MucousMembraneTextures

  getMucousMembraneTextures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMucousMembraneTextures),
      switchMap((action) =>
        this.http
          .get<MucousMembraneTexture[]>(
            'hospital/options/exams/mucous-membrane-textures'
          )
          .pipe(
            map((mucousMembraneTextures) =>
              getMucousMembraneTexturesSuccess({ mucousMembraneTextures })
            ),
            catchError(() => of(getMucousMembraneTexturesError()))
          )
      )
    )
  );

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

  // Administration methods

  getAdministrationMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAdministrationMethods),
      switchMap(() =>
        this.http
          .get<AdministrationMethod[]>(
            'hospital/medications/administration-methods'
          )
          .pipe(
            map((administrationMethods) =>
              getAdministrationMethodsSuccess({ administrationMethods })
            ),
            catchError(() => of(getAdministrationMethodsError()))
          )
      )
    )
  );

  // Medications

  getMedications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMedications),
      switchMap((action) =>
        this.http
          .get<Medication[]>('hospital/medications?search=' + action.search)
          .pipe(
            map((medications) => getMedicationsSuccess({ medications })),
            catchError(() => of(getMedicationsError()))
          )
      )
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

  // Species

  getSpecies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSpecies),
      switchMap(() =>
        this.http.get<Species[]>('hospital/species').pipe(
          map((species) => getSpeciesSuccess({ species })),
          catchError(() => of(getSpeciesError()))
        )
      )
    )
  );

  // Perform exam

  performExam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(performExam),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.exam.patientId}/exam`, action.exam)
          .pipe(
            mergeMap(() => {
              const actions: any[] = [performExamSuccess()];

              if (
                action.outcome === 'deadOnArrival' ||
                action.outcome === 'pts'
              ) {
                actions.push(
                  markPatientDead({
                    patientId: action.exam.patientId,
                    dispositionReasonId: action.dispositionReasonId!,
                    onArrival: action.outcome === 'deadOnArrival',
                    putToSleep: action.outcome === 'pts',
                  })
                );
              } else if (action.outcome === 'release') {
                actions.push(
                  markPatientReadyForRelease({
                    patientId: action.exam.patientId,
                  })
                );
              } else if (action.outcome === 'alive') {
                actions.push(
                  movePatient({
                    patientId: action.exam.patientId,
                    penId: action.penId!,
                  })
                );
              }

              return actions;
            }),
            catchError(() => of(performExamError()))
          )
      )
    )
  );

  // Set disposition

  markPatientDead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientDead),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/die`, action)
          .pipe(
            map(() => markPatientDeadSuccess({ patientId: action.patientId })),
            catchError(() => of(markPatientDeadError()))
          )
      )
    )
  );

  markPatientDeadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientDeadSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  markPatientReadyForRelease$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientReadyForRelease),
      switchMap((action) =>
        this.http
          .post(
            `hospital/patients/${action.patientId}/ready-for-release`,
            action
          )
          .pipe(
            map(() =>
              markPatientReadyForReleaseSuccess({ patientId: action.patientId })
            ),
            catchError(() => of(markPatientReadyForReleaseError()))
          )
      )
    )
  );

  markPatientReadyForReleaseSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientReadyForReleaseSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  markPatientReleased$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientReleased),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/release`, action)
          .pipe(
            map(() =>
              markPatientReleasedSuccess({ patientId: action.patientId })
            ),
            catchError(() => of(markPatientReleasedError()))
          )
      )
    )
  );

  markPatientReleasedSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientReleasedSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  markPatientTransferred$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientTransferred),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/transfer`, action)
          .pipe(
            map(() =>
              markPatientTransferredSuccess({ patientId: action.patientId })
            ),
            catchError(() => of(markPatientTransferredError()))
          )
      )
    )
  );

  markPatientTransferredSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientTransferredSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  // Move patient

  movePatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(movePatient),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/move`, action)
          .pipe(
            map(() => movePatientSuccess({ patientId: action.patientId })),
            catchError(() => of(movePatientError()))
          )
      )
    )
  );

  movePatientSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(movePatientSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  // Add note

  addNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNote),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/note`, action)
          .pipe(
            map(() => addNoteSuccess({ patientId: action.patientId })),
            catchError(() => of(addNoteError()))
          )
      )
    )
  );

  addNoteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNoteSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  // Add recheck

  addRecheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addRecheck),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/recheck`, action)
          .pipe(
            map(() => addRecheckSuccess({ patientId: action.patientId })),
            catchError(() => of(addRecheckError()))
          )
      )
    )
  );

  addRecheckSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addRecheckSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  // Add prescription instruction

  addPrescriptionInstruction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPrescriptionInstruction),
      switchMap((action) =>
        this.http
          .post(
            `hospital/patients/${action.patientId}/prescriptions/instruction`,
            action
          )
          .pipe(
            map(() =>
              addPrescriptionInstructionSuccess({ patientId: action.patientId })
            ),
            catchError(() => of(addPrescriptionInstructionError()))
          )
      )
    )
  );

  addPrescriptionInstructionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPrescriptionInstructionSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  // Add prescription medication

  addPrescriptionMedication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPrescriptionMedication),
      switchMap((action) =>
        this.http
          .post(
            `hospital/patients/${action.patientId}/prescriptions/medication`,
            action
          )
          .pipe(
            map(() =>
              addPrescriptionMedicationSuccess({ patientId: action.patientId })
            ),
            catchError(() => of(addPrescriptionMedicationError()))
          )
      )
    )
  );

  addPrescriptionMedicationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPrescriptionMedicationSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  // Remove recheck

  removeRecheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeRecheck),
      switchMap((action) =>
        this.http
          .delete(`hospital/patients/recheck/${action.patientRecheckId}`)
          .pipe(
            map(() => removeRecheckSuccess({ patientId: action.patientId })),
            catchError(() => of(removeRecheckError()))
          )
      )
    )
  );

  removeRecheckSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeRecheckSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  // Remove prescription instruction

  removePrescriptionInstruction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePrescriptionInstruction),
      switchMap((action) =>
        this.http
          .delete(
            `hospital/patients/prescriptions/instruction/${action.patientPrescriptionInstructionId}`
          )
          .pipe(
            map(() =>
              removePrescriptionInstructionSuccess({
                patientId: action.patientId,
              })
            ),
            catchError(() => of(removePrescriptionInstructionError()))
          )
      )
    )
  );

  removePrescriptionInstructionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePrescriptionInstructionSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  // Remove prescription medication

  removePrescriptionMedication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePrescriptionMedication),
      switchMap((action) =>
        this.http
          .delete(
            `hospital/patients/prescriptions/medication/${action.patientPrescriptionMedicationId}`
          )
          .pipe(
            map(() =>
              removePrescriptionMedicationSuccess({
                patientId: action.patientId,
              })
            ),
            catchError(() => of(removePrescriptionMedicationError()))
          )
      )
    )
  );

  removePrescriptionMedicationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePrescriptionMedicationSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );

  // Update patient basic details

  updatePatientBasicDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePatientBasicDetails),
      switchMap((action) =>
        this.http
          .put(`hospital/patients/${action.patientId}/basic-details`, action)
          .pipe(
            map(() =>
              updatePatientBasicDetailsSuccess({ patientId: action.patientId })
            ),
            catchError(() => of(updatePatientBasicDetailsError()))
          )
      )
    )
  );

  updatePatientBasicDetailsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePatientBasicDetailsSuccess),
      switchMap((action) => of(getPatient({ id: action.patientId })))
    )
  );
}
