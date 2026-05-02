import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  getBoardCustomPens,
  getBoards,
  upsertBoardCustomPen,
} from '../actions';
import { map, Observable } from 'rxjs';
import {
  convertTime,
  formatFeeding,
  PatientBoard,
  PatientBoardCustomPen,
  unconvertTime,
  Wrapper,
} from '../state';
import { selectBoardCustomPens, selectBoards } from '../selectors';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SpinnerComponent } from '../../../shared/spinner/component';

@Component({
  selector: 'admin-hospital-board-custom-pens',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminHospitalBoardCustomPensComponent implements OnInit {
  boards$: Observable<Wrapper<PatientBoard>>;
  boardCustomPens$: Observable<Wrapper<PatientBoardCustomPen>>;

  adding = false;
  editing: number | null = null;
  boardId: number = 0;

  form = new FormGroup({
    boardId: new FormControl(0),
    title: new FormControl(''),
    body: new FormControl(''),
    tags: new FormControl(''),
    expiresOn: new FormControl(''),
    tasks: new FormArray<
      FormGroup<{
        foodOrTask: FormControl<string | null>;
        timeKind: FormControl<string | null>;
        time: FormControl<string | null>;
        quantityValue: FormControl<string | null>;
        quantityUnit: FormControl<string | null>;
        notes: FormControl<string | null>;
        dish: FormControl<string | null>;
        topUp: FormControl<boolean | null>;
      }>
    >([]),
  });

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectBoards);
    this.boardCustomPens$ = this.store.select(selectBoardCustomPens).pipe(
      map((wrapper) => ({
        ...wrapper,
        data: wrapper.data.map((pen) => ({
          ...pen,
          tasks: pen.tasks.map((task) => ({
            ...task,
            food: {
              id: 0,
              name: task.foodOrTask,
            },
          })),
        })),
      })),
    );
  }

  addFeedingGuidance() {
    const formGroup = new FormGroup({
      foodOrTask: new FormControl('', [Validators.required]),
      timeKind: new FormControl('Specific'),
      time: new FormControl('', [Validators.required]),
      quantityValue: new FormControl('', [Validators.required]),
      quantityUnit: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
      dish: new FormControl(''),
      topUp: new FormControl(false),
    });
    this.form.controls.tasks.push(formGroup);
    return formGroup;
  }

  removeFeedingGuidance(index: number) {
    this.form.controls.tasks.removeAt(index);
  }

  beginUpdate(pen: PatientBoardCustomPen) {
    this.cancel();

    this.editing = pen.id;
    this.boardId = pen.exposeBoardId;

    this.form.controls.boardId.setValue(pen.exposeBoardId);
    this.form.controls.title.setValue(pen.title);
    this.form.controls.body.setValue(pen.body.join(', '));
    this.form.controls.tags.setValue(pen.tags.join(', '));
    this.form.controls.expiresOn.setValue(pen.expiresOn);

    this.form.controls.tasks.clear();

    if (pen.tasks?.length) {
      pen.tasks.forEach((fg) => {
        const formGroup = this.addFeedingGuidance();
        formGroup.controls.foodOrTask.setValue(fg.foodOrTask);
        formGroup.controls.quantityUnit.setValue(fg.quantityUnit);
        formGroup.controls.quantityValue.setValue(fg.quantityValue.toString());
        if (fg.time.includes('Every')) {
          formGroup.controls.timeKind.setValue('Every');
          formGroup.controls.time.setValue(unconvertTime(fg.time).toString());
        } else {
          formGroup.controls.time.setValue(fg.time);
        }
        formGroup.controls.notes.setValue(fg.notes);
        formGroup.controls.dish.setValue(fg.dish);
        formGroup.controls.topUp.setValue(fg.topUp);
      });
    }

    window.scroll(0, 0);
  }

  save() {
    this.store.dispatch(
      upsertBoardCustomPen({
        id: this.adding ? null : this.editing,
        boardId: Number(this.form.controls.boardId.value),
        title: this.form.controls.title.value || '',
        body: this.form.controls.body.value
          ? this.form.controls.body.value.split(',').map((s) => s.trim())
          : [],
        tags: this.form.controls.tags.value
          ? this.form.controls.tags.value.split(',').map((s) => s.trim())
          : [],
        expiresOn: this.form.controls.expiresOn.value || null,
        tasks:
          this.form.value.tasks?.map((fg: any) => ({
            foodOrTask: fg.foodOrTask,
            time: convertTime(fg.time),
            quantityValue: Number(fg.quantityValue),
            quantityUnit: fg.quantityUnit,
            notes: fg.notes,
            dish: fg.dish,
            topUp: fg.topUp || false,
          })) || [],
      }),
    );
    this.cancel();
  }

  cancel() {
    this.adding = false;
    this.editing = null;
    this.form.controls.tasks.clear();
    this.form.reset();
  }

  ngOnInit() {
    this.store.dispatch(getBoards());
    this.store.dispatch(getBoardCustomPens());
  }

  formatFeeding = formatFeeding;
}
