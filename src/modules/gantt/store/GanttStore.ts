import {
  ConvertTimeUtil,
  FULL_DATE_FORMAT,
  HEADER_HEIGHT,
  UtcDate,
  clamp,
  debounce,
  type Nullable,
} from '@/shared';
import type { TFunction } from 'i18next';
import { makeAutoObservable, toJS } from 'mobx';
import type { CSSProperties, Key } from 'react';
import { createRef } from 'react';
import {
  BAR_HEIGHT,
  Bar,
  COLLAPSED_TABLE_WIDTH,
  END_DATE_KEY,
  EPOCH_OFFSET_2020,
  EPOCH_OFFSET_2023,
  GanttAxisUtil,
  GanttUtil,
  ROW_HEIGHT,
  SELECTION_BAR_TOP,
  START_DATE_KEY,
  TOP_PADDING,
  ganttStorageService,
  getGanttViewConfigs,
  type Dependence,
  type GanttItem,
  type GanttProps as GanttProperties,
  type GanttRecord,
  type GanttRecordType,
  type GanttView,
  type GanttViewConfig,
  type Major,
  type Minor,
  type MoveType,
} from '../shared';

class GanttStore {
  t: TFunction;

  boardId: number;

  type: GanttRecordType;

  height: number;
  width: number;
  viewWidth: number;
  rowHeight: number;
  bodyWidth: number;
  translateX: number;
  tableWidth: number;

  data: GanttItem[] = [];
  originData: GanttRecord[] = [];
  dependencies: Dependence[] = [];

  viewConfig: GanttViewConfig;
  viewConfigs: GanttViewConfig[];

  endDateKey = END_DATE_KEY;
  startDateKey = START_DATE_KEY;

  mainElementRef = createRef<HTMLDivElement>();
  chartElementRef = createRef<HTMLDivElement>();

  draggingKey: Nullable<Key> = null;
  draggingType: Nullable<MoveType> = null;

  clientX = 0;
  scrollTop = 0;
  scrolling = false;
  autoScrollPos = 0;
  scrollTimer: Nullable<number> = null;

  collapseStep = 0;

  selectionIndicatorTop = 0;
  showSelectionIndicator = false;
  selectedBar: Nullable<Bar> = null;

  isPointerPress = false;
  gestureKeyPress = false;

  private _wheelTimer: Nullable<number> = null;

  onUpdate: Nullable<GanttProperties['onUpdate']> = null;

  readonly GANTT_CHART_ID = 'amwork_GanttChart';

  constructor({
    activeView,
    boardId,
    type,
    t,
  }: {
    activeView: GanttView;
    boardId: number;
    type: GanttRecordType;
    t: TFunction;
  }) {
    this.t = t;

    this.boardId = boardId;

    this.type = type;

    this.width = 1320;
    this.height = 418;

    this.viewWidth = 704;
    this.tableWidth = ganttStorageService.getTableWidth() ?? this.defaultTableWidth;
    this.bodyWidth = this.width;
    this.rowHeight = ROW_HEIGHT;

    const viewConfigs = getGanttViewConfigs(type);
    const viewConfig = viewConfigs.find(sc => sc.view === activeView);

    if (!viewConfig)
      throw new Error(
        `Failed to initialize GanttStore, unable to find ${activeView} or viewConfigs array is empty`
      );

    this.viewConfig = viewConfig;
    this.viewConfigs = viewConfigs;

    this.translateX =
      (this.getStartDate(this.viewConfig.view).timestampMs - this.epochOffset) / this.pxUnitAmp;

    makeAutoObservable(this);
  }

  get epochOffset(): number {
    return this.viewConfig.view === 'fifteen-minutes' ? EPOCH_OFFSET_2023 : EPOCH_OFFSET_2020;
  }

  get defaultTableWidth(): number {
    return this.width / 2;
  }

  get barList(): Bar[] {
    // in ms
    const minStamp = 11 * this.pxUnitAmp;

    const baseTop = TOP_PADDING + this.rowHeight / 2 - BAR_HEIGHT / 2;
    const topStep = this.rowHeight;

    const dateTextFormat = (startX: number): string => {
      switch (this.viewConfig.view) {
        case 'fifteen-minutes':
        case 'hour':
          return UtcDate.fromTimestampMs(startX * this.pxUnitAmp + this.epochOffset).format(
            'MMM DD, HH:mm'
          );

        case 'day':
        case 'week':
        case 'month':
          return UtcDate.fromTimestampMs(startX * this.pxUnitAmp + this.epochOffset).format(
            'MMMM DD'
          );

        case 'quarter':
        case 'half-year':
          return UtcDate.fromTimestampMs(startX * this.pxUnitAmp + this.epochOffset).displayLong();
      }
    };

    const getDateWidth = ({ startX, endX }: { startX: number; endX: number }): number => {
      const startDate = UtcDate.fromTimestampMs(startX * this.pxUnitAmp);
      const endDate = UtcDate.fromTimestampMs(endX * this.pxUnitAmp);

      switch (this.viewConfig.view) {
        case 'fifteen-minutes': {
          const minutesDiff = Math.round(startDate.diffMinutes(endDate));

          const remainder = minutesDiff % 15;

          // Return the closest number divisible by 15 to the minutesDiff,
          // WHY? Let's say start date is 14:00, record is hour long, end date in this
          // case will be 14:59:59, but we want to show 60 minutes, not 59, because
          // technically it's 60 minutes long minus 1 second
          return remainder > 15 / 2 ? minutesDiff + 15 - remainder : minutesDiff - remainder;
        }

        case 'hour':
          return Math.round(startDate.diffHours(endDate));

        default:
          return Math.round(startDate.diffDays(endDate));
      }
    };

    const flattenedData = GanttUtil.deepFlatten({ array: this.data });

    return flattenedData.map<Bar>((record, idx) => {
      const valid = record.startDate && record.endDate && record.startDate.isBefore(record.endDate);

      let startX, endX;

      switch (this.viewConfig.view) {
        case 'fifteen-minutes': {
          endX = record.endDate?.timestampMs;
          startX = record.startDate?.timestampMs;

          break;
        }

        case 'hour': {
          endX = record.endDate?.endOfHour().timestampMs;
          startX = record.startDate?.startOfHour().timestampMs;

          break;
        }

        default: {
          endX = record.endDate?.endOfDay().timestampMs;
          startX = record.startDate?.startOfDay().timestampMs;
        }
      }

      if (endX && startX && Math.abs(endX - startX) < minStamp) {
        switch (this.viewConfig.view) {
          case 'fifteen-minutes': {
            // For 15 minutes view, ensure at least one 15 minutes is represented
            endX = record.endDate?.endOfMinute().addMilliseconds(minStamp).timestampMs;

            break;
          }

          case 'hour': {
            // For hour view, ensure at least one hour is represented
            endX = record.endDate?.endOfHour().addMilliseconds(minStamp).timestampMs;

            break;
          }

          default:
            // For other views, adjust to ensure at least one day is represented
            endX = record.endDate?.endOfDay().addMilliseconds(minStamp).timestampMs;
        }
      }

      const width = endX && startX ? (valid ? (endX - startX) / this.pxUnitAmp : 0) : 0;

      const translateY = baseTop + idx * topStep;
      const translateX = endX && startX && valid ? (startX - this.epochOffset) / this.pxUnitAmp : 0;

      const bar = new Bar({
        key: record.key,
        width,
        item: record,
        translateY,
        translateX,
        loading: false,
        stepGesture: 'end',
        label: record.title,
        invalidDateRange: !valid,
        record: record.record,
        group: record.group,
        index: record.index,
        parent: record.parent,
        collapsed: record.collapsed,
        depth: record.depth ?? 0,
        childrenCount: record.children ? record.children.length : 0,
        getDateWidth,
        dateTextFormat,
      });

      record.bar = bar;

      return bar;
    });
  }

  get todayTranslateX(): number {
    switch (this.viewConfig.view) {
      case 'fifteen-minutes': {
        const now = UtcDate.now();

        const minutes = now.minutes;
        const remainder = minutes % 15;

        return (now.subtractMinutes(remainder).timestampMs - this.epochOffset) / this.pxUnitAmp;
      }

      case 'hour':
        return (UtcDate.now().startOfHour().timestampMs - this.epochOffset) / this.pxUnitAmp;

      default:
        return (UtcDate.now().startOfDay().timestampMs - this.epochOffset) / this.pxUnitAmp;
    }
  }

  get scrollBarWidth(): number {
    const MIN_WIDTH = 30;

    return Math.max((this.viewWidth / this.scrollWidth) * 160, MIN_WIDTH);
  }

  get scrollLeft(): number {
    const rate = this.viewWidth / this.scrollWidth;
    const currentDate = UtcDate.fromTimestampMs(this.translateAmp);

    const half = (this.viewWidth - this.scrollBarWidth) / 2;
    const viewScrollLeft =
      half +
      rate *
        (this.getTranslateXByDate(currentDate) -
          this.getTranslateXByDate(this.getStartDate(this.viewConfig.view)));

    return Math.min(Math.max(viewScrollLeft, 0), this.viewWidth - this.scrollBarWidth);
  }

  get scrollWidth(): number {
    const init = this.viewWidth + 200;

    return Math.max(
      Math.abs(
        this.viewWidth +
          this.translateX -
          this.getTranslateXByDate(this.getStartDate(this.viewConfig.view))
      ),
      init
    );
  }

  get bodyClientHeight(): number {
    // 1px –> border
    return this.height - HEADER_HEIGHT - 1;
  }

  get bodyScrollHeight(): number {
    let height = this.barList.length * this.rowHeight + TOP_PADDING;

    if (height < this.bodyClientHeight) height = this.bodyClientHeight;

    return height;
  }

  // Milliseconds in 1px
  get pxUnitAmp(): number {
    return this.viewConfig.value * 1000;
  }

  // Current start time in ms
  get translateAmp(): number {
    const { translateX } = this;

    return this.pxUnitAmp * translateX;
  }

  get majorAmpList(): Major[] {
    return GanttAxisUtil.getMajorList({
      t: this.t,
      pxUnitAmp: this.pxUnitAmp,
      view: this.viewConfig.view,
      translateAmp: this.translateAmp - 100000,
      durationAmp: this.getDurationAmp(),
      epochOffset: this.epochOffset,
    });
  }

  get minorAmpList(): Minor[] {
    return GanttAxisUtil.getMinorList({
      t: this.t,
      pxUnitAmp: this.pxUnitAmp,
      view: this.viewConfig.view,
      translateAmp: this.translateAmp,
      durationAmp: this.getDurationAmp(),
      epochOffset: this.epochOffset,
    });
  }

  get currentMajorAmpDate(): UtcDate {
    const currentDate = UtcDate.fromTimestampMs(
      this.translateX * this.pxUnitAmp + this.epochOffset
    );

    switch (this.viewConfig.view) {
      case 'fifteen-minutes':
      case 'hour':
        return currentDate.startOfDay();

      default:
        return currentDate.startOfMonth();
    }
  }

  get nextMajorAmpDate(): UtcDate {
    switch (this.viewConfig.view) {
      case 'fifteen-minutes':
      case 'hour':
        return this.currentMajorAmpDate.addDays(1);

      default:
        return this.currentMajorAmpDate.addMonths(1);
    }
  }

  get prevMajorAmpDate(): UtcDate {
    switch (this.viewConfig.view) {
      case 'fifteen-minutes':
      case 'hour':
        return this.currentMajorAmpDate.subtractDays(1);

      default:
        return this.currentMajorAmpDate.subtractMonths(1);
    }
  }

  get draggingBar(): Nullable<Bar> {
    return this.barList.find(b => b.key === this.draggingKey) ?? null;
  }

  get canCreateRecordFromCurrentSelection(): boolean {
    const record = this.findSelectionBarAssociatedRecord();

    if (!record) return false;

    return !record.startDate || !record.endDate;
  }

  scrollToNextMajorAmp = (): void => {
    this.setTranslateX((this.nextMajorAmpDate.timestampMs - this.epochOffset) / this.pxUnitAmp);
  };

  scrollToPrevMajorAmp = (): void => {
    this.setTranslateX((this.prevMajorAmpDate.timestampMs - this.epochOffset) / this.pxUnitAmp);
  };

  getStartDate = (type: GanttView): UtcDate => {
    switch (type) {
      case 'fifteen-minutes':
        return UtcDate.now().subtractHours(2).startOfHour();

      case 'hour':
        return UtcDate.now().subtractDays(1);

      default:
        return UtcDate.now().subtractDays(10);
    }
  };

  setData = (data: GanttRecord[]): void => {
    this.originData = data;

    this.data = GanttUtil.transverseData({
      data,
      endDateKey: this.endDateKey,
      startDateKey: this.startDateKey,
    });
  };

  toggleCollapse = (): void => {
    switch (this.collapseStep) {
      case 0:
        this.tableWidth = COLLAPSED_TABLE_WIDTH;
        break;

      case 1:
        this.tableWidth = 0;
        break;

      case 2:
        this.tableWidth = COLLAPSED_TABLE_WIDTH;
        break;

      case 3:
        this.tableWidth = this.defaultTableWidth;
        break;
    }

    this.syncWidth();

    this.collapseStep = (this.collapseStep + 1) % 4;
  };

  syncWidth = (): void => {
    this.viewWidth = this.width - this.tableWidth;
  };

  resizeTable = (val: number): void => {
    this.tableWidth = clamp({
      min: 0,
      val,
      max: this.width - 300,
    });

    this.syncWidth();

    if (this.tableWidth === 0) this.collapseStep = 3;
  };

  setOnUpdate = (onUpdate: GanttProperties['onUpdate']): void => {
    this.onUpdate = onUpdate;
  };

  setDependencies = (dependencies: Dependence[]): void => {
    this.dependencies = dependencies;
  };

  setChartCursor = (type: CSSProperties['cursor']): void => {
    const chart = document.getElementById(this.GANTT_CHART_ID);

    if (chart && type) chart.style.cursor = type;
  };

  handlePanMove = (translateX: number): void => {
    this.scrolling = true;

    this.setTranslateX(translateX);
  };

  handlePanEnd = (): void => {
    this.scrolling = false;
  };

  syncSize = (size: { width?: number; height?: number }): void => {
    if (!size.height || !size.width) return;

    const { width, height } = size;

    if (this.height !== height) this.height = height;

    if (this.width !== width) {
      this.width = width;
      this.initWidth();
    }
  };

  initWidth = (): void => {
    this.tableWidth = ganttStorageService.getTableWidth() || this.defaultTableWidth;
    this.viewWidth = this.width - this.tableWidth;

    // Diagram width cannot be less than 200
    if (this.viewWidth < 200) {
      this.viewWidth = 200;
      this.tableWidth = this.width - this.viewWidth;
    }
  };

  setTranslateX = (translateX: number): void => {
    this.translateX = Math.max(translateX, 0);
  };

  scrollToToday = (): void => {
    const translateX = this.todayTranslateX - this.viewWidth / 2;

    this.setTranslateX(translateX);
  };

  getTranslateXByDate = (date: UtcDate): number => {
    return (date.startOfDay().timestampMs - this.epochOffset) / this.pxUnitAmp;
  };

  getDurationAmp = (): number => {
    const clientWidth = this.viewWidth;

    return this.pxUnitAmp * clientWidth;
  };

  getWidthByDates = ({ startDate, endDate }: { startDate: UtcDate; endDate: UtcDate }): number => {
    return (endDate.timestampMs - startDate.timestampMs) / this.pxUnitAmp;
  };

  getRecordBarThumbVisible = (barInfo: Bar): boolean => {
    const { width, translateX: barTranslateX, invalidDateRange } = barInfo;

    if (invalidDateRange) return false;

    // Offset for hidden bar to show thumb
    const offset = 50;

    const rightSide = this.translateX + this.viewWidth;

    return barTranslateX + width < this.translateX - offset || barTranslateX - rightSide > offset;
  };

  scrollToBar = ({ barInfo, type }: { barInfo: Bar; type: 'left' | 'right' }): void => {
    const { translateX: barTranslateX, width } = barInfo;
    const translateX1 = this.translateX + this.viewWidth / 2;
    const translateX2 = barTranslateX + width;

    const diffX = Math.abs(translateX2 - translateX1);
    let translateX = this.translateX + diffX;

    if (type === 'left') translateX = this.translateX - diffX;

    this.setTranslateX(translateX);
  };

  handleWheel = (e: WheelEvent): void => {
    if (e.deltaX !== 0) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (this._wheelTimer) clearTimeout(this._wheelTimer);

    // Horizontal scrolling
    if (Math.abs(e.deltaX) > 0) {
      this.scrolling = true;

      this.setTranslateX(this.translateX + e.deltaX);
    }

    this._wheelTimer = window.setTimeout(() => {
      this.scrolling = false;
    }, 100);
  };

  handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>): void => {
    const { scrollTop } = event.currentTarget;

    this.scrollY(scrollTop);
  };

  scrollY = (scrollTop: number): void => {
    this.scrollTop = scrollTop;
  };

  // Virtual scrolling
  get getVisibleRows(): { start: number; count: number } {
    const visibleHeight = this.bodyClientHeight;

    const visibleRowCount = Math.ceil(visibleHeight / this.rowHeight) + 10;

    const start = Math.max(Math.ceil(this.scrollTop / this.rowHeight) - 5, 0);

    return {
      start,
      count: visibleRowCount,
    };
  }

  handleMouseMove = debounce(e => {
    if (!this.isPointerPress) this.showSelectionBar(e);
  }, 5);

  handleMouseLeave = (): void => {
    this.showSelectionIndicator = false;
  };

  // Find record that is currently under selection bar
  findSelectionBarAssociatedRecord = (): Nullable<GanttItem> => {
    return (
      this.data.find(d => d.bar?.translateY === this.selectionIndicatorTop + SELECTION_BAR_TOP) ??
      null
    );
  };

  selectBar = (bar: Nullable<Bar>) => {
    this.selectedBar = bar;
  };

  showSelectionBar = (e: MouseEvent): void => {
    if (this.selectedBar) {
      const topOffset = this.selectedBar.translateY - 8;

      this.showSelectionIndicator = true;
      this.selectionIndicatorTop = topOffset;
    } else {
      const scrollTop = this.mainElementRef.current?.scrollTop || 0;
      const { top } = this.mainElementRef.current?.getBoundingClientRect() || {
        top: 0,
      };

      const contentHeight = this.barList.length * this.rowHeight;
      const offsetY = e.clientY - top + scrollTop;

      if (offsetY - contentHeight > TOP_PADDING) {
        this.showSelectionIndicator = false;
      } else {
        const topValue =
          Math.floor((offsetY - TOP_PADDING) / this.rowHeight) * this.rowHeight + TOP_PADDING;
        this.showSelectionIndicator = true;
        this.selectionIndicatorTop = topValue;
      }
    }
  };

  handleDragStart = ({ barInfo, type }: { barInfo: Bar; type: MoveType }): void => {
    this.draggingKey = barInfo.key;
    this.draggingType = type;
    this.isPointerPress = true;
    barInfo.stepGesture = 'start';

    document.body.classList.add('no-selection');
  };

  handleDragEnd = (): void => {
    if (this.draggingBar) {
      this.draggingBar.stepGesture = 'end';
      this.draggingKey = null;
    }

    this.draggingType = null;
    this.isPointerPress = false;

    document.body.classList.remove('no-selection');
  };

  getBarGrid = (): number => {
    switch (this.viewConfig.view) {
      case 'fifteen-minutes':
        return ConvertTimeUtil.msInFifteenMinutes / this.pxUnitAmp;

      case 'hour':
        return ConvertTimeUtil.msInHour / this.pxUnitAmp;

      case 'quarter':
      case 'half-year':
        return (ConvertTimeUtil.msInDay * 5) / this.pxUnitAmp;

      default:
        return ConvertTimeUtil.msInDay / this.pxUnitAmp;
    }
  };

  updateBarSize = (barInfo: Bar, { width, x }: { width: number; x: number }): void => {
    barInfo.width = width;
    barInfo.translateX = Math.max(x, 0);
    barInfo.stepGesture = 'moving';
  };

  getMovedDays = (ms: number): number => {
    return Math.round(ms / ConvertTimeUtil.msInDay);
  };

  getMovedHours = (ms: number): number => {
    return Math.round(ms / ConvertTimeUtil.msInHour);
  };

  getMovedMinutes = (ms: number): number => {
    return Math.round(ms / ConvertTimeUtil.msInMinute);
  };

  roundToNearestMinorAxis = ({
    view,
    date,
    floor,
  }: {
    view: GanttView;
    date: UtcDate;
    floor?: boolean;
  }): UtcDate => {
    switch (view) {
      case 'fifteen-minutes': {
        if (floor) {
          const minutes = date.minutes;
          const remainder = minutes % 15;

          return date.subtractMinutes(remainder);
        }

        const minutes = date.minutes;
        const remainder = minutes % 15;

        return remainder > 15 / 2
          ? date.addMinutes(15 - remainder)
          : date.subtractMinutes(remainder);
      }

      case 'hour':
        return date.startOfHour();

      case 'day':
      case 'week':
      case 'month':
      case 'quarter':
      case 'half-year':
        return date.startOfDay();

      default:
        return date;
    }
  };

  createRecord = async (mouseX: number): Promise<void> => {
    const record = this.findSelectionBarAssociatedRecord();

    if (!record || (record.startDate && record.endDate) || !record.bar) return;

    this.setChartCursor('wait');

    const oldStartDate = record.startDate;
    const oldEndDate = record.endDate;

    const CORRECTING_OFFSET = 64;
    const mouseOffset = mouseX - this.tableWidth - CORRECTING_OFFSET;

    const newStartDate = this.roundToNearestMinorAxis({
      view: this.viewConfig.view,
      date: UtcDate.fromTimestampMs(
        (this.translateX + mouseOffset) * this.pxUnitAmp + this.epochOffset
      ),
      floor: true,
    });

    let newEndDate: UtcDate;

    if (this.viewConfig.view === 'fifteen-minutes') {
      newEndDate = newStartDate.addMinutes(15).endOfMinute();
    } else if (this.viewConfig.view === 'hour') {
      newEndDate = newStartDate.addHours(1).endOfHour();
    } else if (this.viewConfig.view === 'day' || this.viewConfig.view === 'week') {
      newEndDate = newStartDate.addDays(1).endOfDay();
    } else {
      newEndDate = newStartDate.addDays(5).endOfDay();
    }

    try {
      record.startDate = newStartDate;
      record.endDate = newEndDate;

      const success = await this.onUpdate?.(
        toJS(record.bar.record),
        newStartDate.formatISO(),
        newEndDate.formatISO()
      );

      if (!success) {
        record.startDate = oldStartDate;
        record.endDate = oldEndDate;
      }
    } catch (e) {
      throw new Error(`Failed to createRecord for record ${record.title}: ${e}`);
    } finally {
      this.setChartCursor('default');
    }
  };

  updateRecordDate = async ({
    barInfo,
    oldSize,
    updateType,
  }: {
    barInfo: Bar;
    oldSize: { width: number; x: number };
    updateType: 'move' | 'left' | 'right';
  }): Promise<void> => {
    const { translateX, width, item, record } = barInfo;

    const { title, startDate: oldStartDate, endDate: oldEndDate } = item;

    if (!oldStartDate || !oldEndDate)
      throw new Error(
        `Failed to update record ${title} date, missing start or end date, received startDate ${oldStartDate?.formatISO()}, received endDate ${oldEndDate?.formatISO()}`
      );

    let newStartDate = oldStartDate;
    let newEndDate = oldEndDate;

    switch (updateType) {
      case 'move': {
        if (this.viewConfig.view === 'fifteen-minutes') {
          const minutesDelta = this.getMovedMinutes((translateX - oldSize.x) * this.pxUnitAmp);

          newStartDate = this.roundToNearestMinorAxis({
            view: 'fifteen-minutes',
            date: oldStartDate.addMinutes(minutesDelta).startOfMinute(),
          });

          newEndDate = this.roundToNearestMinorAxis({
            view: 'fifteen-minutes',
            date: oldEndDate.addMinutes(minutesDelta).startOfMinute(),
          });
        } else if (this.viewConfig.view === 'hour') {
          const hoursDelta = Math.round(
            this.getMovedHours((translateX - oldSize.x) * this.pxUnitAmp)
          );

          newStartDate = oldStartDate.addHours(hoursDelta).startOfHour();
          newEndDate = oldEndDate.addHours(hoursDelta).endOfHour();
        } else {
          const daysDelta = Math.round(
            this.getMovedDays((translateX - oldSize.x) * this.pxUnitAmp)
          );

          newStartDate = oldStartDate.addDays(daysDelta).startOfDay();

          // projects dates does not contain time, so their update logic is slightly different
          // to prevent display lags and incorrect moves
          if (this.type === 'project') {
            newEndDate = oldEndDate.addDays(daysDelta - 1).endOfDay();
          } else {
            newEndDate = oldEndDate.addDays(daysDelta).endOfDay();
          }
        }

        break;
      }

      case 'left': {
        if (this.viewConfig.view === 'fifteen-minutes') {
          const minutesDelta = this.getMovedMinutes((translateX - oldSize.x) * this.pxUnitAmp);

          newStartDate = this.roundToNearestMinorAxis({
            view: 'fifteen-minutes',
            date: oldStartDate.addMinutes(minutesDelta).startOfMinute(),
          });
        } else if (this.viewConfig.view === 'hour') {
          const hoursDelta = Math.round(
            this.getMovedHours((translateX - oldSize.x) * this.pxUnitAmp)
          );

          newStartDate = oldStartDate.addHours(hoursDelta).startOfHour();
        } else {
          const daysDelta = Math.round(
            this.getMovedDays((translateX - oldSize.x) * this.pxUnitAmp)
          );

          newStartDate = oldStartDate.addDays(daysDelta).startOfDay();
        }

        break;
      }

      case 'right': {
        if (this.viewConfig.view === 'fifteen-minutes') {
          const minutesDelta = this.getMovedMinutes((width - oldSize.width) * this.pxUnitAmp);

          newEndDate = this.roundToNearestMinorAxis({
            view: 'fifteen-minutes',
            date: oldEndDate.addMinutes(minutesDelta).startOfMinute(),
          });
        } else if (this.viewConfig.view === 'hour') {
          const hoursDelta = Math.round(
            this.getMovedHours((width - oldSize.width) * this.pxUnitAmp)
          );

          newEndDate = oldEndDate.addHours(hoursDelta).endOfHour();
        } else {
          const daysDelta = Math.round(this.getMovedDays((width - oldSize.width) * this.pxUnitAmp));

          // projects dates does not contain time, so their update logic is slightly different
          // to prevent display lags and incorrect moves
          if (this.type === 'project') {
            newEndDate = oldEndDate.addDays(daysDelta - 1).endOfDay();
          } else {
            newEndDate = oldEndDate.addDays(daysDelta).endOfDay();
          }
        }

        break;
      }
    }

    // Nothing to update
    if (newStartDate.isEqual(oldStartDate) && newEndDate.isEqual(oldEndDate)) return;

    // Record's start date cannot be greater or equal than its end date
    if (newStartDate.greaterOrEqualThan(newEndDate)) return;

    if (!newStartDate || !newEndDate)
      throw new Error(
        `Failed to updateRecordDate ${JSON.stringify(record)}, invalid date range: ${newStartDate.formatISO()} - ${newEndDate.formatISO()}`
      );

    try {
      barInfo.loading = true;

      const success = await this.onUpdate?.(
        toJS(record),
        newStartDate.formatISO(),
        newEndDate.formatISO()
      );

      if (success) {
        item.startDate = newStartDate;
        item.endDate = newEndDate;
      } else {
        barInfo.width = oldSize.width;
        barInfo.translateX = oldSize.x;
      }
    } catch (e) {
      throw new Error(`Failed to updateRecordDate for record ${item.title}: ${e}`);
    } finally {
      barInfo.loading = false;
    }
  };

  isToday = (key: string): boolean => {
    const target = UtcDate.fromDate(new Date(key));

    return target.isToday();
  };

  isCurrentHour = (key: string): boolean => {
    const now = UtcDate.now().format('YYYY-MM-DD HH');
    const target = UtcDate.fromDate(new Date(key)).format('YYYY-MM-DD HH');

    return target === now;
  };

  isCurrentFifteenMinutes = (key: string): boolean => {
    const now = UtcDate.now();

    const minutes = now.minutes;
    const remainder = minutes % 15;

    const currentFifteenMinutes = now.subtractMinutes(remainder).format(FULL_DATE_FORMAT);
    const target = UtcDate.fromDate(new Date(key)).format(FULL_DATE_FORMAT);

    return target === currentFifteenMinutes;
  };
}

export { GanttStore };
