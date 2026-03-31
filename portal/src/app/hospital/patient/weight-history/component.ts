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
import 'chartjs-adapter-moment';

import {
  Chart,
  ChartConfiguration,
  ChartDataset,
  registerables,
  ScatterDataPoint,
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

  private previousWeights: string = '{}';

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

  private tryBuildChart() {
    if (!this.viewReady || !this.patient) return;

    if (!this.weightLine?.nativeElement) {
      setTimeout(() => this.tryBuildChart(), 0);
      return;
    }

    if (JSON.stringify(this.patient.weightHistory) === this.previousWeights) {
      return;
    }

    this.previousWeights = JSON.stringify(this.patient.weightHistory);

    this.chart?.destroy();
    this.buildWeightChart(this.patient.weightHistory);
  }

  formatNumber = formatFractionalNumber;

  private buildWeightChart(weights: PatientWeight[]) {
    const sorted = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const data: ScatterDataPoint[] = sorted.map((w) => ({
      x: new Date(w.date).getTime(),
      y: this.getWeightG(w),
    }));

    const dataset: ChartDataset<'line'> = {
      label: 'Weight (g)',
      data,
      parsing: false,
      borderColor: '#7ca661',
      backgroundColor: 'rgba(183, 219, 245, 0.2)',
      borderWidth: 2,
      fill: true,
      tension: 0.25,
      pointRadius: 2,
      pointHoverRadius: 2,
      pointBackgroundColor: 'rgb(110, 110, 110)',
      pointBorderColor: 'rgb(110, 110, 110)',
      segment: {
        borderColor: (ctx) => {
          return (ctx.p1.parsed.y || 0) > (ctx.p0.parsed.y || 0)
            ? '#7ca661'
            : '#a8555a';
        },
        backgroundColor: (ctx) => {
          return (ctx.p1.parsed.y || 0) > (ctx.p0.parsed.y || 0)
            ? 'rgba(124, 166, 97, 0.2)'
            : 'rgba(168, 85, 90, 0.2)';
        },
      },
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
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
                const current = ctx.raw as { x: number | Date; y: number };
                const previous =
                  ctx.dataIndex > 0
                    ? (ctx.dataset.data[ctx.dataIndex - 1] as {
                        x: number | Date;
                        y: number;
                      })
                    : null;

                const currentWeight = current.y;
                const previousWeight = previous?.y ?? null;

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

                const currentDate = moment(current.x);
                const previousDate = moment(previous!.x);

                const duration =
                  '📅 Over ' +
                  this.getDuration(
                    previousDate.toISOString(),
                    currentDate.toISOString(),
                  );

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
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'D MMM YYYY',
            },
            ticks: {
              autoSkip: true,
            },
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
