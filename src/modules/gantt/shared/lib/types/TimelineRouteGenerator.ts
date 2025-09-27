import type { GanttView } from './GanttView';

export type TimelineRouteGenerator = ({ view }: { view: GanttView }) => string;
