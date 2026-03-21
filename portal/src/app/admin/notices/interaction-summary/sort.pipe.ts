import { Pipe, PipeTransform } from '@angular/core';
import { InteractionSummary } from '../state';

@Pipe({
  name: 'interactionSort',
  standalone: true,
})
export class InteractionSortPipe implements PipeTransform {
  transform(
    users: InteractionSummary[] | null,
    sort: 'name' | 'most' | 'least',
  ): InteractionSummary[] {
    if (!users) return [];

    const sorted = [...users];

    switch (sort) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));

      case 'most':
        return sorted.sort((a, b) => {
          const diff = this.readPercent(b) - this.readPercent(a);
          return diff !== 0 ? diff : a.name.localeCompare(b.name);
        });

      case 'least':
        return sorted.sort((a, b) => {
          const diff = this.readPercent(a) - this.readPercent(b);
          return diff !== 0 ? diff : a.name.localeCompare(b.name);
        });

      default:
        return sorted;
    }
  }

  private readPercent(user: InteractionSummary): number {
    return user.total ? user.read / user.total : 0;
  }
}
