export enum CardApiRoutes {
  ADD_NOTE = '/api/crm/entities/:entityId/notes',
  UPDATE_NOTE = '/api/crm/entities/:entityId/notes/:noteId',
  DELETE_NOTE = '/api/crm/entities/:entityId/notes/:noteId',
  // documents
  GET_ENTITY_DOCUMENTS = '/api/crm/entities/:id/documents',
  CHECK_ENTITY_DOCUMENT_TEMPLATE = '/api/crm/documents/check',
  // document templates info
  GET_DOCUMENT_TEMPLATES_INFOS = '/api/crm/documents/templates/entity-type/:entityTypeId',
  // create document
  CREATE_ENTITY_DOCUMENT = '/api/crm/documents/create',
}
