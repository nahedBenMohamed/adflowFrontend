export enum TutorialApiRoutes {
  // tutorial groups
  CREATE_TUTORIAL_GROUP = '/api/tutorial/groups',
  GET_TUTORIAL_GROUPS = '/api/tutorial/groups',
  GET_TUTORIAL_GROUP = '/api/tutorial/groups/:groupId',
  UPDATE_TUTORIAL_GROUP = '/api/tutorial/groups/:groupId',
  DELETE_TUTORIAL_GROUP = '/api/tutorial/groups/:groupId',
  CHANGE_GROUPS_SORT_ORDER = '/api/tutorial/groups/sort',
  // count
  GET_TUTORIAL_COUNT = '/api/tutorial/count',
  // tutorial items
  CREATE_TUTORIAL_ITEM = '/api/tutorial/groups/:groupId/items',
  GET_TUTORIAL_ITEMS = '/api/tutorial/groups/:groupId/items',
  GET_TUTORIAL_ITEM = '/api/tutorial/groups/:groupId/items/:itemId',
  UPDATE_TUTORIAL_ITEM = '/api/tutorial/groups/:groupId/items/:itemId',
  DELETE_TUTORIAL_ITEM = '/api/tutorial/groups/:groupId/items/:itemId',
  CHANGE_ITEMS_SORT_ORDER = '/api/tutorial/groups/:groupId/items/sort',
}
