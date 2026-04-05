import { Component, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, filter, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAttachment } from '../../selectors';
import { hideEmbeddedContent } from '../../actions';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {
  supportedEmbeddedAudioTypes,
  supportedEmbeddedImageTypes,
  supportedEmbeddedVideoTypes,
} from '../../state';

@Component({
  selector: 'hospital-patient-view-attachment',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [AsyncPipe],
})
export class HospitalPatientViewAttachmentComponent implements OnDestroy {
  attachment$: Observable<{
    url: SafeResourceUrl;
    contentType: string;
  } | null>;

  isImage$: Observable<boolean>;
  isVideo$: Observable<boolean>;
  isAudio$: Observable<boolean>;

  private currentBlobUrl: string | null = null;

  constructor(
    private store: Store,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {
    this.isImage$ = this.store.select(selectAttachment).pipe(
      filter((attachment) => !!attachment),
      map((attachment) =>
        supportedEmbeddedImageTypes.includes(attachment!.contentType),
      ),
    );

    this.isVideo$ = this.store.select(selectAttachment).pipe(
      filter((attachment) => !!attachment),
      map((attachment) =>
        supportedEmbeddedVideoTypes.includes(attachment!.contentType),
      ),
    );

    this.isAudio$ = this.store.select(selectAttachment).pipe(
      filter((attachment) => !!attachment),
      map((attachment) =>
        supportedEmbeddedAudioTypes.includes(attachment!.contentType),
      ),
    );

    this.attachment$ = this.store.select(selectAttachment).pipe(
      filter((attribute) => !!attribute),
      switchMap((attribute) => {
        return this.http
          .get(attribute.url, {
            responseType: 'blob',
          })
          .pipe(
            map((blob) => {
              if (this.currentBlobUrl) {
                URL.revokeObjectURL(this.currentBlobUrl);
              }

              const blobUrl = URL.createObjectURL(blob);
              this.currentBlobUrl = blobUrl;

              return {
                url: this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl),
                contentType: attribute.contentType,
              };
            }),
          );
      }),
    );
  }

  ngOnDestroy() {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
    }

    this.store.dispatch(hideEmbeddedContent());
  }
}
