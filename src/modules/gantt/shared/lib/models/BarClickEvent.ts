export const GANTT_BAR_CLICK_EVENT = 'gantt-bar-click';

// this event is emitted on bar click in gantt.
// why not listen to native onClick?
// because native onClick is handled by DragResizeManager, which has much logic with clicks,
// so, we emit custom event to make sure events are not overlapped, and each is handled properly.
// see usage in DragResizeManager handleMouseDown handler
export class BarClickEvent extends UIEvent {
  constructor() {
    super(GANTT_BAR_CLICK_EVENT, { bubbles: true });
  }
}
