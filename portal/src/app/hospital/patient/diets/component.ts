import { Component, Input, OnInit } from '@angular/core';
import { Diet, Patient, PatientStatus, ReadOnlyWrapper } from '../../state';
import { AsyncPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDiets } from '../../selectors';
import { getDiets, updatePatientBasicDetails } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { toHTML } from 'ngx-editor';

@Component({
  selector: 'hospital-patient-diets',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
})
export class HospitalPatientDietsComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;

  diets$: Observable<ReadOnlyWrapper<Diet[]>>;

  PatientStatus = PatientStatus;

  dietForm = new FormGroup({
    dietId: new FormControl('', [Validators.required]),
  });

  adding = false;
  attemptedSave = false;
  saving = false;

  removing: number | null = null;

  constructor(private store: Store) {
    this.diets$ = this.store.select(selectDiets);
  }

  ngOnInit() {
    this.store.dispatch(getDiets());
  }

  reset() {
    this.adding = false;
    this.attemptedSave = false;
    this.dietForm.reset();
  }

  private getUpdateAction() {
    return {
      patientId: this.patient.id,
      name: this.patient.name || '',
      uniqueIdentifier: this.patient.uniqueIdentifier || '',
      speciesId: this.patient.species!.id,
      speciesVariantId: this.patient.speciesVariant!.id,
      tagIds: this.patient.tags.map((x) => x.id),
      dietIds: this.patient.diets.map((x) => x.id),
    };
  }

  getHtml(value: string | undefined) {
    return toHTML(JSON.parse(value || '{}'));
  }

  add() {
    this.attemptedSave = true;
    if (!this.dietForm.valid) return;
    this.saving = true;
    const update = this.getUpdateAction();
    this.store.dispatch(
      updatePatientBasicDetails({
        ...update,
        dietIds: [...update.dietIds, Number(this.dietForm.value.dietId!)],
      })
    );
  }

  remove(id: number) {
    this.removing = id;
    const update = this.getUpdateAction();
    this.store.dispatch(
      updatePatientBasicDetails({
        ...update,
        dietIds: update.dietIds.filter((x) => x != id),
      })
    );
  }
}
