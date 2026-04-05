import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  Attachment,
  getWeightUnit,
  HomeCareMessage,
  HomeCareRequest,
  ReadOnlyWrapper,
  Task,
} from '../../hospital/state';
import {
  selectAcceptHomeCareRequest,
  selectHomeCareMessages,
  selectMyActiveHomeCareRequests,
  selectOutstandingHomeCareRequests,
  selectSendHomeCareMessage,
} from './selectors';
import {
  acceptHomeCareRequest,
  downloadHomeCareMessageAttachment,
  getHomeCareMessages,
  getMyActiveHomeCareRequests,
  getOutstandingHomeCareRequests,
  sendHomeCareMessage,
} from './actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/spinner/component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'volunteer-home-care',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class VolunteerHomeCareComponent implements OnInit {
  outstanding$: Observable<ReadOnlyWrapper<HomeCareRequest[]>>;
  active$: Observable<ReadOnlyWrapper<HomeCareRequest[]>>;
  messages$: Observable<ReadOnlyWrapper<HomeCareMessage[]>>;

  acceptRequest$: Observable<Task>;
  sendMessage$: Observable<Task>;

  accepting: number | null = null;
  acceptForm = new FormGroup({
    pickupDate: new FormControl('', [Validators.required]),
    pickupTime: new FormControl('', [Validators.required]),
  });

  viewingMessages: number | null = null;
  addingMessage = false;
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
    weightValue: new FormControl(''),
    weightUnit: new FormControl('1'),
    files: new FormControl<File[] | null>(null),
  });

  saving = false;
  attemptedSave = false;

  constructor(private store: Store) {
    this.outstanding$ = this.store.select(selectOutstandingHomeCareRequests);
    this.active$ = this.store.select(selectMyActiveHomeCareRequests);
    this.messages$ = this.store.select(selectHomeCareMessages);
    this.acceptRequest$ = this.store.select(selectAcceptHomeCareRequest);
    this.sendMessage$ = this.store.select(selectSendHomeCareMessage);
  }

  getWeightUnit = getWeightUnit;

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    this.messageForm.controls.files.setValue(Array.from(files));
  }

  download(message: HomeCareMessage, attachment: Attachment) {
    this.store.dispatch(
      downloadHomeCareMessageAttachment({
        messageId: message.id,
        attachment,
      }),
    );
  }

  reset() {
    this.addingMessage = false;
    this.saving = false;
    this.accepting = null;
    this.attemptedSave = false;
    this.acceptForm.reset();
    this.messageForm.reset();
    this.messageForm.controls.weightUnit.setValue('1');
  }

  accept() {
    this.attemptedSave = true;
    if (!this.acceptForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      acceptHomeCareRequest({
        homeCareRequestId: Number(this.accepting!),
        pickup:
          this.acceptForm.value.pickupDate! +
          'T' +
          this.acceptForm.value.pickupTime! +
          'Z',
      }),
    );
    this.reset();
  }

  openMessages(homeCareRequestId: number) {
    this.viewingMessages = homeCareRequestId;
    this.store.dispatch(
      getHomeCareMessages({
        homeCareRequestId,
      }),
    );
  }

  sendMessage() {
    this.attemptedSave = true;
    if (!this.messageForm.valid) return;
    this.saving = true;
    this.store.dispatch(
      sendHomeCareMessage({
        homeCareRequestId: this.viewingMessages!,
        message: this.messageForm.value.message!,
        weightValue: this.messageForm.value.weightValue
          ? Number(this.messageForm.value.weightValue)
          : null,
        weightUnit:
          this.messageForm.value.weightUnit &&
          this.messageForm.value.weightValue
            ? Number(this.messageForm.value.weightUnit)
            : null,
        files: this.messageForm.value.files || [],
      }),
    );
    this.reset();
  }

  ngOnInit() {
    this.store.dispatch(getOutstandingHomeCareRequests());
    this.store.dispatch(getMyActiveHomeCareRequests());
  }
}
