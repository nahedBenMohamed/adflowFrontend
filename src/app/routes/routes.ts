import type { BuilderTabs, ModuleCategory } from '@/modules/builder';
import {
  CardTab,
  ORDER_ID_QUERY_PARAM,
  generateProductsSectionOrderTabValue,
} from '@/modules/card';
import type { GanttView } from '@/modules/gantt';
import { MAILBOX_ID_QUERY_PARAM } from '@/modules/mailing';
import { ProductsPageTabs, type ProductsSectionType } from '@/modules/products';
import type { ReportsSection } from '@/modules/reporting';
import { generateSchedulerLinkedEntityTypeTab, type ScheduleType } from '@/modules/scheduler';
import {
  ALBATO_INFO_MODAL_QUERY_PARAM,
  APIX_DRIVE_INFO_MODAL_QUERY_PARAM,
  FB_FIRST_INFO_MODAL_QUERY_PARAM,
  GOOGLE_CALENDAR_CONNECT_MODAL_QUERY_PARAM,
  GOOGLE_CALENDAR_MANAGE_MODAL_QUERY_PARAM,
  MAKE_INFO_MODAL_QUERY_PARAM,
  ONE_C_INFO_MODAL_QUERY_PARAM,
  PBX_GROUP_ID,
  SALESFORCE_FIRST_INFO_MODAL_QUERY_PARAM,
  TILDA_INFO_MODAL_QUERY_PARAM,
  TWILIO_FIRST_INFO_MODAL_QUERY_PARAM,
  WAZZUP_FIRST_INFO_MODAL_QUERY_PARAM,
  WORDPRESS_INFO_MODAL_QUERY_PARAM,
} from '@/modules/settings';
import { TasksTab } from '@/modules/tasks';
import {
  CommonQueryParams,
  EntitiesBoardSettingsTab,
  SectionView,
  type CalendarView,
  type EntityType,
  type Nullable,
  type Optional,
} from '@/shared';
import { HttpStatusCode } from 'axios';

export const PBX_PROVIDER_TYPE_QUERY_PARAM = 'pbxProviderType';

export const routes = {
  root: '/',
  login: '/login',
  sectionBase(entityTypeId: number) {
    return `/et/${entityTypeId}`;
  },
  everything(entityTypeId: number) {
    return `${this.sectionBase(entityTypeId)}/everything`;
  },
  listSectionBase(entityTypeId: number) {
    return `${this.sectionBase(entityTypeId)}/list`;
  },
  listSectionAutomation(entityTypeId: number) {
    return `${this.sectionBase(entityTypeId)}/list/${EntitiesBoardSettingsTab.AUTOMATION}`;
  },
  listSectionBpmn(entityTypeId: number) {
    return `${this.sectionBase(entityTypeId)}/list/${EntitiesBoardSettingsTab.AUTOMATION_BPMN}`;
  },
  listSection(entityTypeId: number) {
    return `${this.listSectionBase(entityTypeId)}?${CommonQueryParams.PAGE}=1`;
  },
  listSectionWithBoard({ entityTypeId, boardId }: { entityTypeId: number; boardId: number }) {
    return `${this.sectionBase(entityTypeId)}/b/${boardId}/${SectionView.LIST}?${CommonQueryParams.PAGE}=1`;
  },
  entitiesSectionBase({ entityTypeId, boardId }: { entityTypeId: number; boardId?: number }) {
    return `${this.sectionBase(entityTypeId)}/b/${boardId ?? -1}`;
  },
  entitiesSection({
    entityTypeId,
    boardId,
    tab,
  }: {
    entityTypeId: number;
    boardId?: number;
    tab: SectionView;
  }) {
    return `${this.entitiesSectionBase({ entityTypeId, boardId })}/${tab}${tab === SectionView.LIST ? `?${CommonQueryParams.PAGE}=1` : ''}`;
  },
  entitiesSectionTimeline({
    entityTypeId,
    boardId,
    view,
  }: {
    entityTypeId: number;
    boardId: number;
    view: GanttView;
  }) {
    return `${this.entitiesSectionBase({ entityTypeId, boardId })}/${SectionView.TIMELINE}/${view}`;
  },
  boardSectionBase(entityTypeId: number) {
    return `${this.sectionBase(entityTypeId)}/b`;
  },
  // if boardId is not provided, user will be navigated to page with boardId = -1
  // Then, page will request available boards and renavigate user to actual board
  boardSection({ entityTypeId, boardId }: { entityTypeId: number; boardId?: Nullable<number> }) {
    return `${this.boardSectionBase(entityTypeId)}/${boardId ?? -1}/${SectionView.BOARD}`;
  },
  boardSectionReports({
    boardId,
    entityTypeId,
    reportsSection,
  }: {
    boardId: number;
    entityTypeId: number;
    reportsSection: ReportsSection | string;
  }) {
    return `${this.boardSectionBase(entityTypeId)}/${boardId}/${SectionView.REPORTS}${reportsSection ? `?${CommonQueryParams.SECTION}=${reportsSection}` : ''}`;
  },
  boardSectionDashboard({ entityTypeId, boardId }: { entityTypeId: number; boardId: number }) {
    return `${this.boardSectionBase(entityTypeId)}/${boardId}/${SectionView.DASHBOARD}`;
  },
  goalSettings(entityTypeId: number) {
    return `${this.sectionBase(entityTypeId)}/goal-settings`;
  },
  section({
    entityType,
    firstBoardId,
  }: {
    entityType: EntityType;
    firstBoardId: Optional<Nullable<number>>;
  }) {
    if (entityType.section.view === SectionView.BOARD)
      return this.boardSection({ entityTypeId: entityType.id, boardId: firstBoardId });

    return this.listSection(entityType.id);
  },
  cardBase(entityTypeId: number) {
    return `${this.sectionBase(entityTypeId)}/card`;
  },
  card({
    entityTypeId,
    entityId,
    from,
    tab = CardTab.OVERVIEW,
  }: {
    entityTypeId: number;
    entityId: number;
    from?: string;
    tab?: CardTab;
  }) {
    return `${this.cardBase(entityTypeId)}/${entityId}/${tab}${from ? `?${CommonQueryParams.FROM}=${from}` : ''}`;
  },
  cardProductsOrder({
    entityTypeId,
    entityId,
    sectionId,
    sectionType,
    orderId,
    from,
  }: {
    entityTypeId: number;
    entityId: number;
    sectionId: number;
    sectionType: ProductsSectionType;
    orderId?: number;
    from?: string;
  }) {
    return (
      this.cardBase(entityTypeId) +
      `/${entityId}/${generateProductsSectionOrderTabValue({
        sectionId,
        sectionType,
      })}${from ? `?${CommonQueryParams.FROM}=${from}` : ''}${orderId ? `${from ? '&' : '?'}${ORDER_ID_QUERY_PARAM}=${orderId}` : ''}`
    );
  },
  cardAfterAdd({
    entityTypeId,
    entityId,
    from,
  }: {
    entityTypeId: number;
    entityId: number;
    from?: string;
  }) {
    return `${this.cardBase(entityTypeId)}/${entityId}/${CardTab.OVERVIEW}?${CardTab.AFTER_ADD}=true${
      from ? `&${CommonQueryParams.FROM}=${from}` : ''
    }`;
  },
  addCard({
    entityTypeId,
    boardId,
    from,
  }: {
    entityTypeId: number;
    boardId?: number;
    from?: string;
  }) {
    return `${this.cardBase(entityTypeId)}/add${boardId ? `?boardId=${boardId}` : ''}${from ? `${boardId ? '&' : '?'}${CommonQueryParams.FROM}=${from}` : ''}`;
  },
  productsBase({
    sectionType,
    sectionId,
  }: {
    sectionType: ProductsSectionType;
    sectionId: number;
  }) {
    return `/p/${sectionType}/${sectionId}`;
  },
  products({
    sectionId,
    sectionType,
    addProduct,
    sku,
    tab = ProductsPageTabs.PRODUCTS,
  }: {
    sectionId: number;
    sectionType: ProductsSectionType;
    addProduct?: boolean;
    sku?: string;
    tab?: ProductsPageTabs;
  }) {
    let path;

    if (addProduct && sku) {
      path = `${this.productsBase({ sectionType, sectionId })}/${tab}?add=true&sku=${sku}`;
    } else if (addProduct) {
      path = `${this.productsBase({ sectionType, sectionId })}/${tab}?add=true`;
    } else {
      path = `${this.productsBase({ sectionType, sectionId })}/${tab}`;
    }

    return `${path}${tab === ProductsPageTabs.PRODUCTS ? `?${CommonQueryParams.PAGE}=1` : ''}`;
  },
  productsReports({
    sectionId,
    sectionType,
    reportsSection,
  }: {
    sectionId: number;
    sectionType: ProductsSectionType;
    reportsSection: string;
  }) {
    return `${this.productsBase({ sectionType, sectionId })}/${ProductsPageTabs.REPORTS}?${CommonQueryParams.SECTION}=${reportsSection}`;
  },
  product({
    sectionId,
    sectionType,
    productId,
    from,
  }: {
    sectionId: number;
    sectionType: ProductsSectionType;
    productId: number;
    from?: string;
  }) {
    if (from)
      return `${this.productsBase({ sectionType, sectionId })}/product/${productId}?${CommonQueryParams.FROM}=${from}`;

    return `${this.productsBase({ sectionType, sectionId })}/product/${productId}`;
  },
  shipments({ sectionId, sectionType }: { sectionId: number; sectionType: ProductsSectionType }) {
    return `${this.productsBase({ sectionType, sectionId })}/shipments?${CommonQueryParams.PAGE}=1`;
  },
  shipment({
    sectionId,
    sectionType,
    shipmentId,
  }: {
    sectionId: number;
    sectionType: ProductsSectionType;
    shipmentId: number;
  }) {
    return `${this.productsBase({ sectionType, sectionId })}/shipments/${shipmentId}`;
  },
  settingsBase: '/settings',
  settingsUsersBase() {
    return `${this.settingsBase}/users`;
  },
  settingsUsers() {
    return `${this.settingsUsersBase()}/list`;
  },
  settingsDepartments() {
    return `${this.settingsUsersBase()}/groups`;
  },
  settingsUsersAdd() {
    return `${this.settingsUsersBase()}/list/new`;
  },
  settingsUsersUpdate(userId: number) {
    return `${this.settingsUsersBase()}/list/${userId}`;
  },
  settingsGeneral() {
    return `${this.settingsBase}/general`;
  },
  settingsApiKeys() {
    return `${this.settingsBase}/api`;
  },
  settingsBillingBase() {
    return `${this.settingsBase}/billing`;
  },
  settingsBillingCommon() {
    return `${this.settingsBillingBase()}/common`;
  },
  settingsBillingStripe() {
    return `${this.settingsBillingBase()}/stripe`;
  },
  settingsBillingMyworkRequestInvoiceBase() {
    return `${this.settingsBillingBase()}/invoice`;
  },
  settingsBillingMyworkRequestInvoice({ plan, users }: { plan: string; users: number }) {
    return `${this.settingsBillingMyworkRequestInvoiceBase()}?plan=${plan}&users=${users}`;
  },
  settingsIntegrations() {
    return `${this.settingsBase}/integrations`;
  },
  settingsIntegrationsGoogleCalendarConnect({ code, state }: { code: string; state?: string }) {
    return `${this.settingsBase}/integrations?${GOOGLE_CALENDAR_CONNECT_MODAL_QUERY_PARAM}=true&code=${code}${state ? `&state=${state}` : ''}`;
  },
  settingsIntegrationsGoogleCalendarManage() {
    return `${this.settingsIntegrations()}?${GOOGLE_CALENDAR_MANAGE_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsWazzupInfo() {
    return `${this.settingsIntegrations()}?${WAZZUP_FIRST_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsPbxGroup() {
    return `${this.settingsIntegrations()}#${PBX_GROUP_ID}`;
  },
  settingsIntegrationsTildaInfo() {
    return `${this.settingsIntegrations()}?${TILDA_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsWordpressInfo() {
    return `${this.settingsIntegrations()}?${WORDPRESS_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsTwilioInfo() {
    return `${this.settingsIntegrations()}?${TWILIO_FIRST_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsFbMessengerInfo() {
    return `${this.settingsIntegrations()}?${FB_FIRST_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsSalesforceInfo() {
    return `${this.settingsIntegrations()}?${SALESFORCE_FIRST_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsMakeInfo() {
    return `${this.settingsIntegrations()}?${MAKE_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsApixDriveInfo() {
    return `${this.settingsIntegrations()}?${APIX_DRIVE_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsAlbatoInfo() {
    return `${this.settingsIntegrations()}?${ALBATO_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsIntegrationsOneCInfo() {
    return `${this.settingsIntegrations()}?${ONE_C_INFO_MODAL_QUERY_PARAM}=true`;
  },
  settingsMailing() {
    return `${this.settingsBase}/mailing`;
  },
  settingsMailingEditMailbox(mailboxId: number) {
    return `${this.settingsMailing()}?${MAILBOX_ID_QUERY_PARAM}=${mailboxId}`;
  },
  settingsDocumentsBase() {
    return `${this.settingsBase}/documents`;
  },
  settingsDocumentTemplates() {
    return `${this.settingsDocumentsBase()}/templates`;
  },
  settingsDocumentCreationFields() {
    return `${this.settingsDocumentsBase()}/fields`;
  },
  settingsMailingAddMailbox() {
    return `${this.settingsBase}/mailing?add=true`;
  },
  settingsCallsBase() {
    return `${this.settingsBase}/calls`;
  },
  settingsCallsAccount() {
    return `${this.settingsCallsBase()}/account`;
  },
  settingsCallsUsers() {
    return `${this.settingsCallsBase()}/users`;
  },
  settingsCallsScenarios() {
    return `${this.settingsCallsBase()}/scenarios`;
  },
  settingsCallsSchemas() {
    return `${this.settingsCallsBase()}/schemas`;
  },
  settingsSuperadmin() {
    return `${this.settingsBase}/superadmin`;
  },
  settingsCallsSipRegistrations({
    add,
    pbxProviderType,
  }: {
    add?: boolean;
    pbxProviderType?: string;
  }) {
    return `${this.settingsCallsBase()}/sip-registrations${add ? `?${CommonQueryParams.ADD}=true` : ''}${
      pbxProviderType ? `${add ? '&' : '?'}${PBX_PROVIDER_TYPE_QUERY_PARAM}=${pbxProviderType}` : ''
    }`;
  },
  entityTypeBoardSettings({
    boardId,
    entityTypeId,
    tab = EntitiesBoardSettingsTab.AUTOMATION,
    from,
  }: {
    boardId: number;
    entityTypeId: number;
    tab?: EntitiesBoardSettingsTab;
    from?: string;
  }) {
    return `${this.sectionBase(entityTypeId)}/b/${boardId}/board-settings/${tab}${from ? `?${CommonQueryParams.FROM}=${from}` : ''}`;
  },
  activitiesBase: '/activities',
  activities: `/activities/${TasksTab.BOARD}`,
  activitiesCalendar({
    view,
    year,
    month,
    day,
  }: {
    view: CalendarView;
    year: number;
    month: number;
    day: number;
  }) {
    return `/activities/${TasksTab.CALENDAR}/${view}/${year}/${month}/${day}`;
  },
  tasksBase: '/tasks',
  timeBoardBase() {
    return `${this.tasksBase}/deadline`;
  },
  timeBoard() {
    return `${this.tasksBase}/deadline/${TasksTab.BOARD}`;
  },
  timeBoardCalendar({
    view,
    year,
    month,
    day,
  }: {
    view: CalendarView;
    year: number;
    month: number;
    day: number;
  }) {
    return `${this.tasksBase}/deadline/${TasksTab.CALENDAR}/${view}/${year}/${month}/${day}`;
  },
  tasksBoardBase(boardId: number) {
    return `${this.tasksBase}/b/${boardId}`;
  },
  tasksBoard(boardId: number) {
    return `${this.tasksBoardBase(boardId)}/${TasksTab.BOARD}`;
  },
  taskBoardSettings({
    boardId,
    from,
    entityId,
    entityTypeId,
  }: {
    boardId: number;
    from?: string;
    entityId?: number;
    entityTypeId?: number;
  }) {
    return `${this.tasksBoardBase(boardId)}/board-settings${from ? `?${CommonQueryParams.FROM}=${from}` : ''}${
      entityId && entityTypeId
        ? `${from ? '&' : '?'}entityTypeId=${entityTypeId}&entityId=${entityId}`
        : ''
    }`;
  },
  tasksList(boardId: number) {
    return `${this.tasksBoardBase(boardId)}/${TasksTab.LIST}`;
  },
  tasksTimeline({ boardId, view }: { boardId: number; view: GanttView }) {
    return `${this.tasksBoardBase(boardId)}/${TasksTab.TIMELINE}/${view}`;
  },
  projectTasksBoard({
    entityTypeId,
    entityId,
    from,
  }: {
    entityTypeId: number;
    entityId: number;
    from?: string;
  }) {
    return (
      this.cardBase(entityTypeId) +
      `/${entityId}/${CardTab.BOARD}${from ? `?${CommonQueryParams.FROM}=${from}` : ''}`
    );
  },
  tasksCalendar({
    boardId,
    view,
    year,
    month,
    day,
  }: {
    boardId: number;
    view: CalendarView;
    year: number;
    month: number;
    day: number;
  }) {
    return `${this.tasksBoardBase(boardId)}/${TasksTab.CALENDAR}/${view}/${year}/${month}/${day}`;
  },
  projectTasksCalendar({
    entityTypeId,
    entityId,
    view,
    year,
    month,
    day,
    from,
  }: {
    entityTypeId: number;
    entityId: number;
    view: CalendarView;
    year: number;
    month: number;
    day: number;
    from?: string;
  }) {
    return (
      this.cardBase(entityTypeId) +
      `/${entityId}/${CardTab.CALENDAR}/${view}/${year}/${month}/${day}${from ? `?${CommonQueryParams.FROM}=${from}` : ''}`
    );
  },
  projectTasksList({
    entityTypeId,
    entityId,
    from,
  }: {
    entityTypeId: number;
    entityId: number;
    from?: string;
  }) {
    return (
      this.cardBase(entityTypeId) +
      `/${entityId}/${CardTab.LIST}${from ? `?${CommonQueryParams.FROM}=${from}` : ''}`
    );
  },
  projectTasksTimeline({
    entityTypeId,
    entityId,
    from,
    view,
  }: {
    entityTypeId: number;
    entityId: number;
    view: GanttView;
    from?: string;
  }) {
    return `${this.cardBase(entityTypeId)}/${entityId}/${CardTab.TIMELINE}/${view}${from ? `?${CommonQueryParams.FROM}=${from}` : ''}`;
  },
  partnerInfo(partnerId: number) {
    return `/partners/${partnerId}`;
  },
  mail: '/mail',
  forbiddenPage: `/${HttpStatusCode.Forbidden}`,
  multichatBase: '/chat',
  multichat(from?: string) {
    return `${this.multichatBase}${from ? `?${CommonQueryParams.FROM}=${from}` : ''}`;
  },
  multichatChat(chatId: number) {
    return `${this.multichatBase}/${chatId}`;
  },
  multichatChatMessage({ chatId, messageId }: { chatId: number; messageId: number }) {
    return `${this.multichatBase}/${chatId}/message/${messageId}`;
  },
  builderBase: '/builder',
  builder(tab: BuilderTabs) {
    return `${this.builderBase}/${tab}`;
  },
  builderCreateSiteForm() {
    return `${this.builderBase}/site-forms`;
  },
  builderUpdateSiteForm(siteFormId: number) {
    return `${this.builderCreateSiteForm()}/${siteFormId}`;
  },
  builderCreateHeadlessSiteForm() {
    return `${this.builderBase}/site-forms/headless`;
  },
  builderUpdateHeadlessSiteForm(siteFormId: number) {
    return `${this.builderCreateHeadlessSiteForm()}/${siteFormId}`;
  },
  builderCreateOnlineBookingSiteForm() {
    return `${this.builderBase}/site-forms/online-booking`;
  },
  builderUpdateOnlineBookingSiteForm(siteFormId: number) {
    return `${this.builderCreateOnlineBookingSiteForm()}/${siteFormId}`;
  },
  builderCreateProductsSection(type: ProductsSectionType) {
    return `${this.builderBase}/products?type=${type}`;
  },
  builderUpdateProductsSection({
    moduleId,
    moduleType,
  }: {
    moduleId: number;
    moduleType: ProductsSectionType;
  }) {
    return `${this.builderBase}/products/${moduleId}?type=${moduleType}`;
  },
  builderCreateEt(module: ModuleCategory) {
    return `${this.builderBase}/et?${CommonQueryParams.CATEGORY}=${module}`;
  },
  builderUpdateEt(moduleId: number) {
    return `${this.builderBase}/et/${moduleId}`;
  },
  builderCreateScheduler() {
    return `${this.builderBase}/scheduler`;
  },
  builderUpdateScheduler(moduleId: number) {
    return `${this.builderBase}/scheduler/${moduleId}`;
  },
  schedulerBase({ scheduleType, scheduleId }: { scheduleType: ScheduleType; scheduleId: number }) {
    return `/scheduler/${scheduleType}/${scheduleId}`;
  },
  scheduler({
    scheduleId,
    scheduleType,
    tab,
  }: {
    scheduleId: number;
    scheduleType: ScheduleType;
    tab: SectionView;
  }) {
    return `${this.schedulerBase({ scheduleId, scheduleType })}/${tab}`;
  },
  schedulerReports({
    scheduleId,
    scheduleType,
    reportsSection,
  }: {
    scheduleId: number;
    scheduleType: ScheduleType;
    reportsSection: ReportsSection;
  }) {
    return `${this.schedulerBase({ scheduleId, scheduleType })}/${SectionView.REPORTS}?${CommonQueryParams.SECTION}=${reportsSection}`;
  },
  schedulerClients({
    scheduleId,
    scheduleType,
    entityTypeId,
  }: {
    scheduleId: number;
    scheduleType: ScheduleType;
    entityTypeId: number;
  }) {
    return `${this.schedulerBase({ scheduleId, scheduleType })}/${generateSchedulerLinkedEntityTypeTab(entityTypeId)}`;
  },
  notes: '/notes',
  notFoundPage: `/${HttpStatusCode.NotFound}`,
};
