import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
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
export class HospitalPatientAutocompleteComponent implements OnInit {
  @Input({ required: true }) id!: string;
  @Input() inline: boolean = false;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: string;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) items!: {
    id: number;
    display: string;
    aka?: string;
  }[];

  search = '';
  open = false;
  searchResults: { id: number; display: string; aka?: string }[] = [];

  item: { id: number; display: string; aka?: string } | null = null;

  private getNthInList(nth: number) {
    return document.querySelector(
      `#${this.id}-selector ul li:nth-child(${nth})`,
    ) as any;
  }

  ngOnInit() {
    const value = this.formGroup.value[this.control];
    if (!value) return;
    const initialItem = this.items.find((x) => x.id == value);
    if (!initialItem) return;
    this.selectItem(initialItem, {});
  }

  currentSelection = 0;
  arrowKeyPress(event: KeyboardEvent) {
    if (!event.keyCode) return;
    if (event.keyCode === 40) {
      this.currentSelection++;
      this.getNthInList(this.currentSelection)?.focus();
      event.preventDefault();
    } else if (event.keyCode === 38) {
      this.currentSelection--;
      this.getNthInList(this.currentSelection)?.focus();
      event.preventDefault();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode) {
      if (event.keyCode == 13 /* Enter */) {
        this.getNthInList(1)?.click();
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
    this.searchResults = this.items.filter(
      (x) =>
        x.display.toUpperCase().includes(search.toUpperCase()) ||
        (x.aka && x.aka.toUpperCase().includes(search.toUpperCase())),
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
