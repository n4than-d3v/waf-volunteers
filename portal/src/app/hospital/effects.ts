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
  ListRecheck,
  PrescriptionInstruction,
  PrescriptionMedication,
  DailyTasksReport,
  PatientBoard,
  ListPatientBoard,
  Dashboard,
} from './state';
import { catchError, delay, map, mergeMap, of, switchMap } from 'rxjs';
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
  requestHomeCare,
  requestHomeCareSuccess,
  requestHomeCareError,
  homeCarerDropOff,
  homeCarerDropOffSuccess,
  homeCarerDropOffError,
  sendHomeCareMessage,
  sendHomeCareMessageSuccess,
  sendHomeCareMessageError,
  searchPatient,
  searchPatientSuccess,
  searchPatientError,
  setTab,
  performRecheck,
  performRecheckSuccess,
  performRecheckError,
  administerPrescriptionInstruction,
  administerPrescriptionSuccess,
  administerPrescriptionError,
  administerPrescriptionMedication,
  markPatientInCentre,
  markPatientInCentreError,
  markPatientInCentreSuccess,
  downloadNoteAttachment,
  addBloodTest,
  addBloodTestSuccess,
  addBloodTestError,
  downloadBloodTestAttachment,
  addFaecalTest,
  addFaecalTestSuccess,
  addFaecalTestError,
  viewDailyTasks,
  viewDailyTasksSuccess,
  viewDailyTasksError,
  viewPatientBoard,
  viewPatientBoardSuccess,
  viewPatientBoardError,
  viewPatientBoards,
  viewPatientBoardsSuccess,
  viewPatientBoardsError,
  updateNote,
  updateNoteSuccess,
  updateNoteError,
  removeNote,
  removeNoteSuccess,
  removeNoteError,
  updateFaecalTest,
  updateFaecalTestSuccess,
  updateFaecalTestError,
  removeFaecalTest,
  removeFaecalTestSuccess,
  removeFaecalTestError,
  updateBloodTest,
  updateBloodTestSuccess,
  updateBloodTestError,
  removeBloodTest,
  removeBloodTestSuccess,
  removeBloodTestError,
  updateRecheck,
  updateRecheckSuccess,
  updateRecheckError,
  updatePrescriptionInstruction,
  updatePrescriptionInstructionSuccess,
  updatePrescriptionInstructionError,
  updatePrescriptionMedication,
  updatePrescriptionMedicationSuccess,
  updatePrescriptionMedicationError,
  delayedSetTab,
  undoAdministerPrescriptionInstruction,
  undoAdministerPrescriptionSuccess,
  undoAdministerPrescriptionError,
  undoAdministerPrescriptionMedication,
  getDashboard,
  getDashboardSuccess,
  getDashboardError,
} from './actions';

@Injectable()
export class HospitalEffects {
  actions$ = inject(Actions);
  http = inject(HttpClient);

  // Set tab

  setTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setTab),
      delay(100),
      map((action) => delayedSetTab({ tab: action.tab })),
    ),
  );

  // Dashboard

  getDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDashboard),
      switchMap(() =>
        this.http.get<Dashboard>('hospital/dashboard').pipe(
          map((dashboard) => getDashboardSuccess({ dashboard })),
          catchError(() => of(getDashboardError())),
        ),
      ),
    ),
  );

  // Patient counts

  getPatientCounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPatientCounts),
      switchMap(() =>
        this.http.get<PatientCounts>('hospital/patients/status').pipe(
          map((patientCounts) => getPatientCountsSuccess({ patientCounts })),
          catchError(() => of(getPatientCountsError())),
        ),
      ),
    ),
  );

  // Patients by status

  getPatientsByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPatientsByStatus),
      switchMap((action) =>
        this.http
          .get<
            ListPatient[]
          >(`hospital/patients/status/${action.status}?search=${action.search}&page=${action.page}&pageSize=${action.pageSize}`)
          .pipe(
            map((patients) => getPatientsByStatusSuccess({ patients })),
            catchError(() => of(getPatientsByStatusError())),
          ),
      ),
    ),
  );

  // Patient

  getPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPatient),
      switchMap((action) =>
        this.http.get<Patient>('hospital/patients/' + action.id).pipe(
          map((patient) => getPatientSuccess({ patient })),
          catchError(() => of(getPatientError())),
        ),
      ),
    ),
  );

  // Attitudes

  getAttitudes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAttitudes),
      switchMap((action) =>
        this.http.get<Attitude[]>('hospital/options/exams/attitudes').pipe(
          map((attitudes) => getAttitudesSuccess({ attitudes })),
          catchError(() => of(getAttitudesError())),
        ),
      ),
    ),
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
              getBodyConditionsSuccess({ bodyConditions }),
            ),
            catchError(() => of(getBodyConditionsError())),
          ),
      ),
    ),
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
            catchError(() => of(getDehydrationsError())),
          ),
      ),
    ),
  );

  // MucousMembraneColours

  getMucousMembraneColours$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMucousMembraneColours),
      switchMap((action) =>
        this.http
          .get<
            MucousMembraneColour[]
          >('hospital/options/exams/mucous-membrane-colours')
          .pipe(
            map((mucousMembraneColours) =>
              getMucousMembraneColoursSuccess({ mucousMembraneColours }),
            ),
            catchError(() => of(getMucousMembraneColoursError())),
          ),
      ),
    ),
  );

  // MucousMembraneTextures

  getMucousMembraneTextures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMucousMembraneTextures),
      switchMap((action) =>
        this.http
          .get<
            MucousMembraneTexture[]
          >('hospital/options/exams/mucous-membrane-textures')
          .pipe(
            map((mucousMembraneTextures) =>
              getMucousMembraneTexturesSuccess({ mucousMembraneTextures }),
            ),
            catchError(() => of(getMucousMembraneTexturesError())),
          ),
      ),
    ),
  );

  // Diets

  getDiets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDiets),
      switchMap(() =>
        this.http.get<Diet[]>('hospital/husbandry/diets').pipe(
          map((diets) => getDietsSuccess({ diets })),
          catchError(() => of(getDietsError())),
        ),
      ),
    ),
  );

  // Tags

  getTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTags),
      switchMap(() =>
        this.http.get<Tag[]>('hospital/husbandry/tags').pipe(
          map((tags) => getTagsSuccess({ tags })),
          catchError(() => of(getTagsError())),
        ),
      ),
    ),
  );

  // Disposition reasons

  getDispositionReasons$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDispositionReasons),
      switchMap(() =>
        this.http
          .get<
            DispositionReason[]
          >('hospital/options/outcome/disposition-reasons')
          .pipe(
            map((dispositionReasons) =>
              getDispositionReasonsSuccess({ dispositionReasons }),
            ),
            catchError(() => of(getDispositionReasonsError())),
          ),
      ),
    ),
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
            catchError(() => of(getReleaseTypesError())),
          ),
      ),
    ),
  );

  // Transfer locations

  getTransferLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTransferLocations),
      switchMap(() =>
        this.http
          .get<
            TransferLocation[]
          >('hospital/options/outcome/transfer-locations')
          .pipe(
            map((transferLocations) =>
              getTransferLocationsSuccess({ transferLocations }),
            ),
            catchError(() => of(getTransferLocationsError())),
          ),
      ),
    ),
  );

  // Administration methods

  getAdministrationMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAdministrationMethods),
      switchMap(() =>
        this.http
          .get<
            AdministrationMethod[]
          >('hospital/medications/administration-methods')
          .pipe(
            map((administrationMethods) =>
              getAdministrationMethodsSuccess({ administrationMethods }),
            ),
            catchError(() => of(getAdministrationMethodsError())),
          ),
      ),
    ),
  );

  // Medications

  getMedications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getMedications),
      switchMap(() =>
        this.http.get<Medication[]>('hospital/medications').pipe(
          map((medications) => getMedicationsSuccess({ medications })),
          catchError(() => of(getMedicationsError())),
        ),
      ),
    ),
  );
  // Areas

  getAreas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getAreas),
      switchMap(() =>
        this.http.get<Area[]>('hospital/locations').pipe(
          map((areas) => getAreasSuccess({ areas })),
          catchError(() => of(getAreasError())),
        ),
      ),
    ),
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
            }),
          ),
          catchError(() => of(getSpeciesError())),
        ),
      ),
    ),
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
                action.outcome === 'diedOnTable' ||
                action.outcome === 'deadOnArrival' ||
                action.outcome === 'pts'
              ) {
                actions.push(
                  markPatientDead({
                    patientId: action.exam.patientId,
                    dispositionReasonId: action.dispositionReasonId!,
                    onArrival: action.outcome === 'deadOnArrival',
                    putToSleep: action.outcome === 'pts',
                  }),
                );
              } else if (action.outcome === 'release') {
                actions.push(
                  markPatientReadyForRelease({
                    patientId: action.exam.patientId,
                  }),
                );
              } else if (action.outcome === 'alive') {
                actions.push(
                  movePatient({
                    patientId: action.exam.patientId,
                    penId: action.penId!,
                    newAreaId: null,
                  }),
                );
              } else if (action.outcome === 'none') {
                actions.push(
                  getPatient({
                    id: action.exam.patientId,
                    silent: false,
                  }),
                );
              }

              return actions;
            }),
            catchError(() => of(performExamError())),
          ),
      ),
    ),
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
            catchError(() => of(markPatientDeadError())),
          ),
      ),
    ),
  );

  markPatientDeadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientDeadSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  markPatientReadyForRelease$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientReadyForRelease),
      switchMap((action) =>
        this.http
          .post(
            `hospital/patients/${action.patientId}/ready-for-release`,
            action,
          )
          .pipe(
            map(() =>
              markPatientReadyForReleaseSuccess({
                patientId: action.patientId,
              }),
            ),
            catchError(() => of(markPatientReadyForReleaseError())),
          ),
      ),
    ),
  );

  markPatientReadyForReleaseSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientReadyForReleaseSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  markPatientInCentre$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientInCentre),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/inpatient`, action)
          .pipe(
            map(() =>
              markPatientInCentreSuccess({ patientId: action.patientId }),
            ),
            catchError(() => of(markPatientInCentreError())),
          ),
      ),
    ),
  );

  markPatientInCentreSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientInCentreSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  markPatientReleased$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientReleased),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/release`, action)
          .pipe(
            map(() =>
              markPatientReleasedSuccess({ patientId: action.patientId }),
            ),
            catchError(() => of(markPatientReleasedError())),
          ),
      ),
    ),
  );

  markPatientReleasedSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientReleasedSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  markPatientTransferred$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientTransferred),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/transfer`, action)
          .pipe(
            map(() =>
              markPatientTransferredSuccess({ patientId: action.patientId }),
            ),
            catchError(() => of(markPatientTransferredError())),
          ),
      ),
    ),
  );

  markPatientTransferredSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(markPatientTransferredSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
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
            catchError(() => of(movePatientError())),
          ),
      ),
    ),
  );

  movePatientSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(movePatientSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true }), getAreas()),
      ),
    ),
  );

  // Add note

  addNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNote),
      switchMap((action) => {
        const formData = new FormData();
        formData.append('patientId', String(action.patientId));
        formData.append('weightValue', String(action.weightValue || ''));
        formData.append('weightUnit', String(action.weightUnit || ''));
        formData.append('comments', action.comments);
        for (const file of action.files) {
          formData.append('files', file);
        }
        return this.http
          .post(`hospital/patients/${action.patientId}/note`, formData)
          .pipe(
            map(() => addNoteSuccess({ patientId: action.patientId })),
            catchError(() => of(addNoteError())),
          );
      }),
    ),
  );

  addNoteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNoteSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Update note

  updateNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateNote),
      switchMap((action) =>
        this.http.put(`hospital/patients/note/${action.id}`, action).pipe(
          map(() => updateNoteSuccess({ patientId: action.patientId })),
          catchError(() => of(updateNoteError())),
        ),
      ),
    ),
  );

  updateNoteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateNoteSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Remove note

  removeNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeNote),
      switchMap((action) =>
        this.http.delete(`hospital/patients/note/${action.id}`).pipe(
          map(() => removeNoteSuccess({ patientId: action.patientId })),
          catchError(() => of(removeNoteError())),
        ),
      ),
    ),
  );

  removeNoteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeNoteSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Download note attachment

  downloadNoteAttachment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(downloadNoteAttachment),
        switchMap((action) => {
          this.http
            .get(
              `hospital/patients/${action.patientId}/notes/${action.noteId}/attachments/${action.attachment.id}`,
              {
                responseType: 'blob',
              },
            )
            .subscribe((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = action.attachment.fileName;
              a.click();

              window.URL.revokeObjectURL(url);
            });
          return of();
        }),
      ),
    { dispatch: false },
  );

  // Add faecal test

  addFaecalTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFaecalTest),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/${action.patientId}/faecal-test`, action)
          .pipe(
            map(() => addFaecalTestSuccess({ patientId: action.patientId })),
            catchError(() => of(addFaecalTestError())),
          ),
      ),
    ),
  );

  addFaecalTestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFaecalTestSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Update faecal test

  updateFaecalTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFaecalTest),
      switchMap((action) =>
        this.http
          .put(`hospital/patients/faecal-test/${action.id}`, action)
          .pipe(
            map(() => updateFaecalTestSuccess({ patientId: action.patientId })),
            catchError(() => of(updateFaecalTestError())),
          ),
      ),
    ),
  );

  updateFaecalTestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFaecalTestSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Remove faecal test

  removeFaecalTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeFaecalTest),
      switchMap((action) =>
        this.http.delete(`hospital/patients/faecal-test/${action.id}`).pipe(
          map(() => removeFaecalTestSuccess({ patientId: action.patientId })),
          catchError(() => of(removeFaecalTestError())),
        ),
      ),
    ),
  );

  removeFaecalTestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeFaecalTestSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Add blood test

  addBloodTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBloodTest),
      switchMap((action) => {
        const formData = new FormData();
        formData.append('patientId', String(action.patientId));
        formData.append('comments', action.comments);
        for (const file of action.files) {
          formData.append('files', file);
        }
        return this.http
          .post(`hospital/patients/${action.patientId}/blood-test`, formData)
          .pipe(
            map(() => addBloodTestSuccess({ patientId: action.patientId })),
            catchError(() => of(addBloodTestError())),
          );
      }),
    ),
  );

  addBloodTestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBloodTestSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Update blood test

  updateBloodTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBloodTest),
      switchMap((action) =>
        this.http.put(`hospital/patients/blood-test/${action.id}`, action).pipe(
          map(() => updateBloodTestSuccess({ patientId: action.patientId })),
          catchError(() => of(updateBloodTestError())),
        ),
      ),
    ),
  );

  updateBloodTestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBloodTestSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Remove blood test

  removeBloodTest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeBloodTest),
      switchMap((action) =>
        this.http.delete(`hospital/patients/blood-test/${action.id}`).pipe(
          map(() => removeBloodTestSuccess({ patientId: action.patientId })),
          catchError(() => of(removeBloodTestError())),
        ),
      ),
    ),
  );

  removeBloodTestSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeBloodTestSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Download blood test attachment

  downloadBloodTestAttachment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(downloadBloodTestAttachment),
        switchMap((action) => {
          this.http
            .get(
              `hospital/patients/${action.patientId}/blood-tests/${action.bloodTestId}/attachments/${action.attachment.id}`,
              {
                responseType: 'blob',
              },
            )
            .subscribe((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = action.attachment.fileName;
              a.click();

              window.URL.revokeObjectURL(url);
            });
          return of();
        }),
      ),
    { dispatch: false },
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
            catchError(() => of(addRecheckError())),
          ),
      ),
    ),
  );

  addRecheckSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addRecheckSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Update recheck

  updateRecheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRecheck),
      switchMap((action) =>
        this.http.put(`hospital/patients/recheck/${action.id}`, action).pipe(
          map(() => updateRecheckSuccess({ patientId: action.patientId })),
          catchError(() => of(updateRecheckError())),
        ),
      ),
    ),
  );

  updateRecheckSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRecheckSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Add prescription instruction

  addPrescriptionInstruction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPrescriptionInstruction),
      switchMap((action) =>
        this.http
          .post(
            `hospital/patients/${action.patientId}/prescriptions/instruction`,
            action,
          )
          .pipe(
            map(() =>
              addPrescriptionInstructionSuccess({
                patientId: action.patientId,
              }),
            ),
            catchError(() => of(addPrescriptionInstructionError())),
          ),
      ),
    ),
  );

  addPrescriptionInstructionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPrescriptionInstructionSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Update prescription instruction

  updatePrescriptionInstruction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePrescriptionInstruction),
      switchMap((action) =>
        this.http
          .put(
            `hospital/patients/prescriptions/instruction/${action.id}`,
            action,
          )
          .pipe(
            map(() =>
              updatePrescriptionInstructionSuccess({
                patientId: action.patientId,
              }),
            ),
            catchError(() => of(updatePrescriptionInstructionError())),
          ),
      ),
    ),
  );

  updatePrescriptionInstructionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePrescriptionInstructionSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Add prescription medication

  addPrescriptionMedication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPrescriptionMedication),
      switchMap((action) =>
        this.http
          .post(
            `hospital/patients/${action.patientId}/prescriptions/medication`,
            action,
          )
          .pipe(
            map(() =>
              addPrescriptionMedicationSuccess({ patientId: action.patientId }),
            ),
            catchError(() => of(addPrescriptionMedicationError())),
          ),
      ),
    ),
  );

  addPrescriptionMedicationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPrescriptionMedicationSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Update prescription medication

  updatePrescriptionMedication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePrescriptionMedication),
      switchMap((action) =>
        this.http
          .put(
            `hospital/patients/prescriptions/medication/${action.id}`,
            action,
          )
          .pipe(
            map(() =>
              updatePrescriptionMedicationSuccess({
                patientId: action.patientId,
              }),
            ),
            catchError(() => of(updatePrescriptionMedicationError())),
          ),
      ),
    ),
  );

  updatePrescriptionMedicationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePrescriptionMedicationSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
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
            catchError(() => of(removeRecheckError())),
          ),
      ),
    ),
  );

  removeRecheckSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeRecheckSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Remove prescription instruction

  removePrescriptionInstruction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePrescriptionInstruction),
      switchMap((action) =>
        this.http
          .delete(
            `hospital/patients/prescriptions/instruction/${action.patientPrescriptionInstructionId}`,
          )
          .pipe(
            map(() =>
              removePrescriptionInstructionSuccess({
                patientId: action.patientId,
              }),
            ),
            catchError(() => of(removePrescriptionInstructionError())),
          ),
      ),
    ),
  );

  removePrescriptionInstructionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePrescriptionInstructionSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Remove prescription medication

  removePrescriptionMedication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePrescriptionMedication),
      switchMap((action) =>
        this.http
          .delete(
            `hospital/patients/prescriptions/medication/${action.patientPrescriptionMedicationId}`,
          )
          .pipe(
            map(() =>
              removePrescriptionMedicationSuccess({
                patientId: action.patientId,
              }),
            ),
            catchError(() => of(removePrescriptionMedicationError())),
          ),
      ),
    ),
  );

  removePrescriptionMedicationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removePrescriptionMedicationSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
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
              updatePatientBasicDetailsSuccess({
                patientId: action.patientId,
                update: action.update,
              }),
            ),
            catchError(() =>
              of(updatePatientBasicDetailsError({ update: action.update })),
            ),
          ),
      ),
    ),
  );

  updatePatientBasicDetailsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePatientBasicDetailsSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Request home care

  requestHomeCare$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestHomeCare),
      switchMap((action) =>
        this.http
          .post(
            `hospital/patients/${action.patientId}/request-home-care`,
            action,
          )
          .pipe(
            map(() => requestHomeCareSuccess({ patientId: action.patientId })),
            catchError(() => of(requestHomeCareError())),
          ),
      ),
    ),
  );

  requestHomeCareSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestHomeCareSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Home carer drop off

  homeCarerDropOff$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homeCarerDropOff),
      switchMap((action) =>
        this.http
          .post(
            `hospital/home-care/${action.homeCareRequestId}/drop-off`,
            action,
          )
          .pipe(
            map(() => homeCarerDropOffSuccess({ patientId: action.patientId })),
            catchError(() => of(homeCarerDropOffError())),
          ),
      ),
    ),
  );

  homeCarerDropOffSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(homeCarerDropOffSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Send home care message

  sendHomeCareMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendHomeCareMessage),
      switchMap((action) =>
        this.http
          .post(
            `hospital/home-care/${action.homeCareRequestId}/message`,
            action,
          )
          .pipe(
            map(() =>
              sendHomeCareMessageSuccess({
                patientId: action.patientId,
                homeCareRequestId: action.homeCareRequestId,
              }),
            ),
            catchError(() => of(sendHomeCareMessageError())),
          ),
      ),
    ),
  );

  sendHomeCareMessageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendHomeCareMessageSuccess),
      switchMap((action) =>
        of(getPatient({ id: action.patientId, silent: true })),
      ),
    ),
  );

  // Search patient

  searchPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchPatient),
      switchMap((action) =>
        this.http
          .get<{
            id: number;
            reference: string;
            species: string;
          }>(`hospital/patients/search?query=${action.search}`)
          .pipe(
            map(({ id, reference, species }) =>
              searchPatientSuccess({
                patientId: id,
                reference,
                species,
              }),
            ),
            catchError(() => of(searchPatientError())),
          ),
      ),
    ),
  );

  searchPatientSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchPatientSuccess),
      switchMap(({ patientId, reference, species }) =>
        of(
          setTab({
            tab: {
              code: 'VIEW_PATIENT',
              title: `[${reference}] ${species}`,
              id: patientId,
            },
          }),
        ),
      ),
    ),
  );

  // View daily tasks

  viewDailyTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(viewDailyTasks),
      switchMap((action) =>
        this.http
          .get<DailyTasksReport>(`hospital/daily-tasks?on=${action.date}`)
          .pipe(
            map((dailyTasksReport) =>
              viewDailyTasksSuccess({ dailyTasksReport }),
            ),
            catchError(() => of(viewDailyTasksError())),
          ),
      ),
    ),
  );

  // Perform recheck

  performRecheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(performRecheck),
      switchMap((action) =>
        this.http
          .post(`hospital/patients/recheck/${action.recheckId}/perform`, action)
          .pipe(
            map(() => performRecheckSuccess({ date: action.date })),
            catchError(() => of(performRecheckError())),
          ),
      ),
    ),
  );

  performRecheckSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(performRecheckSuccess),
      switchMap((action) => of(viewDailyTasks({ date: action.date }))),
    ),
  );

  // Administer prescription

  administerPrescriptionInstruction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(administerPrescriptionInstruction),
      switchMap((action) =>
        this.http
          .post(
            `hospital/patients/prescriptions/instruction/${action.prescriptionInstructionId}/administer`,
            action,
          )
          .pipe(
            map(() => administerPrescriptionSuccess({ date: action.date })),
            catchError(() => of(administerPrescriptionError())),
          ),
      ),
    ),
  );

  administerPrescriptionMedication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(administerPrescriptionMedication),
      switchMap((action) =>
        this.http
          .post(
            `hospital/patients/prescriptions/medication/${action.prescriptionMedicationId}/administer`,
            action,
          )
          .pipe(
            map(() => administerPrescriptionSuccess({ date: action.date })),
            catchError(() => of(administerPrescriptionError())),
          ),
      ),
    ),
  );

  administerPrescriptionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(administerPrescriptionSuccess),
      switchMap((action) => of(viewDailyTasks({ date: action.date }))),
    ),
  );

  // Undo administer prescription

  undoAdministerPrescriptionInstruction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undoAdministerPrescriptionInstruction),
      switchMap((action) =>
        this.http
          .delete(
            `hospital/patients/prescriptions/instruction/administration/${action.administrationId}`,
          )
          .pipe(
            map(() => undoAdministerPrescriptionSuccess({ date: action.date })),
            catchError(() => of(undoAdministerPrescriptionError())),
          ),
      ),
    ),
  );

  undoAdministerPrescriptionMedication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undoAdministerPrescriptionMedication),
      switchMap((action) =>
        this.http
          .delete(
            `hospital/patients/prescriptions/medication/administration/${action.administrationId}`,
          )
          .pipe(
            map(() => undoAdministerPrescriptionSuccess({ date: action.date })),
            catchError(() => of(undoAdministerPrescriptionError())),
          ),
      ),
    ),
  );

  undoAdministerPrescriptionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(undoAdministerPrescriptionSuccess),
      switchMap((action) => of(viewDailyTasks({ date: action.date }))),
    ),
  );

  // View patient boards

  viewPatientBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(viewPatientBoards),
      switchMap((action) =>
        this.http.get<ListPatientBoard[]>(`hospital/boards`).pipe(
          map((boards) => viewPatientBoardsSuccess({ boards })),
          catchError(() => of(viewPatientBoardsError())),
        ),
      ),
    ),
  );

  viewPatientBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(viewPatientBoard),
      switchMap((action) =>
        this.http.get<PatientBoard>(`hospital/boards/${action.id}`).pipe(
          map((board) => viewPatientBoardSuccess({ board })),
          catchError(() => of(viewPatientBoardError())),
        ),
      ),
    ),
  );
}
