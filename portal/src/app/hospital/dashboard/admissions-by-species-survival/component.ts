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
  selector: 'hospital-dashboard-admissions-by-species-survival',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class HospitalDashboardAdmissionsBySpeciesSurvivalComponent
  implements AfterViewInit, OnDestroy
{
  @Input({ required: true }) dashboard!: Dashboard;

  private chart: Chart | null = null;
  private viewReady = false;

  @ViewChild('scatterCanvas')
  scatterCanvas?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.viewReady = true;
    this.tryBuildChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private tryBuildChart() {
    if (!this.viewReady || !this.dashboard) return;

    if (!this.scatterCanvas?.nativeElement) {
      setTimeout(() => this.tryBuildChart(), 0);
      return;
    }

    this.chart?.destroy();
    this.buildScatter();
  }

  private buildScatter() {
    const years = Object.keys(this.dashboard.patientsBySpecies);

    // collect all species across all years
    const speciesSet = new Set<string>();
    years.forEach((year) => {
      Object.keys(this.dashboard.patientsBySpecies[+year]).forEach((s) =>
        speciesSet.add(s),
      );
    });

    const species = Array.from(speciesSet).sort();

    // Use top 20 species by admissions (aggregate across all years)
    const totals = species.map((s) => {
      return years.reduce(
        (acc, y) => acc + (this.dashboard.patientsBySpecies[+y][s] ?? 0),
        0,
      );
    });

    const sortedSpecies = species
      .map((s, i) => ({ s, total: totals[i] }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 20)
      .map((x) => x.s);

    const datasets: ChartDataset<'scatter'>[] = [];

    years.forEach((year, idx) => {
      const color = getColor(idx);

      const data = sortedSpecies.map((s) => {
        const admissions = this.dashboard.patientsBySpecies[+year][s] ?? 0;
        const disp =
          this.dashboard.patientsBySpeciesDisposition[+year][s] ?? [];

        const survived = (disp[0] ?? 0) + (disp[1] ?? 0);
        const survivalRate = admissions ? survived / admissions : 0;

        return {
          x: admissions,
          y: survivalRate,
          r: Math.max(3, Math.sqrt(admissions)), // size based on admissions
          label: s,
        };
      });

      datasets.push({
        label: `${year}`,
        data,
        backgroundColor: hexToRgba(color, 0.65),
        borderColor: color,
        pointHoverRadius: 8,
      });
    });

    const config: ChartConfiguration<'scatter'> = {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              title: (items) => items[0].dataset.label,
              label: (item) => {
                const data = item.raw as any;
                const admissions = data.x;
                const survival = Math.round(data.y * 100);
                const label = data.label;
                return `${label}: ${admissions} admissions, ${survival}% survival`;
              },
            },
          },
          zoom: {
            limits: {
              x: {
                min: 0,
                max:
                  Math.max(
                    ...datasets.flatMap((d) => d.data.map((p) => (p as any).x)),
                  ) + 50,
              },
              y: { min: 0, max: 1 },
            },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'xy',
            },
            pan: {
              enabled: true,
              mode: 'xy',
              modifierKey: 'ctrl',
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: 'Admissions' },
          },
          y: {
            beginAtZero: true,
            max: 1,
            title: { display: true, text: 'Survival rate' },
            ticks: {
              callback: (val) => `${Math.round((val as number) * 100)}%`,
            },
          },
        },
      },
    };

    this.chart = new Chart(this.scatterCanvas!.nativeElement, config);
  }
}
