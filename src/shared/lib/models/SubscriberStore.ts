// Base interface for all server-sent events subscriber stores.
export interface SubscriberStore {
  // Subscribes the store to server-sent events.
  subscribe: () => void;

  // Unsubscribes the store from server-sent events.
  unsubscribe: () => void;
}
