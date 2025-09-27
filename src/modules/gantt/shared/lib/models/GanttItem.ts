import type { UtcDateValue } from '@/shared';
import type { Key } from 'react';
import type { Bar } from './Bar';
import type { GanttRecord } from './GanttRecord';

export class GanttItem {
  key: Key;
  title: string;

  endDate: UtcDateValue;
  startDate: UtcDateValue;

  record: GanttRecord;
  collapsed: boolean;

  bar?: Bar;
  depth?: number;
  index?: number;
  group?: boolean;
  parent?: GanttItem;
  children?: GanttItem[];

  constructor({
    key,
    title,
    collapsed,
    endDate,
    startDate,
    record,
    group,
    children,
    parent,
    bar,
    depth,
    index,
  }: GanttItem) {
    this.key = key;
    this.title = title;
    this.collapsed = collapsed;
    this.endDate = endDate;
    this.startDate = startDate;
    this.record = record;
    this.group = group;
    this.children = children;
    this.parent = parent;
    this.bar = bar;
    this.depth = depth;
    this.index = index;
  }
}
