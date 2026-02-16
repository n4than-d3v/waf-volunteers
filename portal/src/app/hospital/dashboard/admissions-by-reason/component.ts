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
  selector: 'hospital-dashboard-admissions-by-reason',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class HospitalDashboardAdmissionsByReasonComponent
  implements AfterViewInit, OnDestroy
{
  @Input({ required: true }) dashboard!: Dashboard;

  private chart: Chart | null = null;
  private viewReady = false;

  @ViewChild('admissionReasonBar')
  admissionReasonBar?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.viewReady = true;
    this.tryBuildChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private tryBuildChart() {
    if (!this.viewReady || !this.dashboard) return;

    if (!this.admissionReasonBar?.nativeElement) {
      setTimeout(() => this.tryBuildChart(), 0);
      return;
    }

    this.chart?.destroy();
    this.buildAdmissionReasonBar();
  }

  private buildAdmissionReasonBar() {
    const years = Object.keys(this.dashboard.patientsByAdmissionReason);

    // Collect all reasons present in the dataset
    const reasonsSet = new Set<string>();
    years.forEach((year) => {
      Object.keys(this.dashboard.patientsByAdmissionReason[+year]).forEach(
        (r) => reasonsSet.add(r),
      );
    });

    const reasons = Array.from(reasonsSet).sort();

    const datasets: ChartDataset<'bar'>[] = years.map((year, idx) => {
      const map = this.dashboard.patientsByAdmissionReason[+year];

      const values = reasons.map((r) => map[r] ?? 0);

      const colour = getColor(idx);

      return {
        label: year,
        data: values,
        backgroundColor: hexToRgba(colour, 0.6),
      };
    });

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: { labels: reasons, datasets },
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
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
      },
    };

    this.chart = new Chart(this.admissionReasonBar!.nativeElement, config);
  }
}
