import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'hospital-patient-autocomplete',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [FormsModule, ReactiveFormsModule],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class HospitalPatientAutocompleteComponent {
  @Input({ required: true }) id!: string;
  @Input() inline: boolean = false;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: string;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) items!: { id: number; display: string }[];

  search = '';
  open = false;
  searchResults: { id: number; display: string }[] = [];

  item: { id: number; display: string } | null = null;

  private getFirstInList() {
    const first = document.querySelector(
      `#${this.id}-selector ul li:first-child`
    ) as any;
    return first;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode) {
      if (event.keyCode == 13 /* Enter */) {
        this.getFirstInList()?.click();
        event.preventDefault();
        return;
      } else if (event.keyCode == 9 /* Tab */) {
        this.getFirstInList()?.focus();
        event.preventDefault();
        return;
      }
    }
  }

  onKeyUp(event: KeyboardEvent) {
    this.performSearch((event.target as any).value);
  }

  performSearch(search: string) {
    this.open = !!search;
    if (!search) return;
    this.searchResults = this.items.filter((x) =>
      x.display.toUpperCase().includes(search.toUpperCase())
    );
  }

  clearSelection(event: any) {
    if (event.keyCode && event.keyCode !== 13) return;
    this.item = null;
    this.search = '';
    this.formGroup.controls[this.control].setValue('');
  }

  selectItem(item: { id: number; display: string }, event: any) {
    if (event.keyCode && event.keyCode !== 13) return;
    this.item = item;
    this.open = false;
    this.formGroup.controls[this.control].setValue(this.item.id);
  }
}
