import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'hospital-patient-details-pokemon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class HospitalPatientDetailsPokemonImageComponent {
  @Input()
  set name(value: string | null) {
    const pokemonName = value?.trim().toLowerCase();

    if (!pokemonName) {
      this.imageUrl$ = of(null);
      return;
    }

    this.imageUrl$ = this.http
      .get<any>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .pipe(
        map(
          (p) =>
            p.sprites.other['official-artwork'].front_default ??
            p.sprites.front_default,
        ),
        catchError(() => of(null)),
      );
  }

  imageUrl$: Observable<string | null>;

  constructor(private http: HttpClient) {
    this.imageUrl$ = of(null);
  }
}
