export const CARD_SAVED_EVENT = 'card-saved';

export class CardSavedEvent extends UIEvent {
  constructor() {
    super(CARD_SAVED_EVENT, { bubbles: true });
  }
}
