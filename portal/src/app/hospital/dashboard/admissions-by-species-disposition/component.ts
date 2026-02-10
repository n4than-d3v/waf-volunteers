import { Component, Input, OnInit } from '@angular/core';
import { Dashboard } from '../../state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'hospital-dashboard-admissions-by-species-disposition',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['../table.scss', './component.scss'],
  imports: [FormsModule],
})
export class HospitalDashboardAdmissionsBySpeciesDispositionComponent implements OnInit {
  @Input({ required: true }) dashboard!: Dashboard;

  years: number[] = [];
  species: string[] = [];

  filter = '';

  dispositions = [
    'Released',
    'Transferred',
    'Dead on arrival',
    'Died before 24 hrs',
    'Died after 24 hrs',
    'Euthanised before 24 hrs',
    'Euthanised after 24 hrs',
  ];

  ngOnInit() {
    this.years = Object.keys(this.dashboard.patientsBySpeciesDisposition).map(
      (year) => +year,
    );
    this.species = [
      ...Object.values(this.dashboard.patientsBySpeciesDisposition).reduce(
        (acc, yearMap) => {
          Object.keys(yearMap).forEach((species) => acc.add(species));
          return acc;
        },
        new Set<string>(),
      ),
    ];
  }

  showSpecies(species: string): boolean {
    return species.toLowerCase().includes(this.filter.toLowerCase());
  }
}
