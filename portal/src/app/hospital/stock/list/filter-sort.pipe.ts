import { Pipe, PipeTransform } from '@angular/core';
import { Stock } from '../state';

@Pipe({
  name: 'filterSort',
  standalone: true,
  pure: true,
})
export class FilterSortPipe implements PipeTransform {
  transform(
    items: Stock[],
    filterValue: string,
    sortKey: 'medication' | 'brand',
  ): any[] {
    if (!items) return [];

    let result = [...items];

    if (filterValue && filterValue.trim() !== '') {
      const lower = filterValue.toLowerCase();

      result = result.filter(
        (item) =>
          item.medication?.toLowerCase().includes(lower) ||
          item.brand?.toLowerCase().includes(lower),
      );
    }

    if (sortKey) {
      result.sort((a, b) => {
        const aValue = (a[sortKey] || '').toString().toLowerCase();
        const bValue = (b[sortKey] || '').toString().toLowerCase();

        return aValue.localeCompare(bValue);
      });
    }

    return result;
  }
}
