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
} from './board.model';
import {
  formatFractionalNumber,
  PatientBoardAreaDisplayType,
} from '../../admin/hospital/state';

function isPenExpandable(pen: PatientBoardAreaPen): boolean {
  if (!pen.feedings?.length) return false;
  return pen.feedings.some((f) => shouldShowTime(f.time));
}

function shouldShowPen(
  pen: PatientBoardAreaPen,
  showPensNeedCleaning: boolean,
  showPensWithoutFeeds: boolean,
): boolean {
  if (pen.needsCleaning) {
    return showPensNeedCleaning;
  }
  if (!showPensWithoutFeeds) {
    return hasFeeds(pen.feedings || []);
  }
  return true;
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

function shouldShowTime(time: string): boolean {
  const nowDecimal = nowToDecimal();

  if (/^\d{2}:\d{2}$/.test(time)) {
    const targetDecimal = timeToDecimal(time);

    if (0 <= nowDecimal && nowDecimal < 13)
      return 0 <= targetDecimal && targetDecimal < 13;
    if (13 <= nowDecimal && nowDecimal < 18)
      return 13 <= targetDecimal && targetDecimal < 18;
    if (18 <= nowDecimal && nowDecimal < 24)
      return 18 <= targetDecimal && targetDecimal < 24;

    return false;
  }

  return true;
}

function isCurrentShift(shift: 'M' | 'A' | 'E'): boolean {
  const nowDecimal = nowToDecimal();

  if (shift === 'M' && 0 <= nowDecimal && nowDecimal < 13) return true;
  if (shift === 'A' && 13 <= nowDecimal && nowDecimal < 18) return true;
  if (shift === 'E' && 18 <= nowDecimal && nowDecimal < 24) return true;
  return false;
}

function getNextFeeding(
  feedings: PatientBoardAreaPenFeeding[],
): { isNow: boolean; time: string } | null {
  const nowDecimal = nowToDecimal();
  const next = feedings
    .filter((f) => /^\d{2}:\d{2}$/.test(f.time))
    .filter((f) => shouldShowTime(f.time))
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

function hasFeeds(feedings: PatientBoardAreaPenFeeding[]): boolean {
  return feedings.some((time) => shouldShowTime(time.time));
}

function hasForceFeeds(feedings: PatientBoardAreaPenTaskDetails[]): boolean {
  return feedings.some((item) => item.forceFeed);
}

function getForceFeeds(feedings: PatientBoardAreaPenFeeding[]): string[] {
  const times = feedings.filter((time) => shouldShowTime(time.time));
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
            ),
            nextFeeding: getNextFeeding(pen.feedings || []),
            forceFeeds: getForceFeeds(pen.feedings || []),
            isExpandable: isPenExpandable(pen),
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
                  shouldShow: shouldShowTime(feeding.time),
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
                shouldShow: shouldShowTime(feeding.time),
              }),
            ),
          }),
        ),
      }),
    ),
    anyOtherBoards: anyOtherBoards(wrapper.data.areas),
    isMorning: isCurrentShift('M'),
    isAfternoon: isCurrentShift('A'),
    isEvening: isCurrentShift('E'),
  };
}
