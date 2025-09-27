import type { GetExpandedTutorialGroupsQueryParams } from './TutorialApi/TutorialApi';

const queryKeys = {
  tutorial: ['tutorial'],
  groups(queryParams: GetExpandedTutorialGroupsQueryParams) {
    return [...this.tutorial, 'groups', queryParams];
  },
  count(queryParams: GetExpandedTutorialGroupsQueryParams) {
    return [...this.tutorial, 'count', queryParams];
  },
} as const;

export const TUTORIAL_QUERY_KEYS = Object.freeze(queryKeys);
