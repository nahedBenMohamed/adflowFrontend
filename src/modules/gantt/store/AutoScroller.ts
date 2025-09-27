import type { Nullable } from '@/shared';

type AutoScrollHandler = (delta: number) => void;
type HasReachedEdgeHandler = (position: 'left' | 'right') => boolean;

export class AutoScroller {
  rate: number;
  space: number;

  autoScrollPos: number = 0;
  clientX: Nullable<number> = null;
  scrollTimer: Nullable<number> = null;
  scroller: Nullable<HTMLElement> = null;

  onAutoScroll: AutoScrollHandler;
  hasReachedEdge: HasReachedEdgeHandler;

  constructor({
    scroller,
    rate = 5,
    space = 50,
    onAutoScroll,
    hasReachedEdge,
  }: {
    rate?: number;
    space?: number;
    scroller?: Nullable<HTMLElement>;
    onAutoScroll: AutoScrollHandler;
    hasReachedEdge: HasReachedEdgeHandler;
  }) {
    this.rate = rate;
    this.space = space;
    this.scroller = scroller || null;
    this.onAutoScroll = onAutoScroll;
    this.hasReachedEdge = hasReachedEdge;
  }

  handleDraggingMouseMove = (event: MouseEvent): void => {
    this.clientX = event.clientX;
  };

  handleScroll = (position: 'left' | 'right'): void => {
    if (this.hasReachedEdge(position)) return;

    if (position === 'left') {
      this.autoScrollPos -= this.rate;

      this.onAutoScroll(-this.rate);
    } else if (position === 'right') {
      this.autoScrollPos += this.rate;

      this.onAutoScroll(this.rate);
    }
  };

  start = (): void => {
    this.autoScrollPos = 0;

    document.addEventListener('mousemove', this.handleDraggingMouseMove);

    const scrollFunc = () => {
      if (this.scroller && this.clientX !== null) {
        if (this.clientX + this.space > this.scroller?.getBoundingClientRect().right) {
          this.handleScroll('right');
        } else if (this.clientX - this.space < this.scroller?.getBoundingClientRect().left) {
          this.handleScroll('left');
        }
      }

      this.scrollTimer = requestAnimationFrame(scrollFunc);
    };

    this.scrollTimer = requestAnimationFrame(scrollFunc);
  };

  stop = (): void => {
    document.removeEventListener('mousemove', this.handleDraggingMouseMove);

    if (this.scrollTimer) cancelAnimationFrame(this.scrollTimer);
  };
}
