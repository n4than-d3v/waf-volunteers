import { Component, Input, OnInit } from '@angular/core';
import {
  Area,
  OtherPatient,
  Patient,
  PatientStatus,
  ReadOnlyWrapper,
  Task,
} from '../../state';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAreas, selectMovePatient } from '../../selectors';
import { getAreas, movePatient, setTab } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { HospitalPatientAutocompleteComponent } from '../autocomplete/component';

@Component({
  selector: 'hospital-patient-location',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    HospitalPatientAutocompleteComponent,
  ],
})
export class HospitalPatientLocationComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;
  @Input({ required: true }) canEditAfterDisposition!: boolean;

  areas$: Observable<ReadOnlyWrapper<Area[]>>;

  task$: Observable<Task>;

  PatientStatus = PatientStatus;

  moveForm = new FormGroup({
    areaId: new FormControl('', [Validators.required]),
    penId: new FormControl('', [Validators.required]),
    movingPenToAnotherArea: new FormControl(false, { nonNullable: true }),
    otherPatientIds: new FormControl<number[]>([], {
      nonNullable: true,
    }),
    newAreaId: new FormControl(''),
  });

  moving = false;
  saving = false;
  attemptedSave = false;

  constructor(private store: Store) {
    this.areas$ = this.store.select(selectAreas);
    this.task$ = this.store.select(selectMovePatient);
  }

  ngOnInit() {
    this.store.dispatch(getAreas());
  }
  toggleOtherPatient(patientId: number, checked: boolean) {
    const current = this.moveForm.controls.otherPatientIds.value;

    this.moveForm.controls.otherPatientIds.setValue(
      checked
        ? [...new Set([...current, patientId])]
        : current.filter((id) => id !== patientId),
    );
  }

  isOtherPatientSelected(patientId: number): boolean {
    return this.moveForm.controls.otherPatientIds.value.includes(patientId);
  }

  toggleAllOtherPatients(checked: boolean) {
    this.moveForm.controls.otherPatientIds.setValue(
      checked ? (this.patient.othersInPen ?? []).map((x) => x.id) : [],
    );
  }

  areAllOtherPatientsSelected(): boolean {
    const selected = this.moveForm.controls.otherPatientIds.value;
    const others = this.patient.othersInPen ?? [];

    return others.length > 0 && others.every((x) => selected.includes(x.id));
  }

  view(patient: OtherPatient) {
    this.store.dispatch(
      setTab({
        tab: {
          code: 'VIEW_PATIENT',
          id: patient.id,
          title: `[${patient.reference}] ${patient.species}`,
        },
      }),
    );
  }

  convertAreas(areas: Area[], showEmpty = true) {
    return areas
      .filter((x) => !x.deleted)
      .map((area) => ({
        id: area.id,
        display: showEmpty
          ? area.empty
            ? `🟩 [${area.code}] ${area.name} (empty pens)`
            : `🟨 [${area.code}] ${area.name} (all pens in use)`
          : area.name,
      }));
  }

  convertPens(areas: Area[]) {
    const area = areas
      .filter((x) => !x.deleted)
      .find((x) => String(x.id) == this.moveForm.value.areaId);
    if (!area) return [];
    return area.pens
      .filter((x) => !x.deleted)
      .map((pen) => ({
        id: pen.id,
        display: pen.needsCleaning
          ? `🟥 ${pen.reference} (dirty)`
          : pen.empty
            ? `🟩 ${pen.reference} (empty)`
            : `🟨 ${pen.reference} (in use)`,
      }));
  }

  reset() {
    this.saving = false;
    this.moving = false;
    this.attemptedSave = false;
    this.moveForm.reset();
  }

  move() {
    this.attemptedSave = true;
    if (this.moveForm.value.movingPenToAnotherArea) {
      this.moveForm.controls.newAreaId.addValidators(Validators.required);
    }
    this.moveForm.controls.newAreaId.updateValueAndValidity();
    this.moveForm.updateValueAndValidity();
    if (!this.moveForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      movePatient({
        patientId: this.patient.id,
        penId: Number(this.moveForm.value.penId),
        newAreaId: this.moveForm.value.newAreaId
          ? Number(this.moveForm.value.newAreaId)
          : null,
        otherPatientIds: this.moveForm.controls.otherPatientIds.value,
      }),
    );
    this.reset();
  }
}
