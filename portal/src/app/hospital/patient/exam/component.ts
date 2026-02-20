import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import {
  AdministrationMethod,
  Area,
  Attitude,
  BodyCondition,
  Dehydration,
  DispositionReason,
  ListExam,
  MucousMembraneColour,
  MucousMembraneTexture,
  Outcome,
  ReadOnlyWrapper,
  Species,
  Task,
} from '../../../hospital/state';
import { Store } from '@ngrx/store';
import {
  selectAdministrationMethods,
  selectAreas,
  selectAttitudes,
  selectBodyConditions,
  selectDehydrations,
  selectDispositionReasons,
  selectMucousMembraneColours,
  selectMucousMembraneTextures,
  selectPerformExam,
  selectSetDisposition,
  selectSpecies,
} from '../../../hospital/selectors';
import {
  getAdministrationMethods,
  getAreas,
  getAttitudes,
  getBodyConditions,
  getDehydrations,
  getDispositionReasons,
  getMucousMembraneColours,
  getMucousMembraneTextures,
  getSpecies,
  performExam,
} from '../../actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../shared/spinner/component';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HospitalPatientMedicationSelectorComponent } from './../medication-selector/component';
import { HospitalPatientAutocompleteComponent } from '../autocomplete/component';

@Component({
  selector: 'hospital-patient-exam',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    SpinnerComponent,
    HospitalPatientMedicationSelectorComponent,
    HospitalPatientAutocompleteComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class HospitalPatientExamComponent implements OnInit {
  @Input({ required: true }) exam!: ListExam | null;
  @Input({ required: true }) patientId!: number;

  attitudes$: Observable<ReadOnlyWrapper<Attitude[]>>;
  bodyConditions$: Observable<ReadOnlyWrapper<BodyCondition[]>>;
  dehydrations$: Observable<ReadOnlyWrapper<Dehydration[]>>;
  mucousMembraneColours$: Observable<ReadOnlyWrapper<MucousMembraneColour[]>>;
  mucousMembraneTextures$: Observable<ReadOnlyWrapper<MucousMembraneTexture[]>>;

  species$: Observable<ReadOnlyWrapper<Species[]>>;
  dispositionReasons$: Observable<ReadOnlyWrapper<DispositionReason[]>>;
  administrationMethods$: Observable<ReadOnlyWrapper<AdministrationMethod[]>>;
  areas$: Observable<ReadOnlyWrapper<Area[]>>;

  performExamTask$: Observable<Task>;
  setDispositionTask$: Observable<Task>;

  attemptedSave = false;
  saving = false;

  examForm = new FormGroup({
    speciesId: new FormControl('', [Validators.required]),
    speciesVariantId: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    weightValue: new FormControl('', [Validators.required]),
    weightUnit: new FormControl('', [Validators.required]),
    temperature: new FormControl(''),
    attitudeId: new FormControl(''),
    bodyConditionId: new FormControl(''),
    dehydrationId: new FormControl(''),
    mucousMembraneColourId: new FormControl(''),
    mucousMembraneTextureId: new FormControl(''),
    treatmentInstructions: new FormArray<
      FormGroup<{
        instructions: FormControl<string | null>;
      }>
    >([]),
    treatmentMedications: new FormArray<
      FormGroup<{
        rangeSelection: FormControl<string | null>;
        quantityValue: FormControl<string | null>;
        quantityUnit: FormControl<string | null>;
        medicationId: FormControl<string | null>;
        medicationConcentrationId: FormControl<string | null>;
        administrationMethodId: FormControl<string | null>;
        comments: FormControl<string | null>;
      }>
    >([]),
    comments: new FormControl(''),
    outcome: new FormControl('alive', [Validators.required]),
    dispositionReasonIds: new FormArray<
      FormGroup<{ reason: FormControl<string | null> }>
    >([]),
    settingPen: new FormControl(true),
    areaId: new FormControl(''),
    penId: new FormControl(''),
  });

  constructor(private store: Store) {
    this.attitudes$ = this.store.select(selectAttitudes);
    this.bodyConditions$ = this.store.select(selectBodyConditions);
    this.dehydrations$ = this.store.select(selectDehydrations);
    this.mucousMembraneColours$ = this.store.select(
      selectMucousMembraneColours,
    );
    this.mucousMembraneTextures$ = this.store.select(
      selectMucousMembraneTextures,
    );
    this.species$ = this.store.select(selectSpecies);
    this.dispositionReasons$ = this.store.select(selectDispositionReasons);
    this.administrationMethods$ = this.store.select(
      selectAdministrationMethods,
    );
    this.areas$ = this.store.select(selectAreas);
    this.performExamTask$ = this.store.select(selectPerformExam);
    this.setDispositionTask$ = this.store.select(selectSetDisposition);
  }

  convertSpecies(species: Species[]) {
    return species.map((x) => ({ id: x.id, display: x.name }));
  }

  convertAreas(areas: Area[]) {
    return areas
      .filter((x) => !x.deleted)
      .map((area) => ({
        id: area.id,
        display: area.empty
          ? `🟩 [${area.code}] ${area.name} (empty pens)`
          : `🟨 [${area.code}] ${area.name} (all pens in use)`,
      }));
  }

  convertPens(areas: Area[]) {
    const area = areas
      .filter((x) => !x.deleted)
      .find((x) => String(x.id) == this.examForm.value.areaId);
    if (!area) return [];
    return area.pens
      .filter((x) => !x.deleted)
      .map((pen) => ({
        id: pen.id,
        display: pen.empty
          ? `🟩 ${pen.reference} (empty)`
          : `🟨 ${pen.reference} (in use)`,
      }));
  }

  addTreatmentInstruction() {
    this.examForm.controls.treatmentInstructions.push(
      new FormGroup({
        instructions: new FormControl<string | null>('', [Validators.required]),
      }),
    );
  }

  addTreatmentMedication() {
    this.examForm.controls.treatmentMedications.push(
      new FormGroup({
        rangeSelection: new FormControl<string | null>(''),
        quantityValue: new FormControl<string | null>('', [
          Validators.required,
        ]),
        quantityUnit: new FormControl<string | null>('', [Validators.required]),
        medicationId: new FormControl<string | null>('', [Validators.required]),
        medicationConcentrationId: new FormControl<string | null>('', [
          Validators.required,
        ]),
        administrationMethodId: new FormControl<string | null>('', [
          Validators.required,
        ]),
        comments: new FormControl<string | null>(''),
      }),
    );
  }

  removeTreatmentMedication(index: number) {
    this.examForm.controls.treatmentMedications.removeAt(index);
    this.examForm.controls.treatmentMedications.updateValueAndValidity();
  }

  removeTreatmentInstruction(index: number) {
    this.examForm.controls.treatmentInstructions.removeAt(index);
    this.examForm.controls.treatmentInstructions.updateValueAndValidity();
  }

  addDispositionReason() {
    this.examForm.controls.dispositionReasonIds.push(
      new FormGroup({
        reason: new FormControl<string | null>(null, Validators.required),
      }),
    );
  }

  removeDispositionReason(id: number) {
    this.examForm.controls.dispositionReasonIds.removeAt(id);
  }

  convertDispositionReasons(dispositionReasons: DispositionReason[]) {
    return dispositionReasons.map((x) => ({
      id: x.id,
      display: x.description,
    }));
  }

  performExam() {
    this.attemptedSave = true;
    if (this.exam === null) {
      this.examForm.controls.penId.clearValidators();
      for (
        let i = 0;
        i < this.examForm.controls.dispositionReasonIds.length;
        i++
      ) {
        this.examForm.controls.dispositionReasonIds
          .at(i)
          .controls.reason.clearValidators();
      }
      if (this.examForm.controls.outcome.value === 'alive') {
        this.examForm.controls.dispositionReasonIds.clear();
        if (this.examForm.controls.settingPen.value) {
          this.examForm.controls.penId.setValidators([Validators.required]);
        }
      } else if (
        this.examForm.controls.outcome.value === 'diedOnTable' ||
        this.examForm.controls.outcome.value === 'deadOnArrival' ||
        this.examForm.controls.outcome.value === 'pts'
      ) {
        for (
          let i = 0;
          i < this.examForm.controls.dispositionReasonIds.length;
          i++
        ) {
          this.examForm.controls.dispositionReasonIds
            .at(i)
            .controls.reason.setValidators([Validators.required]);
        }
      }
      this.examForm.controls.penId.updateValueAndValidity({
        onlySelf: true,
        emitEvent: true,
      });
      for (
        let i = 0;
        i < this.examForm.controls.dispositionReasonIds.length;
        i++
      ) {
        this.examForm.controls.dispositionReasonIds
          .at(i)
          .controls.reason.updateValueAndValidity({
            onlySelf: true,
            emitEvent: true,
          });
      }
    }
    this.examForm.updateValueAndValidity({
      onlySelf: true,
      emitEvent: true,
    });
    if (!this.examForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      performExam({
        exam: {
          examId: this.exam?.id || null,
          patientId: this.patientId,
          speciesId: Number(this.examForm.controls.speciesId.value),
          speciesVariantId: Number(
            this.examForm.controls.speciesVariantId.value,
          ),
          sex: Number(this.examForm.controls.sex.value),
          weightValue: this.examForm.controls.weightValue.value
            ? Number(this.examForm.controls.weightValue.value)
            : null,
          weightUnit: this.examForm.controls.weightUnit.value
            ? Number(this.examForm.controls.weightUnit.value)
            : null,
          temperature: this.examForm.controls.temperature.value
            ? Number(this.examForm.controls.temperature.value)
            : null,
          attitudeId: this.examForm.controls.attitudeId.value
            ? Number(this.examForm.controls.attitudeId.value)
            : null,
          bodyConditionId: this.examForm.controls.bodyConditionId.value
            ? Number(this.examForm.controls.bodyConditionId.value)
            : null,
          dehydrationId: this.examForm.controls.dehydrationId.value
            ? Number(this.examForm.controls.dehydrationId.value)
            : null,
          mucousMembraneColourId: this.examForm.controls.mucousMembraneColourId
            .value
            ? Number(this.examForm.controls.mucousMembraneColourId.value)
            : null,
          mucousMembraneTextureId: this.examForm.controls
            .mucousMembraneTextureId.value
            ? Number(this.examForm.controls.mucousMembraneTextureId.value)
            : null,
          treatmentInstructions:
            this.examForm.controls.treatmentInstructions.value.map((ti) => ({
              instructions: ti.instructions || '',
            })),
          treatmentMedications:
            this.examForm.controls.treatmentMedications.value.map((tm) => ({
              quantityValue: Number(tm.quantityValue),
              quantityUnit: tm.quantityUnit || '',
              medicationId: Number(tm.medicationId),
              medicationConcentrationId: Number(tm.medicationConcentrationId),
              administrationMethodId: Number(tm.administrationMethodId),
              comments: tm.comments || '',
            })),
          comments: this.examForm.controls.comments.value || '',
        },
        outcome:
          this.exam !== null
            ? 'none' // if updating the exam, always set outcome to none
            : (this.examForm.controls.outcome.value as Outcome),
        dispositionReasonIds: (
          this.examForm.controls.dispositionReasonIds.value || []
        ).length
          ? this.examForm.controls.dispositionReasonIds.value.map((x) =>
              Number(x.reason!),
            )
          : undefined,
        penId: this.examForm.controls.penId.value
          ? Number(this.examForm.controls.penId.value)
          : undefined,
      }),
    );
  }

  ngOnInit() {
    this.store.dispatch(getAttitudes());
    this.store.dispatch(getBodyConditions());
    this.store.dispatch(getDehydrations());
    this.store.dispatch(getMucousMembraneColours());
    this.store.dispatch(getMucousMembraneTextures());
    this.store.dispatch(getSpecies());
    this.store.dispatch(getDispositionReasons());
    this.store.dispatch(getAdministrationMethods());
    this.store.dispatch(getAreas());
    this.prepareEdit();
    this.addDispositionReason();
  }

  private prepareEdit() {
    if (!this.exam) return;
    this.exam.treatmentInstructions.map((_) => this.addTreatmentInstruction());
    this.exam.treatmentMedications.map((_) => this.addTreatmentMedication());
    this.examForm.patchValue({
      speciesId: String(this.exam.species.id),
      speciesVariantId: String(this.exam.speciesVariant.id),
      sex: String(this.exam.sex),
      weightValue: this.exam.weightValue ? String(this.exam.weightValue) : null,
      weightUnit: this.exam.weightUnit ? String(this.exam.weightUnit) : null,
      temperature: this.exam.temperature ? String(this.exam.temperature) : null,
      attitudeId: this.exam.attitude?.id ? String(this.exam.attitude.id) : null,
      bodyConditionId: this.exam.bodyCondition?.id
        ? String(this.exam.bodyCondition.id)
        : null,
      dehydrationId: this.exam.dehydration?.id
        ? String(this.exam.dehydration.id)
        : null,
      mucousMembraneColourId: this.exam.mucousMembraneColour?.id
        ? String(this.exam.mucousMembraneColour.id)
        : null,
      mucousMembraneTextureId: this.exam.mucousMembraneTexture?.id
        ? String(this.exam.mucousMembraneTexture.id)
        : null,
      treatmentInstructions: this.exam.treatmentInstructions.map((ti) => ({
        instructions: ti.instructions || '',
      })),
      treatmentMedications: this.exam.treatmentMedications.map((tm) => ({
        quantityValue: String(tm.quantityValue),
        quantityUnit: tm.quantityUnit || '',
        medicationId: String(tm.medication.id),
        medicationConcentrationId: String(tm.medicationConcentration.id),
        administrationMethodId: String(tm.administrationMethod.id),
        comments: tm.comments || '',
      })),
      comments: this.exam.comments || '',
    });
  }
}
