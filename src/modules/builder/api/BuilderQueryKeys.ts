const queryKeys = {
  builder: ['builder'],
  siteForms() {
    return [...this.builder, 'site-forms'];
  },
} as const;

export const BUILDER_QUERY_KEYS = Object.freeze(queryKeys);
