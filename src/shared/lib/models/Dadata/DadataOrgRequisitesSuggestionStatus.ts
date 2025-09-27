export enum DadataOrgRequisitesSuggestionStatus {
  // Действующая
  ACTIVE = 'ACTIVE',
  // Ликвидируется
  LIQUIDATING = 'LIQUIDATING',
  // Ликвидирована
  LIQUIDATED = 'LIQUIDATED',
  // Банкротство
  BANKRUPT = 'BANKRUPT',
  // В процессе присоединения к другому юрлицу, с последующей ликвидацией
  REORGANIZING = 'REORGANIZING',
}
