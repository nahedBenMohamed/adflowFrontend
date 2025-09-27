import { makeObservable, reaction, type IReactionDisposer } from 'mobx';

export class JsonStateHelper {
  initialJsonState: string;
  reactionDisposer: IReactionDisposer;

  stateChanged = false;

  getJsonStateCallback: () => string;

  constructor(getJsonStateCallback: () => string) {
    this.getJsonStateCallback = getJsonStateCallback;

    makeObservable(this, { stateChanged: true });
  }

  calculateState = (): void => {
    if (this.reactionDisposer) {
      this.reactionDisposer();
    }

    const getJsonState = this.getJsonStateCallback;

    // we should dispose reaction otherwise count of reaction increases
    this.reactionDisposer = reaction(
      () => {
        return getJsonState();
      },
      () => {
        this.stateChanged = getJsonState() !== this.initialJsonState;
      }
    );

    this.initialJsonState = getJsonState();
    this.stateChanged = getJsonState() !== this.initialJsonState;
  };

  clearState = (): void => {
    this.reactionDisposer();

    this.stateChanged = false;
  };
}
