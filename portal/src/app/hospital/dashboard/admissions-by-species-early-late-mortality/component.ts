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
  selector: 'hospital-dashboard-admissions-by-species-early-late-mortality',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class HospitalDashboardAdmissionsBySpeciesEarlyLateMortalityComponent
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

    // top 20 species by admissions
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

        const diedBefore = disp[3] ?? 0;
        const diedAfter = disp[4] ?? 0;
        const euthBefore = disp[5] ?? 0;
        const euthAfter = disp[6] ?? 0;

        const beforeTotal = diedBefore + euthBefore;
        const afterTotal = diedAfter + euthAfter;

        const beforePct = admissions ? beforeTotal / admissions : 0;
        const afterPct = admissions ? afterTotal / admissions : 0;

        return {
          x: beforePct,
          y: afterPct,
          r: Math.max(3, Math.sqrt(admissions)),
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
                const before = Math.round(data.x * 100);
                const after = Math.round(data.y * 100);
                return `${data.label}: ${before}% before 24h, ${after}% after 24h`;
              },
            },
          },
          zoom: {
            limits: {
              x: { min: 0, max: 1 },
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
            max: 1,
            title: { display: true, text: '% died before 24h' },
            ticks: {
              callback: (val) => `${Math.round((val as number) * 100)}%`,
            },
          },
          y: {
            beginAtZero: true,
            max: 1,
            title: { display: true, text: '% died after 24h' },
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
