export const APPOINTMENT_CARD_LIST_TAB_PREFIX = 'et';

export const generateAppointmentCardListTab = (linkedEntityTypeId: number) =>
  `${APPOINTMENT_CARD_LIST_TAB_PREFIX}-${linkedEntityTypeId}`;
