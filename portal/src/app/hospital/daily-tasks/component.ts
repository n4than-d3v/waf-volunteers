import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  administerPrescriptionInstruction,
  administerPrescriptionMedication,
  performRecheck,
  setTab,
  viewDailyTasks,
} from '../actions';
import moment from 'moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import {
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
export class HospitalDailyTasksComponent implements OnInit {
  dailyTasksReport$: Observable<ReadOnlyWrapper<DailyTasksReport>>;

  date: string = '';

  showMeOverdueRechecks = true;
  showMeDueRechecks = true;
  showMeDoneRechecks = false;
  showMeDuePrescriptions = true;
  showMeDonePrescriptions = false;
  showMeNotDuePrescriptions = false;

  performRecheckTask$: Observable<Task>;
  administerPrescriptionTask$: Observable<Task>;

  performingRecheck: ListRecheck | null = null;
  administeringPrescription: Prescription | null = null;
  invalid: number | null = null;

  comments: any = {};
  weightValue: any = {};
  weightUnit: any = {};

  constructor(private store: Store) {
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
    this.changeDate();
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
    return (
      (this.showMeDoneRechecks && status === 'done') ||
      (this.showMeDueRechecks && status === 'due') ||
      (this.showMeOverdueRechecks && status === 'overdue')
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
      (this.showMeDonePrescriptions && status === 'done') ||
      (this.showMeDuePrescriptions && status === 'due') ||
      (this.showMeNotDuePrescriptions && status === 'notDue')
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
    this.comments = {};
    this.weightUnit = {};
    this.weightValue = {};
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
