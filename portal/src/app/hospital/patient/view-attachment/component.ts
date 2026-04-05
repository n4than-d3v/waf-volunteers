import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export class HospitalPatientViewAttachmentComponent
  implements OnInit, OnDestroy
{
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

  ngOnInit() {
    window.scroll(0, 0);
  }

  ngOnDestroy() {
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
    }

    this.store.dispatch(hideEmbeddedContent());
  }

  @ViewChild('mediaImage') mediaImage!: ElementRef<HTMLImageElement>;
  @ViewChild('zoomOverlay') zoomOverlay!: ElementRef<HTMLDivElement>;
  @ViewChild('zoomImg') zoomImg!: ElementRef<HTMLImageElement>;

  zoomFactor = 2; // how much to zoom

  moveZoom(event: MouseEvent) {
    const img = this.mediaImage.nativeElement;
    const overlay = this.zoomOverlay.nativeElement;
    const zoomed = this.zoomImg.nativeElement;
    const zoomFactor = 3;

    const wrapperRect = img.parentElement!.getBoundingClientRect();

    // Mouse position relative to wrapper
    const x = event.clientX - wrapperRect.left;
    const y = event.clientY - wrapperRect.top;

    const rect = img.getBoundingClientRect();

    // Don't show overlay if outside image
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      overlay.style.display = 'none';
      return;
    }

    overlay.style.display = 'block';

    // Natural size of image
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Set zoomed img size
    zoomed.style.width = `${naturalWidth * zoomFactor}px`;
    zoomed.style.height = `${naturalHeight * zoomFactor}px`;

    // Ratio of cursor inside image
    const ratioX = x / rect.width;
    const ratioY = y / rect.height;

    // Position zoomed image so the cursor area is centered in overlay
    const zoomedX =
      -ratioX * naturalWidth * zoomFactor + overlay.offsetWidth / 2;
    const zoomedY =
      -ratioY * naturalHeight * zoomFactor + overlay.offsetHeight / 2;

    zoomed.style.left = `${zoomedX}px`;
    zoomed.style.top = `${zoomedY}px`;

    // Position overlay relative to wrapper
    let overlayX = x + 2;
    let overlayY = y + 2;

    // Optional: keep overlay inside wrapper
    if (overlayX + overlay.offsetWidth > wrapperRect.width) {
      overlayX = x - overlay.offsetWidth - 20;
    }
    if (overlayY + overlay.offsetHeight > wrapperRect.height) {
      overlayY = y - overlay.offsetHeight - 20;
    }

    overlay.style.left = `${overlayX}px`;
    overlay.style.top = `${overlayY}px`;
  }

  hideZoom() {
    this.zoomOverlay.nativeElement.style.display = 'none';
  }
}
