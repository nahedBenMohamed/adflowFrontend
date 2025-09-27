import type { Nullable, Optional } from '@/shared';

const queryKeys = {
  app: ['app'],
  latestFrontendVersion(currentVersion: string) {
    return [...this.app, 'latest-frontend-version', currentVersion];
  },

  stages: ['stages'],
  stage({
    stageId,
    boardId,
  }: {
    stageId: Optional<Nullable<number>>;
    boardId: Optional<Nullable<number>>;
  }) {
    return [...this.stages, 'stage', boardId, stageId];
  },
  stagesByBoardId(boardId: Optional<Nullable<number>>) {
    return [...this.stages, 'board-id', boardId];
  },

  boards: ['boards'],
  tasksBoards() {
    return [...this.boards, 'tasks'];
  },
  board(boardId: Optional<Nullable<number>>) {
    return [...this.boards, 'board', boardId];
  },
  boardsByEntityTypeId(entityTypeId: Optional<Nullable<number>>) {
    return [...this.boards, 'entity-type-id', entityTypeId];
  },

  userProfiles: ['user-profiles'],
  userProfile(id: number) {
    return [...this.userProfiles, 'user-profile', id];
  },

  fileInfo: ['file-info'],
  fileInfoById(fileId: string) {
    return [...this.fileInfo, fileId];
  },

  subscriptions: ['subscriptions'],
  subscriptionByAccountId(accountId: number) {
    return [...this.subscriptions, accountId];
  },
} as const;

export const APP_QUERY_KEYS = Object.freeze(queryKeys);
