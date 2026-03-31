import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import { getWeightUnit, Patient, PatientWeight } from '../../state';
import moment from 'moment';

import {
  Chart,
  ChartConfiguration,
  ChartDataset,
  registerables,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { todayLinePlugin } from '../../dashboard/today-line.plugin';
import { formatFractionalNumber } from '../../../admin/hospital/state';

Chart.register(...registerables, zoomPlugin, todayLinePlugin);

@Component({
  selector: 'hospital-patient-weight-history',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class HospitalPatientWeightHistoryComponent
  implements AfterViewInit, OnDestroy
{
  @Input({ required: true }) patient!: Patient;

  private chart: Chart | null = null;
  private viewReady = false;

  @ViewChild('weightLine') weightLine?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.viewReady = true;
    this.tryBuildChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private getWeightG(weight: PatientWeight) {
    return getWeightUnit(weight.weightUnit) === 'g'
      ? weight.weightValue
      : weight.weightValue * 1000;
  }

  private getDuration(startDate: string, endDate: string) {
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).startOf('day');

    const months = end.diff(start, 'months');
    start.add(months, 'months');

    const days = end.diff(start, 'days');

    const parts = [];
    if (months) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (days) parts.push(`${days} day${days !== 1 ? 's' : ''}`);

    return parts.join(', ') || '0 days';
  }

  getSummaryMessage(): {
    status: 'same' | 'gained' | 'lost';
    weightChange: number;
    duration: string;
  } | null {
    if (!this.patient.latestWeight || !this.patient.initialWeight) return null;
    const latest = this.getWeightG(this.patient.latestWeight);
    const initial = this.getWeightG(this.patient.initialWeight);
    const duration = this.getDuration(
      this.patient.initialWeight.date,
      this.patient.latestWeight.date,
    );

    if (latest === initial)
      return {
        status: 'same',
        weightChange: 0,
        duration,
      };

    return latest > initial
      ? {
          status: 'gained',
          weightChange: latest - initial,
          duration,
        }
      : {
          status: 'lost',
          weightChange: initial - latest,
          duration,
        };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['patient'] && this.patient) {
      this.tryBuildChart();
    }
  }

  private updateWeightChart(weights: PatientWeight[]) {
    if (!this.chart) return;

    const sorted = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const labels = sorted.map((w) => moment(w.date).format('D MMM YYYY'));
    const data = sorted.map((w) => this.getWeightG(w));

    this.chart.data.labels = labels;
    this.chart.data.datasets[0].data = data;

    // Optional: update colors if needed
    this.chart.update();
  }

  private tryBuildChart() {
    if (!this.viewReady || !this.patient) return;

    if (!this.weightLine?.nativeElement) {
      setTimeout(() => this.tryBuildChart(), 0);
      return;
    }

    this.chart?.destroy();
    this.buildWeightChart(this.patient.weightHistory);
  }

  formatNumber = formatFractionalNumber;

  private buildWeightChart(weights: PatientWeight[]) {
    const sorted = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const labels = sorted.map((w) => moment(w.date).format('D MMM YYYY'));
    const data = sorted.map((w) => this.getWeightG(w));

    const dataset: ChartDataset<'line'> = {
      label: 'Weight (g)',
      data,
      borderColor: '#7ca661', // default green
      backgroundColor: 'rgba(183, 219, 245, 0.2)',
      borderWidth: 2,
      fill: true,
      tension: 0.25,
      pointRadius: 0,
      pointHoverRadius: 0,
      segment: {
        borderColor: (ctx) => {
          // ctx.p0 = start point, ctx.p1 = end point of the segment
          return (ctx.p1.parsed.y || 0) > (ctx.p0.parsed.y || 0)
            ? '#7ca661'
            : '#a8555a';
        },
        backgroundColor: (ctx) => {
          // optional: semi-transparent fill based on gain/loss
          return (ctx.p1.parsed.y || 0) > (ctx.p0.parsed.y || 0)
            ? 'rgba(124, 166, 97, 0.2)' // green fill
            : 'rgba(168, 85, 90, 0.2)'; // red fill
        },
      },
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [dataset],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            callbacks: {
              label: (ctx) => {
                const currentWeight = ctx.parsed.y || 0;
                const previousWeight =
                  ctx.dataIndex > 0
                    ? (ctx.dataset.data[ctx.dataIndex - 1] as number)
                    : null;

                const currentDate = ctx.chart.data.labels![
                  ctx.dataIndex
                ] as string;
                const previousDate =
                  ctx.dataIndex > 0
                    ? (ctx.chart.data.labels![ctx.dataIndex - 1] as string)
                    : null;

                let changeText = '';

                if (previousWeight === null) {
                  return [
                    `${this.formatNumber(currentWeight)} g`,
                    '',
                    '⚖️ Initial weight',
                  ];
                }

                const diff = currentWeight - previousWeight;
                if (diff > 0) {
                  changeText = `📈 Gained ${this.formatNumber(diff)} g`;
                } else if (diff < 0) {
                  changeText = `📉 Lost ${this.formatNumber(Math.abs(diff))} g`;
                } else {
                  changeText = '⚖️ No change';
                }

                const duration =
                  '📅 Over ' + this.getDuration(previousDate!, currentDate);

                return [
                  `${this.formatNumber(currentWeight)} g`,
                  '',
                  changeText,
                  duration,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            type: 'category',
            ticks: { autoSkip: true, maxRotation: 90, minRotation: 0 },
          },
          y: {
            title: { display: true, text: 'Weight (g)' },
          },
        },
      },
    };

    this.chart = new Chart(this.weightLine!.nativeElement, config);
  }

  getWeightUnit = getWeightUnit;
}
