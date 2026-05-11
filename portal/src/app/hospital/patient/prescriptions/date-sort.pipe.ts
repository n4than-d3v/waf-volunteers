import { Pipe, PipeTransform } from '@angular/core';
import { Administration } from '../../state';

@Pipe({
  name: 'sortByAdministered',
  standalone: true,
})
export class SortByAdministeredPipe implements PipeTransform {
  transform(value: Administration[]): Administration[] {
    if (!value) {
      return [];
    }

    return Object.values(value).sort((a, b) => {
      const dateA = new Date(a.administered).getTime();
      const dateB = new Date(b.administered).getTime();

      return dateB - dateA;
    });
  }
}
