import { makeAutoObservable } from 'mobx';
import type { Key } from 'react';
import type { GanttItem } from './GanttItem';
import type { GanttRecord } from './GanttRecord';

type DateTextFormatHandler = (startX: number) => string;
type GetDateWidthHandler = ({ startX, endX }: { startX: number; endX: number }) => number;

export class Bar {
  key: Key;
  label: string;

  width: number;
  translateX: number;
  translateY: number;

  stepGesture: string;
  invalidDateRange: boolean;

  item: GanttItem;
  record: GanttRecord;

  loading: boolean;

  childrenCount: number;
  group?: boolean;
  collapsed: boolean;
  depth: number;
  index?: number;
  parent?: GanttItem;

  getDateWidth: GetDateWidthHandler;
  dateTextFormat: DateTextFormatHandler;

  constructor({
    key,
    label,
    width,
    translateX,
    translateY,
    stepGesture,
    invalidDateRange,
    item,
    record,
    loading,
    childrenCount,
    group,
    collapsed,
    depth,
    index,
    parent,
    getDateWidth,
    dateTextFormat,
  }: Bar) {
    this.key = key;
    this.label = label;
    this.width = width;
    this.translateX = translateX;
    this.translateY = translateY;
    this.stepGesture = stepGesture;
    this.invalidDateRange = invalidDateRange;
    this.item = item;
    this.record = record;
    this.loading = loading;

    this.childrenCount = childrenCount;
    this.group = group;
    this.collapsed = collapsed;
    this.depth = depth;
    this.index = index;
    this.parent = parent;

    this.getDateWidth = getDateWidth;
    this.dateTextFormat = dateTextFormat;

    makeAutoObservable(this);
  }
}
