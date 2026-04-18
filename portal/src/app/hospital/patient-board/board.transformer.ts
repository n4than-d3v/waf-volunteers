import {
  PatientBoard,
  PatientBoardArea,
  PatientBoardAreaPen,
  PatientBoardAreaPenFeeding,
  PatientBoardAreaPenTaskDetails,
  ReadOnlyWrapper,
} from '../state';
import { FoodSection } from './food-section';
import {
  PatientBoardAreaPenFeedingSummaryVm,
  PatientBoardAreaPenFeedingVm,
  PatientBoardAreaPenTaskDetailsVm,
  PatientBoardAreaPenVm,
  PatientBoardAreaVm,
  PatientBoardSummaryFeedingItemVm,
  PatientBoardSummaryFeedingVm,
  PatientBoardSummaryVariantVm,
  PatientBoardSummaryVm,
  PatientBoardVm,
  Shift,
} from './board.model';
import {
  formatFractionalNumber,
  PatientBoardAreaDisplayType,
} from '../../admin/hospital/state';

function isPenExpandable(pen: PatientBoardAreaPen, shift: Shift): boolean {
  if (!pen.feedings?.length) return false;
  return pen.feedings.some((f) => shouldShowTime(f.time, shift));
}

function shouldShowPen(
  pen: PatientBoardAreaPen,
  showPensNeedCleaning: boolean,
  showPensWithoutFeeds: boolean,
  showTickedOffPens: boolean,
  shift: Shift,
): boolean {
  if (pen.needsCleaning) {
    return showPensNeedCleaning;
  }

  let response = true;

  if (!showTickedOffPens) {
    if (shift === 'M') response = !pen.morning;
    else if (shift === 'A') response = !pen.afternoon;
    else if (shift === 'E') response = !pen.evening;
  }

  if (!showPensWithoutFeeds) {
    response = response && hasFeeds(pen.feedings || [], shift);
  }

  return response;
}

function nowToDecimal(): number {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  // Convert current time to decimal hours for easier comparison
  return currentHour + currentMinutes / 60;
}

// Helper: convert "HH:MM" string to decimal hours
function timeToDecimal(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}

function shouldShowTime(time: string, shift: Shift): boolean {
  if (/^\d{2}:\d{2}$/.test(time)) {
    const targetDecimal = timeToDecimal(time);

    if (shift === 'M') return 0 <= targetDecimal && targetDecimal < 13;
    if (shift === 'A') return 13 <= targetDecimal && targetDecimal < 18;
    if (shift === 'E') return 18 <= targetDecimal && targetDecimal < 24;

    return false;
  }

  return true;
}

function getNextFeeding(
  feedings: PatientBoardAreaPenFeeding[],
  shift: Shift,
): { isNow: boolean; time: string } | null {
  const nowDecimal = nowToDecimal();
  const next = feedings
    .filter((f) => /^\d{2}:\d{2}$/.test(f.time))
    .filter((f) => shouldShowTime(f.time, shift))
    .map((f) => ({ ...f, decimalTime: timeToDecimal(f.time) }))
    .filter((f) => f.decimalTime >= nowDecimal - 0.25)
    .sort((a, b) => a.decimalTime - b.decimalTime);
  if (next.length === 0) return null;
  return { isNow: isNow(next[0].time), time: next[0].time };
}

function isNow(time: string): boolean {
  if (/^\d{2}:\d{2}$/.test(time)) {
    const nowDecimal = nowToDecimal();
    const timeDecimal = timeToDecimal(time);
    return Math.abs(nowDecimal - timeDecimal) < 0.25;
  }
  return false;
}

function hasFeeds(
  feedings: PatientBoardAreaPenFeeding[],
  shift: Shift,
): boolean {
  return feedings.some((time) => shouldShowTime(time.time, shift));
}

function hasForceFeeds(feedings: PatientBoardAreaPenTaskDetails[]): boolean {
  return feedings.some((item) => item.forceFeed);
}

function getForceFeeds(
  feedings: PatientBoardAreaPenFeeding[],
  shift: Shift,
): string[] {
  const times = feedings.filter((time) => shouldShowTime(time.time, shift));
  if (!times.some((time) => hasForceFeeds(time.details))) return [];

  const result = new Set<string>();

  times.forEach((time) => {
    time.details
      .filter((item) => item.forceFeed)
      .forEach((item) => {
        const description = `${item.quantityEach} ${item.quantityUnit} ${item.food}`;
        result.add(description.trim());
      });
  });
  return [...result];
}

function groupFeeding(
  items: PatientBoardAreaPenTaskDetailsVm[],
): FoodSection[] {
  const hasDishes = items.some((item) => !!item.dish);
  const hasTopUps = items.some((item) => item.topUp);

  const map = new Map<string, FoodSection>();

  for (const item of items) {
    const key = `${item.dish}__${item.topUp}__${item.forceFeed}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        title: (
          (item.forceFeed
            ? '(Force feed)'
            : item.topUp
              ? '(Top up)'
              : hasTopUps
                ? '(Feed)'
                : '') +
          ' ' +
          (item.dish ? item.dish : hasDishes ? 'Separate' : '')
        ).trim(),
        details: [],
      });
    }

    map.get(key)!.details.push(item);
  }

  return Array.from(map.values());
}

function anyOtherBoards(areas: PatientBoardArea[]): boolean {
  return areas.some(
    (area) =>
      area.displayType === PatientBoardAreaDisplayType.SummarisePatients,
  );
}

export function transform(
  wrapper: ReadOnlyWrapper<PatientBoard>,
  showPensWithoutFeeds: boolean,
  showPensNeedCleaning: boolean,
  showTickedOffPens: boolean,
  shift: Shift,
): PatientBoardVm | null {
  if (!wrapper.data) return null;

  return {
    board: { ...wrapper.data.board },
    areas: (wrapper.data.areas || []).map(
      (area): PatientBoardAreaVm => ({
        ...area,
        pens: (area.pens || []).map(
          (pen): PatientBoardAreaPenVm => ({
            ...pen,
            shouldShow: shouldShowPen(
              pen,
              showPensNeedCleaning,
              showPensWithoutFeeds,
              showTickedOffPens,
              shift,
            ),
            nextFeeding: getNextFeeding(pen.feedings || [], shift),
            forceFeeds: getForceFeeds(pen.feedings || [], shift),
            isExpandable: isPenExpandable(pen, shift),
            isMorningRelevant: isPenExpandable(pen, 'M'),
            isAfternoonRelevant: isPenExpandable(pen, 'A'),
            isEveningRelevant: isPenExpandable(pen, 'E'),
            feedings: (pen.feedings || []).map(
              (feeding): PatientBoardAreaPenFeedingVm => {
                const details = (feeding.details || []).map(
                  (detail): PatientBoardAreaPenTaskDetailsVm => ({
                    ...detail,
                    quantityEachFormatted: formatFractionalNumber(
                      detail.quantityEach,
                    ),
                    quantityTotalFormatted: formatFractionalNumber(
                      detail.quantityTotal,
                    ),
                  }),
                );
                return {
                  ...feeding,
                  details,
                  isNow: isNow(feeding.time),
                  shouldShow: shouldShowTime(feeding.time, shift),
                  hasForceFeeds: hasForceFeeds(feeding.details),
                  groups: groupFeeding(details),
                };
              },
            ),
            feedingSummaries: (pen.feedingSummaries || []).map(
              (summary): PatientBoardAreaPenFeedingSummaryVm => ({
                ...summary,
                quantityEachFormatted: formatFractionalNumber(
                  summary.quantityEach,
                ),
              }),
            ),
          }),
        ),
      }),
    ),
    summary: (wrapper.data.summary || []).map(
      (summary): PatientBoardSummaryVm => ({
        ...summary,
        variants: (summary.variants || []).map(
          (variant): PatientBoardSummaryVariantVm => ({
            ...variant,
            feeding: (variant.feeding || []).map(
              (feeding): PatientBoardSummaryFeedingVm => ({
                ...feeding,
                items: (feeding.items || []).map(
                  (item): PatientBoardSummaryFeedingItemVm => ({
                    ...item,
                    quantityValueFormatted: formatFractionalNumber(
                      item.quantityValue,
                    ),
                  }),
                ),
                shouldShow: shouldShowTime(feeding.time, shift),
              }),
            ),
          }),
        ),
      }),
    ),
    anyOtherBoards: anyOtherBoards(wrapper.data.areas),
    isMorning: shift === 'M',
    isAfternoon: shift === 'A',
    isEvening: shift === 'E',
  };
}
