import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day',
  standalone: true,
})
export class DayPipe implements PipeTransform {
  private readonly st = [1, 21, 31];
  private readonly nd = [2, 22];
  private readonly rd = [3, 23];

  transform(value: string): string {
    if (!value) {
      return '';
    }
    let ordinal = 'th';
    const day = new Date(value).getDate();
    if (this.st.includes(day)) ordinal = 'st';
    if (this.nd.includes(day)) ordinal = 'nd';
    if (this.rd.includes(day)) ordinal = 'rd';
    return `${day}${ordinal}`;
  }
}
