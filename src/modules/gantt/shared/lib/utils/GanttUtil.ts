import { GanttItem, type Bar, type GanttRecord } from '../models';

export class GanttUtil {
  // Recursively transform the data of the tree into a one-dimensional array
  static deepFlatten({
    array,
    depth = 0,
    parent,
  }: {
    array: GanttItem[];
    depth?: number;
    parent?: GanttItem;
  }): GanttItem[] {
    let idx = 0;

    return array.reduce<GanttItem[]>((flat, i) => {
      i.depth = depth;
      i.parent = parent;
      i.index = idx;

      idx += 1;

      return [
        ...flat,
        i,
        ...(i.children && !i.collapsed
          ? this.deepFlatten({ array: i.children, depth: depth + 1, parent: i })
          : []),
      ];
    }, []);
  }

  static getMaxRange(bar: Bar): {
    translateX: number;
    width: number;
  } {
    let minTranslateX = 0;
    let maxTranslateX = 0;
    const temporary: Bar[] = [bar];

    while (temporary.length > 0) {
      const current = temporary.shift();

      if (current) {
        const { translateX = 0, width = 0 } = current;

        if (minTranslateX === 0) minTranslateX = translateX || 0;

        if (translateX) {
          minTranslateX = Math.min(translateX, minTranslateX);
          maxTranslateX = Math.max(translateX + width, maxTranslateX);
        }

        if (current.item.children && current.item.children.length > 0)
          for (const t of current.item.children) if (t.bar) temporary.push(t.bar);
      }
    }

    return {
      translateX: minTranslateX,
      width: maxTranslateX - minTranslateX,
    };
  }

  static transverseData({
    data,
    startDateKey,
    endDateKey,
  }: {
    data: GanttRecord[];
    startDateKey: string;
    endDateKey: string;
  }): GanttItem[] {
    const generateKey = (() => {
      let key = 0;

      return function () {
        return key++;
      };
    })();

    const result: GanttItem[] = [];

    for (const record of data) {
      const item = new GanttItem({
        key: generateKey(),
        record,
        group: record.group,
        title: record.title,
        endDate: record.endDate,
        startDate: record.startDate,
        collapsed: record.collapsed ?? false,
        children: this.transverseData({ data: record.children ?? [], startDateKey, endDateKey }),
      });

      result.push(item);
    }

    return result;
  }
}
