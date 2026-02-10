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
  selector: 'hospital-dashboard-admissions-by-disposition',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class HospitalDashboardAdmissionsByDispositionComponent
  implements AfterViewInit, OnDestroy
{
  @Input({ required: true }) dashboard!: Dashboard;

  private chart: Chart | null = null;
  private viewReady = false;

  @ViewChild('dispositionBar') dispositionBar?: ElementRef<HTMLCanvasElement>;

  dispositions = [
    'Released',
    'Transferred',
    'Dead on arrival',
    'Died before 24 hrs',
    'Died after 24 hrs',
    'Euthanised before 24 hrs',
    'Euthanised after 24 hrs',
  ];

  ngAfterViewInit() {
    this.viewReady = true;
    this.tryBuildChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private tryBuildChart() {
    if (!this.viewReady || !this.dashboard) return;

    if (!this.dispositionBar?.nativeElement) {
      setTimeout(() => this.tryBuildChart(), 0);
      return;
    }

    this.chart?.destroy();
    this.buildDispositionBar();
  }

  private buildDispositionBar() {
    const years = Object.keys(this.dashboard.patientsByDisposition);

    const datasets: ChartDataset<'bar'>[] = years.map((year, idx) => {
      const map = this.dashboard.patientsByDisposition[+year];

      const values = this.dispositions.map((d, i) => map[i + 1] ?? 0);

      const colour = getColor(idx);

      return {
        label: year,
        data: values,
        borderColor: colour, // FULL opacity border
        backgroundColor: hexToRgba(colour, 0.35), // TRANSPARENT fill
        borderWidth: 2, // same as admissions
      };
    });

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: { labels: this.dispositions, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          zoom: {
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'x',
            },
            pan: { enabled: true, mode: 'x', modifierKey: 'ctrl' },
          },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { stacked: false },
          y: { stacked: false, beginAtZero: true },
        },
      },
    };

    this.chart = new Chart(this.dispositionBar!.nativeElement, config);
  }
}
