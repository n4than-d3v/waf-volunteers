import { Component, Input, OnInit } from '@angular/core';
import {
  Tag,
  Patient,
  PatientStatus,
  ReadOnlyWrapper,
  Task,
} from '../../state';
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
import { selectTags, selectUpdateTags } from '../../selectors';
import { getTags, updatePatientBasicDetails } from '../../actions';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { toHTML } from 'ngx-editor';

@Component({
  selector: 'hospital-patient-tags',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe, SpinnerComponent, FormsModule, ReactiveFormsModule],
})
export class HospitalPatientTagsComponent implements OnInit {
  @Input({ required: true }) patient!: Patient;
  @Input({ required: true }) isVet!: boolean;

  tags$: Observable<ReadOnlyWrapper<Tag[]>>;

  task$: Observable<Task>;

  PatientStatus = PatientStatus;

  tagForm = new FormGroup({
    tagId: new FormControl('', [Validators.required]),
  });

  adding = false;
  attemptedSave = false;
  saving = false;

  constructor(private store: Store) {
    this.tags$ = this.store.select(selectTags);
    this.task$ = this.store.select(selectUpdateTags);
  }

  ngOnInit() {
    this.store.dispatch(getTags());
  }

  reset() {
    this.saving = false;
    this.adding = false;
    this.attemptedSave = false;
    this.tagForm.reset();
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
    if (!this.tagForm.valid) return;
    this.saving = true;
    const update = this.getUpdateAction();
    this.store.dispatch(
      updatePatientBasicDetails({
        ...update,
        update: 'tags',
        tagIds: [...update.tagIds, Number(this.tagForm.value.tagId!)],
      })
    );
    this.reset();
  }

  remove(id: number) {
    const update = this.getUpdateAction();
    this.store.dispatch(
      updatePatientBasicDetails({
        ...update,
        update: 'tags',
        tagIds: update.tagIds.filter((x) => x != id),
      })
    );
    this.reset();
  }
}
