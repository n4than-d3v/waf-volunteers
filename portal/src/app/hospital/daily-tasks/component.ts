import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addRecheck,
  administerPrescriptionInstruction,
  administerPrescriptionMedication,
  performRecheck,
  setTab,
  undoAdministerPrescriptionInstruction,
  undoAdministerPrescriptionMedication,
  viewDailyTasks,
} from '../actions';
import moment from 'moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  Administration,
  DailyTasksReport,
  DailyTasksReportArea,
  DailyTasksReportAreaPen,
  DailyTasksReportAreaPenPatient,
  getRecheckRoles,
  getWeightUnit,
  ListRecheck,
  Medication,
  Prescription,
  PrescriptionMedication,
  ReadOnlyWrapper,
  Task,
} from '../state';
import {
  selectAdministerPrescription,
  selectDailyTasksReport,
  selectPerformRecheck,
} from '../selectors';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import { TokenProvider } from '../../shared/token.provider';

@Component({
  selector: 'hospital-daily-tasks',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HospitalDailyTasksComponent implements OnInit, OnDestroy {
  private readonly LS_KEY = 'hospital-daily-tasks-show-me';

  dailyTasksReport$: Observable<ReadOnlyWrapper<DailyTasksReport>>;

  date: string = '';

  showMe = {
    overdueRechecks: true,
    dueRechecks: true,
    doneRechecks: false,
    veterinarianRechecks: true,
    technicianRechecks: true,
    duePrescriptions: true,
    donePrescriptions: false,
    notDuePrescriptions: false,
  };

  isVet = false;

  performRecheckTask$: Observable<Task>;
  administerPrescriptionTask$: Observable<Task>;

  performingRecheck: ListRecheck | null = null;
  administeringPrescription: Prescription | null = null;
  undoPrescriptionAdministration: Administration | null = null;
  invalid: number | null = null;

  comments: any = {};
  weightValue: any = {};
  weightUnit: any = {};

  isAddingRecheck = false;
  newRecheckDue: any = {};
  newRecheckRoles: any = {};
  newRecheckRequireWeight: any = {};
  newRecheckDescription: any = {};

  constructor(
    private store: Store,
    private tokenProvider: TokenProvider,
  ) {
    this.dailyTasksReport$ = this.store.select(selectDailyTasksReport);
    this.performRecheckTask$ = this.store.select(selectPerformRecheck);
    this.administerPrescriptionTask$ = this.store.select(
      selectAdministerPrescription,
    );
    this.date = moment().toISOString().split('T')[0];
  }

  changeDate() {
    this.store.dispatch(
      viewDailyTasks({
        date: this.date,
      }),
    );
  }

  ngOnInit() {
    this.isVet = this.tokenProvider.isVet() || this.tokenProvider.isAdmin();
    this.changeDate();
    const showMeFromStorage = localStorage.getItem(this.LS_KEY);
    if (showMeFromStorage) {
      this.showMe = JSON.parse(showMeFromStorage);
    }
  }

  ngOnDestroy() {
    localStorage.setItem(this.LS_KEY, JSON.stringify(this.showMe));
  }

  shouldShowAreas(report: DailyTasksReport) {
    return report.areas.some((area) => this.shouldShowArea(area));
  }

  shouldShowArea(area: DailyTasksReportArea) {
    return area.pens.some((pen) => this.shouldShowPen(pen));
  }

  shouldShowPen(pen: DailyTasksReportAreaPen) {
    return pen.patients.some((patient) => this.shouldShowPatient(patient));
  }

  shouldShowPatient(patient: DailyTasksReportAreaPenPatient) {
    return (
      this.shouldShowRechecks(patient) || this.shouldShowPrescriptions(patient)
    );
  }

  shouldShowRechecks(patient: DailyTasksReportAreaPenPatient) {
    return patient.rechecks.some((recheck) => this.shouldShowRecheck(recheck));
  }

  shouldShowRecheck(recheck: ListRecheck) {
    let status: 'due' | 'overdue' | 'done' =
      recheck.due === this.date
        ? recheck.rechecked
          ? 'done'
          : 'due'
        : 'overdue';
    let roles = getRecheckRoles(recheck.roles);
    if (roles === 'Veterinarian' && !this.showMe.veterinarianRechecks)
      return false;
    if (roles === 'Technician' && !this.showMe.technicianRechecks) return false;
    return (
      (this.showMe.doneRechecks && status === 'done') ||
      (this.showMe.dueRechecks && status === 'due') ||
      (this.showMe.overdueRechecks && status === 'overdue')
    );
  }

  shouldShowPrescriptions(patient: DailyTasksReportAreaPenPatient) {
    return (
      patient.prescriptionInstructions.some((prescription) =>
        this.shouldShowPrescription(prescription),
      ) ||
      patient.prescriptionMedications.some((prescription) =>
        this.shouldShowPrescription(prescription),
      )
    );
  }

  getPrescriptionStatus(prescription: Prescription): 'due' | 'done' | 'notDue' {
    return prescription.administerToday === 0
      ? 'notDue'
      : prescription.administeredToday < prescription.administerToday
        ? 'due'
        : 'done';
  }

  shouldShowPrescription(prescription: Prescription) {
    const status = this.getPrescriptionStatus(prescription);
    return (
      (this.showMe.donePrescriptions && status === 'done') ||
      (this.showMe.duePrescriptions && status === 'due') ||
      (this.showMe.notDuePrescriptions && status === 'notDue')
    );
  }

  viewPatient(reference: string, species: string, id: number) {
    this.store.dispatch(
      setTab({
        tab: {
          code: 'VIEW_PATIENT',
          title: `[${reference}] ${species}`,
          id: id,
        },
      }),
    );
  }

  cancel() {
    this.invalid = null;
    this.performingRecheck = null;
    this.administeringPrescription = null;
    this.undoPrescriptionAdministration = null;
    this.comments = {};
    this.weightUnit = {};
    this.weightValue = {};
    this.isAddingRecheck = false;
    this.newRecheckDue = {};
    this.newRecheckRoles = {};
    this.newRecheckRequireWeight = {};
    this.newRecheckDescription = {};
  }

  getRecheckRoles = getRecheckRoles;
  getWeightUnit = getWeightUnit;

  performRecheck(recheck: ListRecheck) {
    this.invalid = null;
    if (
      recheck.requireWeight &&
      !(this.weightUnit[recheck.id] && this.weightValue[recheck.id])
    ) {
      this.invalid = recheck.id;
      return;
    }
    if (
      this.isAddingRecheck &&
      !(
        this.newRecheckDue[recheck.id] &&
        this.newRecheckRoles[recheck.id] &&
        this.newRecheckDescription[recheck.id]
      )
    ) {
      this.invalid = recheck.id;
      return;
    }
    this.store.dispatch(
      performRecheck({
        recheckId: recheck.id,
        date: this.date,
        comments: this.comments[recheck.id] || '',
        weightUnit: this.weightUnit[recheck.id]
          ? Number(this.weightUnit[recheck.id])
          : null,
        weightValue: this.weightValue[recheck.id]
          ? Number(this.weightValue[recheck.id])
          : null,
      }),
    );
    if (this.isAddingRecheck) {
      this.store.dispatch(
        addRecheck({
          due: this.newRecheckDue[recheck.id],
          roles: Number(this.newRecheckRoles[recheck.id]),
          requireWeight: this.newRecheckRequireWeight[recheck.id] || false,
          description: this.newRecheckDescription[recheck.id],
          patientId: recheck.viewPatientId,
        }),
      );
    }
    this.cancel();
  }

  administerInstruction(prescriptionInstructionId: number, success: boolean) {
    this.store.dispatch(
      administerPrescriptionInstruction({
        prescriptionInstructionId,
        date: this.date,
        comments: this.comments['I' + prescriptionInstructionId] || '',
        success,
      }),
    );
    this.cancel();
  }

  askUndoPrescriptionAdministration(
    prescription: Prescription,
    administration: Administration,
  ) {
    this.administeringPrescription = prescription;
    this.undoPrescriptionAdministration = administration;
  }

  undoPrescriptionInstruction(administrationId: number) {
    this.store.dispatch(
      undoAdministerPrescriptionInstruction({
        date: this.date,
        administrationId,
      }),
    );
    this.cancel();
  }

  undoPrescriptionMedication(administrationId: number) {
    this.store.dispatch(
      undoAdministerPrescriptionMedication({
        date: this.date,
        administrationId,
      }),
    );
    this.cancel();
  }

  administerMedication(prescriptionMedicationId: number, success: boolean) {
    this.store.dispatch(
      administerPrescriptionMedication({
        prescriptionMedicationId,
        date: this.date,
        comments: this.comments['M' + prescriptionMedicationId] || '',
        success,
      }),
    );
    this.cancel();
  }

  getPrescriptions(patient: DailyTasksReportAreaPenPatient): Prescription[] {
    return [
      ...patient.prescriptionInstructions,
      ...patient.prescriptionMedications,
    ];
  }

  getOutstandingAdministrationsCount(prescription: Prescription) {
    return Array.from({
      length: prescription.administerToday - prescription.administeredToday,
    });
  }

  getBrands(medication: Medication) {
    return medication.brands.join(', ');
  }

  getMostRecent(prescription: Prescription) {
    const success = prescription.administrations.filter((x) => x.success);
    if (success.length === 0) return '';
    return success[success.length - 1].administered;
  }

  getDurationSinceMostRecent(prescription: Prescription) {
    const recent = this.getMostRecent(prescription);
    if (!recent) return '';

    const start = moment(recent);
    const end = moment();

    const duration = moment.duration(end.diff(start));

    // Total minutes, rounded
    const totalMinutes = Math.round(duration.asMinutes());
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    const formatted = [
      days ? `${days} day${days > 1 ? 's' : ''}` : null,
      hours ? `${hours} hour${hours > 1 ? 's' : ''}` : null,
      minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}` : null,
    ]
      .filter(Boolean)
      .join(', ');

    return formatted || '0 minutes';
  }

  isPrescriptionMedication(p: Prescription): p is PrescriptionMedication {
    return 'medication' in p;
  }
}
