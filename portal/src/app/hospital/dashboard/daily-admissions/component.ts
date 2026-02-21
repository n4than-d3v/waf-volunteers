import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { getDashboard } from '../../actions';
import { Observable, Subscription } from 'rxjs';
import { Dashboard, ReadOnlyWrapper } from '../../state';
import { selectDashboard } from '../../selectors';
import { SpinnerComponent } from '../../../shared/spinner/component';
import { AsyncPipe } from '@angular/common';
import moment from 'moment';

import {
  Chart,
  ChartConfiguration,
  ChartDataset,
  registerables,
} from 'chart.js';
import { todayLinePlugin } from '../today-line.plugin';
import zoomPlugin from 'chartjs-plugin-zoom';
import { getColor, hexToRgba } from '../colour-helper';

Chart.register(...registerables, zoomPlugin, todayLinePlugin);

@Component({
  selector: 'hospital-dashboard-daily-admissions',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class HospitalDashboardChartAdmissionsComponent
  implements AfterViewInit, OnDestroy
{
  @Input({ required: true }) dashboard!: Dashboard;

  private chart: Chart | null = null;
  private viewReady = false;

  @ViewChild('admissionsLine') admissionsLine?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.viewReady = true;
    this.tryBuildChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private tryBuildChart() {
    if (!this.viewReady || !this.dashboard) return;

    if (!this.admissionsLine?.nativeElement) {
      setTimeout(() => this.tryBuildChart(), 0);
      return;
    }

    this.chart?.destroy();
    this.buildAdmissionsLine();
  }

  private buildYearDayLabels(): string[] {
    const labels: string[] = [];
    const start = moment('2020-01-01'); // leap-year reference
    const end = moment('2020-12-31');

    while (start.isSameOrBefore(end)) {
      labels.push(start.format('D MMM')); // "1 Jan"
      start.add(1, 'day');
    }

    return labels;
  }

  private buildAdmissionsLine() {
    const years = Object.keys(this.dashboard.patientAdmissionsByDate);

    const labels = this.buildYearDayLabels();

    const datasets: ChartDataset<'line'>[] = years.map((year, idx) => {
      const dateMap = this.dashboard.patientAdmissionsByDate[+year];
      const dayMap = new Map<string, number>();

      Object.entries(dateMap).forEach(([date, value]) => {
        const dayKey = date.slice(5); // "YYYY-MM-DD" -> "MM-DD"
        dayMap.set(dayKey, value);
      });

      const values = labels.map((label) => {
        const yesterdayKey = moment(`2020 ${label}`, 'YYYY D MMM')
          .add(-1, 'day')
          .format('MM-DD');
        const dayKey = moment(`2020 ${label}`, 'YYYY D MMM').format('MM-DD');
        return dayMap.get(dayKey) ?? dayMap.get(yesterdayKey) ?? 0;
      });

      const colour = getColor(idx);

      return {
        label: year,
        data: values,
        borderColor: colour,
        backgroundColor: hexToRgba(colour, 0.25),
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.25,
      };
    });

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: { labels, datasets },
      plugins: [todayLinePlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
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
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            type: 'category',
            ticks: {
              autoSkip: true,
            },
          },
        },
      },
    };

    this.chart = new Chart(this.admissionsLine!.nativeElement, config);
  }
}
