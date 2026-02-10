import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';

import {
  Chart,
  ChartConfiguration,
  ChartDataset,
  registerables,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

import { getColor, hexToRgba } from '../colour-helper';
import { Dashboard } from '../../state';

Chart.register(...registerables, zoomPlugin);

@Component({
  selector: 'hospital-dashboard-admissions-by-species-rescues',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class HospitalDashboardAdmissionsBySpeciesRescuesComponent
  implements AfterViewInit, OnDestroy
{
  @Input({ required: true }) dashboard!: Dashboard;

  private chart: Chart | null = null;
  private viewReady = false;

  @ViewChild('speciesRescueBar')
  speciesRescueBar?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.viewReady = true;
    this.tryBuildChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private tryBuildChart() {
    if (!this.viewReady || !this.dashboard) return;

    if (!this.speciesRescueBar?.nativeElement) {
      setTimeout(() => this.tryBuildChart(), 0);
      return;
    }

    this.chart?.destroy();
    this.buildSpeciesRescueBar();
  }

  private buildSpeciesRescueBar() {
    const years = Object.keys(this.dashboard.speciesRescues);

    // Collect all species across all years
    const speciesSet = new Set<string>();
    years.forEach((year) => {
      Object.keys(this.dashboard.speciesRescues[+year]).forEach((s) =>
        speciesSet.add(s),
      );
    });

    const species = Array.from(speciesSet).sort();

    const datasets: ChartDataset<'bar'>[] = [];

    years.forEach((year, idx) => {
      const map = this.dashboard.speciesRescues[+year];
      const colour = getColor(idx);

      const rescuedValues = species.map((s) => map[s]?.[0] ?? 0);
      const broughtInValues = species.map((s) => map[s]?.[1] ?? 0);

      datasets.push(
        {
          label: `${year} – Rescued`,
          data: rescuedValues,
          borderColor: colour,
          backgroundColor: hexToRgba(colour, 0.35),
          borderWidth: 2,
          stack: 'total',
          maxBarThickness: 25,
        },
        {
          label: `${year} – Brought in`,
          data: broughtInValues,
          borderColor: colour,
          backgroundColor: hexToRgba(colour, 0.15),
          borderWidth: 2,
          stack: 'total',
          maxBarThickness: 25,
        },
      );
    });

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: species,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              afterTitle: (items) => {
                if (!items.length) return '';

                const dataIndex = items[0].dataIndex;
                const datasets = items[0].chart.data
                  .datasets as ChartDataset<'bar'>[];

                let rescued = 0;
                let broughtIn = 0;

                datasets.forEach((ds) => {
                  const value = (ds.data as number[])[dataIndex] ?? 0;

                  if (ds.label?.includes('Rescued')) {
                    rescued += value;
                  } else if (ds.label?.includes('Brought in')) {
                    broughtIn += value;
                  }
                });

                const total = rescued + broughtIn;
                if (!total) return '0% rescued';

                const percent = Math.round((rescued / total) * 100);

                return `${percent}% rescued`;
              },
            },
          },
          zoom: {
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'x',
            },
            pan: {
              enabled: true,
              mode: 'x',
              modifierKey: 'ctrl',
            },
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
            beginAtZero: true,
          },
        },
      },
    };

    this.chart = new Chart(this.speciesRescueBar!.nativeElement, config);
  }
}
