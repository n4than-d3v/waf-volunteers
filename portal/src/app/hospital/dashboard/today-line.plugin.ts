import moment from 'moment';

export const todayLinePlugin = {
  id: 'todayLine',
  afterDatasetsDraw(chart: any) {
    const {
      ctx,
      chartArea: { top, bottom },
      scales,
    } = chart;
    const xScale = scales.x;

    const todayLabel = moment().format('D MMM');

    const index = chart.data.labels.indexOf(todayLabel);
    if (index < 0) return;

    const x = xScale.getPixelForValue(index);

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.lineWidth = 1;
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    ctx.restore();
  },
};
