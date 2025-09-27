import type * as VoxImplant from 'voximplant-websdk';
import type { BillingPath, CompanyName, Optional, VoximplantIntegrationGuideType } from '../types';

class EnvUtil {
  private _viteAppName: string;
  private _viteAppUrl: string;
  private _viteAppDemoEmail: string;
  private _viteAppLanguages: string;
  private _viteAppLogo: string;
  private _viteAppUrlTemplate: string;
  private _viteGtmId: string;
  private _viteAppRUSegment: string;

  // Billing
  private _viteBillingPath: string;
  private _viteBillingShowCreditButton: string;

  // Builder
  private _viteBuilderHideMainModules: string;
  private _viteBuilderHideFormBuilder: string;
  private _viteBuilderHideTelephony: string;
  private _viteBuilderHideBpmn: string;
  private _viteBuilderHideMarketing: string;
  private _viteBuilderHideFinances: string;

  // Integrations
  private _viteIntegrationsShow1C: string;
  private _viteIntegrationsShowSalesforce: string;
  private _viteIntegrationsShowWazzup: string;
  private _viteIntegrationsShowFbMessenger: string;
  private _viteIntegrationsShowTwilio: string;
  private _viteIntegrationsShowPbx: string;
  private _viteIntegrationsShowRuPbxProviders: string;
  private _viteIntegrationsShowMake: string;
  private _viteIntegrationsShowApixDrive: string;
  private _viteIntegrationsShowAlbato: string;

  // Voximplant
  private _viteVoximplantShowTelephony: string;
  private _viteVoximplantConnectionNode: string;
  private _viteVoximplantIntegrationGuideType: string;

  // Documents
  private _viteDocumentsShowOrderFields: string;

  // New Relic
  private _viteNewRelicEnabled: string;
  private _viteNewRelicAccountId: string;
  private _viteNewRelicLicenseKey: string;
  private _viteNewRelicApplicationId: string;

  // Request BPMN from builder marketplace workspace.mywork.app form
  private _viteRequestBpmnWorkspaceFormNameFieldId: string;
  private _viteRequestBpmnWorkspaceFormPhoneFieldId: string;
  private _viteRequestBpmnWorkspaceFormEmailFieldId: string;
  private _viteRequestBpmnWorkspaceFormDomainFieldId: string;
  private _viteRequestBpmnWorkspaceFormCommentFieldId: string;
  private _viteSubmitRequestBpmnWorkspaceFormUrl: string;

  // Request additional storage from builder marketplace workspace.mywork.app form
  private _viteRequestAdditionalStorageWorkspaceFormNameFieldId: string;
  private _viteRequestAdditionalStorageWorkspaceFormPhoneFieldId: string;
  private _viteRequestAdditionalStorageWorkspaceFormEmailFieldId: string;
  private _viteRequestAdditionalStorageWorkspaceFormDomainFieldId: string;
  private _viteRequestAdditionalStorageWorkspaceFormCommentFieldId: string;
  private _viteRequestAdditionalStorageWorkspaceFormStorageFieldId: string;
  private _viteRequestAdditionalStorageWorkspaceFormTenGbOptionId: string;
  private _viteRequestAdditionalStorageWorkspaceFormOneHundredGbOptionId: string;
  private _viteRequestAdditionalStorageWorkspaceFormOneTbOptionId: string;
  private _viteSubmitRequestAdditionalStorageWorkspaceFormUrl: string;

  // Request Mywork invoice workspace.mywork.app form
  private _viteRequestMyworkInvoiceWorkspaceFormNumberOfUsersFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormPlanFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormNameFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormItnFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormAddressFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormContactNameFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormPhoneFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormEmailFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormSubdomainFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormInvoiceIdFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormTotalPriceFieldId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormPlanLtdBusinessId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormPlanLtdAdvancedId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormPlanYearBusinessId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormPlanYearAdvancedId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormPlanMonthBusinessId: string;
  private _viteRequestMyworkInvoiceWorkspaceFormPlanMonthAdvancedId: string;
  private _viteSubmitRequestMyworkInvoiceWorkspaceFormUrl: string;

  // Request API integration headless form
  private _viteRequestSetupHeadlessFormNameFieldId: string;
  private _viteRequestSetupHeadlessFormPhoneFieldId: string;
  private _viteRequestSetupHeadlessFormEmailFieldId: string;
  private _viteRequestSetupHeadlessFormCommentFieldId: string;
  private _viteRequestSetupHeadlessFormSubdomainFieldId: string;
  private _viteRequestSetupHeadlessFormUrl: string;

  // Directus credentials
  private _viteDirectusPublicBaseUrl: string;
  private _viteDirectusStaticToken: string;

  // Development
  private _viteReactQueryDevtoolsEnabled: string;

  // Automation
  private _viteAutomationHideBpmn: string;

  constructor({
    viteAppName,
    viteAppUrl,
    viteAppDemoEmail,
    viteAppLanguages,
    viteAppLogo,
    viteAppUrlTemplate,
    viteGtmId,
    viteAppRUSegment,
    viteBillingPath,
    viteBillingShowCreditButton,
    viteBuilderHideMainModules,
    viteBuilderHideFormBuilder,
    viteBuilderHideTelephony,
    viteBuilderHideBpmn,
    viteBuilderHideMarketing,
    viteBuilderHideFinances,
    viteIntegrationsShow1C,
    viteIntegrationsShowSalesforce,
    viteIntegrationsShowWazzup,
    viteIntegrationsShowFbMessenger,
    viteIntegrationsShowTwilio,
    viteIntegrationsShowPbx,
    viteIntegrationsShowRuPbxProviders,
    viteIntegrationsShowMake,
    viteIntegrationsShowApixDrive,
    viteIntegrationsShowAlbato,
    viteVoximplantShowTelephony,
    viteVoximplantConnectionNode,
    viteVoximplantIntegrationGuideType,
    viteDocumentsShowOrderFields,
    viteNewRelicEnabled,
    viteNewRelicAccountId,
    viteNewRelicLicenseKey,
    viteNewRelicApplicationId,
    viteRequestMyworkInvoiceWorkspaceFormNameFieldId,
    viteRequestMyworkInvoiceWorkspaceFormItnFieldId,
    viteRequestMyworkInvoiceWorkspaceFormAddressFieldId,
    viteRequestMyworkInvoiceWorkspaceFormNumberOfUsersFieldId,
    viteRequestMyworkInvoiceWorkspaceFormPlanFieldId,
    viteRequestMyworkInvoiceWorkspaceFormContactNameFieldId,
    viteRequestMyworkInvoiceWorkspaceFormPhoneFieldId,
    viteRequestMyworkInvoiceWorkspaceFormEmailFieldId,
    viteRequestMyworkInvoiceWorkspaceFormSubdomainFieldId,
    viteRequestMyworkInvoiceWorkspaceFormInvoiceIdFieldId,
    viteRequestMyworkInvoiceWorkspaceFormTotalPriceFieldId,
    viteRequestMyworkInvoiceWorkspaceFormPlanLtdBusinessId,
    viteRequestMyworkInvoiceWorkspaceFormPlanLtdAdvancedId,
    viteRequestMyworkInvoiceWorkspaceFormPlanYearBusinessId,
    viteRequestMyworkInvoiceWorkspaceFormPlanYearAdvancedId,
    viteRequestMyworkInvoiceWorkspaceFormPlanMonthBusinessId,
    viteRequestMyworkInvoiceWorkspaceFormPlanMonthAdvancedId,
    viteSubmitRequestMyworkInvoiceWorkspaceFormUrl,
    viteRequestSetupHeadlessFormNameFieldId,
    viteRequestSetupHeadlessFormPhoneFieldId,
    viteRequestSetupHeadlessFormEmailFieldId,
    viteRequestSetupHeadlessFormCommentFieldId,
    viteRequestSetupHeadlessFormSubdomainFieldId,
    viteRequestSetupHeadlessFormUrl,
    viteDirectusPublicBaseUrl,
    viteDirectusStaticToken,
    viteReactQueryDevtoolsEnabled,
    viteAutomationHideBpmn,
    viteRequestBpmnWorkspaceFormNameFieldId,
    viteRequestBpmnWorkspaceFormPhoneFieldId,
    viteRequestBpmnWorkspaceFormEmailFieldId,
    viteRequestBpmnWorkspaceFormDomainFieldId,
    viteRequestBpmnWorkspaceFormCommentFieldId,
    viteSubmitRequestBpmnWorkspaceFormUrl,
    viteRequestAdditionalStorageWorkspaceFormNameFieldId,
    viteRequestAdditionalStorageWorkspaceFormPhoneFieldId,
    viteRequestAdditionalStorageWorkspaceFormEmailFieldId,
    viteRequestAdditionalStorageWorkspaceFormDomainFieldId,
    viteRequestAdditionalStorageWorkspaceFormCommentFieldId,
    viteRequestAdditionalStorageWorkspaceFormStorageFieldId,
    viteRequestAdditionalStorageWorkspaceFormTenGbOptionId,
    viteRequestAdditionalStorageWorkspaceFormOneHundredGbOptionId,
    viteRequestAdditionalStorageWorkspaceFormOneTbOptionId,
    viteSubmitRequestAdditionalStorageWorkspaceFormUrl,
  }: {
    viteAppName: string;
    viteAppUrl: string;
    viteAppDemoEmail: string;
    viteAppLanguages: string;
    viteAppLogo: string;
    viteAppUrlTemplate: string;
    viteGtmId: string;
    viteAppRUSegment: string;
    viteBillingPath: string;
    viteBillingShowCreditButton: string;
    viteBuilderHideMainModules: string;
    viteBuilderHideFormBuilder: string;
    viteBuilderHideTelephony: string;
    viteBuilderHideBpmn: string;
    viteBuilderHideMarketing: string;
    viteBuilderHideFinances: string;
    viteIntegrationsShow1C: string;
    viteIntegrationsShowSalesforce: string;
    viteIntegrationsShowWazzup: string;
    viteIntegrationsShowFbMessenger: string;
    viteIntegrationsShowTwilio: string;
    viteIntegrationsShowPbx: string;
    viteIntegrationsShowRuPbxProviders: string;
    viteIntegrationsShowMake: string;
    viteIntegrationsShowApixDrive: string;
    viteIntegrationsShowAlbato: string;
    viteVoximplantShowTelephony: string;
    viteVoximplantConnectionNode: string;
    viteVoximplantIntegrationGuideType: string;
    viteDocumentsShowOrderFields: string;
    viteNewRelicEnabled: string;
    viteNewRelicAccountId: string;
    viteNewRelicLicenseKey: string;
    viteNewRelicApplicationId: string;
    viteRequestMyworkInvoiceWorkspaceFormNameFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormItnFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormAddressFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormNumberOfUsersFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormPlanFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormContactNameFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormPhoneFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormEmailFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormSubdomainFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormInvoiceIdFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormTotalPriceFieldId: string;
    viteRequestMyworkInvoiceWorkspaceFormPlanLtdBusinessId: string;
    viteRequestMyworkInvoiceWorkspaceFormPlanLtdAdvancedId: string;
    viteRequestMyworkInvoiceWorkspaceFormPlanYearBusinessId: string;
    viteRequestMyworkInvoiceWorkspaceFormPlanYearAdvancedId: string;
    viteRequestMyworkInvoiceWorkspaceFormPlanMonthBusinessId: string;
    viteRequestMyworkInvoiceWorkspaceFormPlanMonthAdvancedId: string;
    viteSubmitRequestMyworkInvoiceWorkspaceFormUrl: string;
    viteRequestSetupHeadlessFormNameFieldId: string;
    viteRequestSetupHeadlessFormPhoneFieldId: string;
    viteRequestSetupHeadlessFormEmailFieldId: string;
    viteRequestSetupHeadlessFormCommentFieldId: string;
    viteRequestSetupHeadlessFormSubdomainFieldId: string;
    viteRequestSetupHeadlessFormUrl: string;
    viteDirectusPublicBaseUrl: string;
    viteDirectusStaticToken: string;
    viteReactQueryDevtoolsEnabled: string;
    viteAutomationHideBpmn: string;
    viteRequestBpmnWorkspaceFormNameFieldId: string;
    viteRequestBpmnWorkspaceFormPhoneFieldId: string;
    viteRequestBpmnWorkspaceFormEmailFieldId: string;
    viteRequestBpmnWorkspaceFormDomainFieldId: string;
    viteRequestBpmnWorkspaceFormCommentFieldId: string;
    viteSubmitRequestBpmnWorkspaceFormUrl: string;
    viteRequestAdditionalStorageWorkspaceFormNameFieldId: string;
    viteRequestAdditionalStorageWorkspaceFormPhoneFieldId: string;
    viteRequestAdditionalStorageWorkspaceFormEmailFieldId: string;
    viteRequestAdditionalStorageWorkspaceFormDomainFieldId: string;
    viteRequestAdditionalStorageWorkspaceFormCommentFieldId: string;
    viteRequestAdditionalStorageWorkspaceFormStorageFieldId: string;
    viteRequestAdditionalStorageWorkspaceFormTenGbOptionId: string;
    viteRequestAdditionalStorageWorkspaceFormOneHundredGbOptionId: string;
    viteRequestAdditionalStorageWorkspaceFormOneTbOptionId: string;
    viteSubmitRequestAdditionalStorageWorkspaceFormUrl: string;
  }) {
    this._viteAppName = viteAppName;
    this._viteAppUrl = viteAppUrl;
    this._viteAppDemoEmail = viteAppDemoEmail;
    this._viteAppLanguages = viteAppLanguages;
    this._viteAppLogo = viteAppLogo;
    this._viteAppUrlTemplate = viteAppUrlTemplate;
    this._viteGtmId = viteGtmId;
    this._viteAppRUSegment = viteAppRUSegment;
    this._viteBillingPath = viteBillingPath;
    this._viteBillingShowCreditButton = viteBillingShowCreditButton;
    this._viteBuilderHideMainModules = viteBuilderHideMainModules;
    this._viteBuilderHideFormBuilder = viteBuilderHideFormBuilder;
    this._viteBuilderHideTelephony = viteBuilderHideTelephony;
    this._viteBuilderHideBpmn = viteBuilderHideBpmn;
    this._viteBuilderHideMarketing = viteBuilderHideMarketing;
    this._viteBuilderHideFinances = viteBuilderHideFinances;
    this._viteIntegrationsShow1C = viteIntegrationsShow1C;
    this._viteIntegrationsShowSalesforce = viteIntegrationsShowSalesforce;
    this._viteIntegrationsShowWazzup = viteIntegrationsShowWazzup;
    this._viteIntegrationsShowFbMessenger = viteIntegrationsShowFbMessenger;
    this._viteIntegrationsShowTwilio = viteIntegrationsShowTwilio;
    this._viteIntegrationsShowPbx = viteIntegrationsShowPbx;
    this._viteIntegrationsShowRuPbxProviders = viteIntegrationsShowRuPbxProviders;
    this._viteIntegrationsShowMake = viteIntegrationsShowMake;
    this._viteIntegrationsShowApixDrive = viteIntegrationsShowApixDrive;
    this._viteIntegrationsShowAlbato = viteIntegrationsShowAlbato;
    this._viteVoximplantShowTelephony = viteVoximplantShowTelephony;
    this._viteVoximplantConnectionNode = viteVoximplantConnectionNode;
    this._viteVoximplantIntegrationGuideType = viteVoximplantIntegrationGuideType;
    this._viteDocumentsShowOrderFields = viteDocumentsShowOrderFields;
    this._viteNewRelicEnabled = viteNewRelicEnabled;
    this._viteNewRelicAccountId = viteNewRelicAccountId;
    this._viteNewRelicLicenseKey = viteNewRelicLicenseKey;
    this._viteNewRelicApplicationId = viteNewRelicApplicationId;
    this._viteRequestMyworkInvoiceWorkspaceFormNumberOfUsersFieldId =
      viteRequestMyworkInvoiceWorkspaceFormNumberOfUsersFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormPlanFieldId =
      viteRequestMyworkInvoiceWorkspaceFormPlanFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormNameFieldId =
      viteRequestMyworkInvoiceWorkspaceFormNameFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormItnFieldId =
      viteRequestMyworkInvoiceWorkspaceFormItnFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormAddressFieldId =
      viteRequestMyworkInvoiceWorkspaceFormAddressFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormContactNameFieldId =
      viteRequestMyworkInvoiceWorkspaceFormContactNameFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormPhoneFieldId =
      viteRequestMyworkInvoiceWorkspaceFormPhoneFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormEmailFieldId =
      viteRequestMyworkInvoiceWorkspaceFormEmailFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormSubdomainFieldId =
      viteRequestMyworkInvoiceWorkspaceFormSubdomainFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormInvoiceIdFieldId =
      viteRequestMyworkInvoiceWorkspaceFormInvoiceIdFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormTotalPriceFieldId =
      viteRequestMyworkInvoiceWorkspaceFormTotalPriceFieldId;
    this._viteRequestMyworkInvoiceWorkspaceFormPlanLtdBusinessId =
      viteRequestMyworkInvoiceWorkspaceFormPlanLtdBusinessId;
    this._viteRequestMyworkInvoiceWorkspaceFormPlanLtdAdvancedId =
      viteRequestMyworkInvoiceWorkspaceFormPlanLtdAdvancedId;
    this._viteRequestMyworkInvoiceWorkspaceFormPlanYearBusinessId =
      viteRequestMyworkInvoiceWorkspaceFormPlanYearBusinessId;
    this._viteRequestMyworkInvoiceWorkspaceFormPlanYearAdvancedId =
      viteRequestMyworkInvoiceWorkspaceFormPlanYearAdvancedId;
    this._viteRequestMyworkInvoiceWorkspaceFormPlanMonthBusinessId =
      viteRequestMyworkInvoiceWorkspaceFormPlanMonthBusinessId;
    this._viteRequestMyworkInvoiceWorkspaceFormPlanMonthAdvancedId =
      viteRequestMyworkInvoiceWorkspaceFormPlanMonthAdvancedId;
    this._viteSubmitRequestMyworkInvoiceWorkspaceFormUrl =
      viteSubmitRequestMyworkInvoiceWorkspaceFormUrl;
    this._viteRequestSetupHeadlessFormNameFieldId = viteRequestSetupHeadlessFormNameFieldId;
    this._viteRequestSetupHeadlessFormPhoneFieldId = viteRequestSetupHeadlessFormPhoneFieldId;
    this._viteRequestSetupHeadlessFormEmailFieldId = viteRequestSetupHeadlessFormEmailFieldId;
    this._viteRequestSetupHeadlessFormCommentFieldId = viteRequestSetupHeadlessFormCommentFieldId;
    this._viteRequestSetupHeadlessFormSubdomainFieldId =
      viteRequestSetupHeadlessFormSubdomainFieldId;
    this._viteRequestSetupHeadlessFormUrl = viteRequestSetupHeadlessFormUrl;
    this._viteDirectusPublicBaseUrl = viteDirectusPublicBaseUrl;
    this._viteDirectusStaticToken = viteDirectusStaticToken;
    this._viteReactQueryDevtoolsEnabled = viteReactQueryDevtoolsEnabled;
    this._viteAutomationHideBpmn = viteAutomationHideBpmn;
    this._viteRequestBpmnWorkspaceFormNameFieldId = viteRequestBpmnWorkspaceFormNameFieldId;
    this._viteRequestBpmnWorkspaceFormPhoneFieldId = viteRequestBpmnWorkspaceFormPhoneFieldId;
    this._viteRequestBpmnWorkspaceFormEmailFieldId = viteRequestBpmnWorkspaceFormEmailFieldId;
    this._viteRequestBpmnWorkspaceFormDomainFieldId = viteRequestBpmnWorkspaceFormDomainFieldId;
    this._viteRequestBpmnWorkspaceFormCommentFieldId = viteRequestBpmnWorkspaceFormCommentFieldId;
    this._viteSubmitRequestBpmnWorkspaceFormUrl = viteSubmitRequestBpmnWorkspaceFormUrl;
    this._viteRequestAdditionalStorageWorkspaceFormNameFieldId =
      viteRequestAdditionalStorageWorkspaceFormNameFieldId;
    this._viteRequestAdditionalStorageWorkspaceFormPhoneFieldId =
      viteRequestAdditionalStorageWorkspaceFormPhoneFieldId;
    this._viteRequestAdditionalStorageWorkspaceFormEmailFieldId =
      viteRequestAdditionalStorageWorkspaceFormEmailFieldId;
    this._viteRequestAdditionalStorageWorkspaceFormDomainFieldId =
      viteRequestAdditionalStorageWorkspaceFormDomainFieldId;
    this._viteRequestAdditionalStorageWorkspaceFormCommentFieldId =
      viteRequestAdditionalStorageWorkspaceFormCommentFieldId;
    this._viteRequestAdditionalStorageWorkspaceFormStorageFieldId =
      viteRequestAdditionalStorageWorkspaceFormStorageFieldId;
    this._viteRequestAdditionalStorageWorkspaceFormTenGbOptionId =
      viteRequestAdditionalStorageWorkspaceFormTenGbOptionId;
    this._viteRequestAdditionalStorageWorkspaceFormOneHundredGbOptionId =
      viteRequestAdditionalStorageWorkspaceFormOneHundredGbOptionId;
    this._viteRequestAdditionalStorageWorkspaceFormOneTbOptionId =
      viteRequestAdditionalStorageWorkspaceFormOneTbOptionId;
    this._viteSubmitRequestAdditionalStorageWorkspaceFormUrl =
      viteSubmitRequestAdditionalStorageWorkspaceFormUrl;
  }

  get appName(): CompanyName {
    return this._viteAppName as CompanyName;
  }

  get appNameLowerCase(): string {
    return this._viteAppName.toLocaleLowerCase();
  }

  get appUrl(): string {
    return this._viteAppUrl;
  }

  get appDemoEmail(): string {
    return this._viteAppDemoEmail;
  }

  get appLanguages(): string[] {
    return this._viteAppLanguages.split(',');
  }

  get appLogo(): CompanyName {
    return this._viteAppLogo as CompanyName;
  }

  get appUrlTemplate(): string {
    return this._viteAppUrlTemplate;
  }

  get gtmId(): string {
    return this._viteGtmId;
  }

  get appRUSegment(): boolean {
    return this._viteAppRUSegment === 'true';
  }

  get voximplantConnectionNode(): VoxImplant.ConnectionNode {
    return this._viteVoximplantConnectionNode as VoxImplant.ConnectionNode;
  }

  get voximplantIntegrationGuideType(): VoximplantIntegrationGuideType {
    return this._viteVoximplantIntegrationGuideType as VoximplantIntegrationGuideType;
  }

  get voximplantShowTelephony(): boolean {
    return this._viteVoximplantShowTelephony === 'true';
  }

  get billingPath(): BillingPath {
    return this._viteBillingPath as BillingPath;
  }

  get billingShowCreditButton(): boolean {
    return this._viteBillingShowCreditButton === 'true';
  }

  get builderHideMainModules(): boolean {
    return this._viteBuilderHideMainModules === 'true';
  }

  get builderHideFormBuilder(): boolean {
    return this._viteBuilderHideFormBuilder === 'true';
  }

  get builderHideTelephony(): boolean {
    return this._viteBuilderHideTelephony === 'true';
  }

  get builderHideBpmn(): boolean {
    return this._viteBuilderHideBpmn === 'true';
  }

  get builderHideMarketing(): boolean {
    return this._viteBuilderHideMarketing === 'true';
  }

  get builderHideFinances(): boolean {
    return this._viteBuilderHideFinances === 'true';
  }

  get integrationsShowSalesforce(): boolean {
    return this._viteIntegrationsShowSalesforce === 'true';
  }

  get integrationsShowWazzup(): boolean {
    return this._viteIntegrationsShowWazzup === 'true';
  }

  get integrationsShowFbMessenger(): boolean {
    return this._viteIntegrationsShowFbMessenger === 'true';
  }

  get integrationsShowTwilio(): boolean {
    return this._viteIntegrationsShowTwilio === 'true';
  }

  get integrationsShow1C(): boolean {
    return this._viteIntegrationsShow1C === 'true';
  }

  get integrationsShowPbx(): boolean {
    return this._viteIntegrationsShowPbx === 'true';
  }

  get integrationsShowRuPbxProviders(): boolean {
    return this._viteIntegrationsShowRuPbxProviders === 'true';
  }

  get integrationsShowMake(): boolean {
    return this._viteIntegrationsShowMake === 'true';
  }

  get integrationsShowApixDrive(): boolean {
    return this._viteIntegrationsShowApixDrive === 'true';
  }

  get integrationsShowAlbato(): boolean {
    return this._viteIntegrationsShowAlbato === 'true';
  }

  get documentsShowOrderFields(): boolean {
    return this._viteDocumentsShowOrderFields === 'true';
  }

  get newRelicEnabled(): boolean {
    return this._viteNewRelicEnabled === 'true';
  }

  get newRelicAccountId(): string {
    return this._viteNewRelicAccountId;
  }

  get newRelicLicenseKey(): string {
    return this._viteNewRelicLicenseKey;
  }

  get newRelicApplicationId(): string {
    return this._viteNewRelicApplicationId;
  }

  get requestMyworkInvoiceWorkspaceFormNumberOfUsersFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormNumberOfUsersFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormPlanFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormPlanFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormNameFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormNameFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormItnFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormItnFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormAddressFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormAddressFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormContactNameFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormContactNameFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormPhoneFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormPhoneFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormEmailFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormEmailFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormSubdomainFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormSubdomainFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormInvoiceIdFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormInvoiceIdFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormTotalPriceFieldId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormTotalPriceFieldId);
  }

  get requestMyworkInvoiceWorkspaceFormPlanLtdBusinessId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormPlanLtdBusinessId);
  }

  get requestMyworkInvoiceWorkspaceFormPlanLtdAdvancedId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormPlanLtdAdvancedId);
  }

  get requestMyworkInvoiceWorkspaceFormPlanYearBusinessId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormPlanYearBusinessId);
  }

  get requestMyworkInvoiceWorkspaceFormPlanYearAdvancedId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormPlanYearAdvancedId);
  }

  get requestMyworkInvoiceWorkspaceFormPlanMonthBusinessId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormPlanMonthBusinessId);
  }

  get requestMyworkInvoiceWorkspaceFormPlanMonthAdvancedId(): number {
    return Number(this._viteRequestMyworkInvoiceWorkspaceFormPlanMonthAdvancedId);
  }

  get requestSetupHeadlessFormNameFieldId(): number {
    return Number(this._viteRequestSetupHeadlessFormNameFieldId);
  }

  get requestSetupHeadlessFormPhoneFieldId(): number {
    return Number(this._viteRequestSetupHeadlessFormPhoneFieldId);
  }

  get requestSetupHeadlessFormEmailFieldId(): number {
    return Number(this._viteRequestSetupHeadlessFormEmailFieldId);
  }

  get requestSetupHeadlessFormCommentFieldId(): number {
    return Number(this._viteRequestSetupHeadlessFormCommentFieldId);
  }

  get requestSetupHeadlessFormSubdomainFieldId(): number {
    return Number(this._viteRequestSetupHeadlessFormSubdomainFieldId);
  }

  get requestSetupHeadlessFormUrl(): string {
    return this._viteRequestSetupHeadlessFormUrl;
  }

  get submitRequestMyworkInvoiceWorkspaceFormUrl(): string {
    return this._viteSubmitRequestMyworkInvoiceWorkspaceFormUrl;
  }

  get directusPublicBaseUrl(): Optional<string> {
    return this._viteDirectusPublicBaseUrl;
  }

  get directusStaticToken(): Optional<string> {
    return this._viteDirectusStaticToken;
  }

  get reactQueryDevtoolsEnabled(): boolean {
    return this._viteReactQueryDevtoolsEnabled === 'true';
  }

  get automationHideBpmn(): boolean {
    return this._viteAutomationHideBpmn === 'true';
  }

  get requestBpmnWorkspaceFormNameFieldId(): number {
    return Number(this._viteRequestBpmnWorkspaceFormNameFieldId);
  }

  get requestBpmnWorkspaceFormPhoneFieldId(): number {
    return Number(this._viteRequestBpmnWorkspaceFormPhoneFieldId);
  }

  get requestBpmnWorkspaceFormEmailFieldId(): number {
    return Number(this._viteRequestBpmnWorkspaceFormEmailFieldId);
  }

  get requestBpmnWorkspaceFormDomainFieldId(): number {
    return Number(this._viteRequestBpmnWorkspaceFormDomainFieldId);
  }

  get requestBpmnWorkspaceFormCommentFieldId(): number {
    return Number(this._viteRequestBpmnWorkspaceFormCommentFieldId);
  }

  get submitRequestBpmnWorkspaceFormUrl(): string {
    return this._viteSubmitRequestBpmnWorkspaceFormUrl;
  }

  get requestAdditionalStorageWorkspaceFormNameFieldId(): number {
    return Number(this._viteRequestAdditionalStorageWorkspaceFormNameFieldId);
  }

  get requestAdditionalStorageWorkspaceFormPhoneFieldId(): number {
    return Number(this._viteRequestAdditionalStorageWorkspaceFormPhoneFieldId);
  }

  get requestAdditionalStorageWorkspaceFormEmailFieldId(): number {
    return Number(this._viteRequestAdditionalStorageWorkspaceFormEmailFieldId);
  }

  get requestAdditionalStorageWorkspaceFormDomainFieldId(): number {
    return Number(this._viteRequestAdditionalStorageWorkspaceFormDomainFieldId);
  }

  get requestAdditionalStorageWorkspaceFormCommentFieldId(): number {
    return Number(this._viteRequestAdditionalStorageWorkspaceFormCommentFieldId);
  }

  get requestAdditionalStorageWorkspaceFormStorageFieldId(): number {
    return Number(this._viteRequestAdditionalStorageWorkspaceFormStorageFieldId);
  }

  get requestAdditionalStorageWorkspaceFormTenGbOptionId(): number {
    return Number(this._viteRequestAdditionalStorageWorkspaceFormTenGbOptionId);
  }

  get requestAdditionalStorageWorkspaceFormOneHundredGbOptionId(): number {
    return Number(this._viteRequestAdditionalStorageWorkspaceFormOneHundredGbOptionId);
  }

  get requestAdditionalStorageWorkspaceFormOneTbOptionId(): number {
    return Number(this._viteRequestAdditionalStorageWorkspaceFormOneTbOptionId);
  }

  get submitRequestAdditionalStorageWorkspaceFormUrl(): string {
    return this._viteSubmitRequestAdditionalStorageWorkspaceFormUrl;
  }
}

export const envUtil = new EnvUtil({
  viteAppName: import.meta.env.VITE_APP_NAME,
  viteAppUrl: import.meta.env.VITE_APP_URL,
  viteAppDemoEmail: import.meta.env.VITE_APP_DEMO_EMAIL,
  viteAppLanguages: import.meta.env.VITE_APP_LANGUAGES,
  viteAppLogo: import.meta.env.VITE_APP_LOGO,
  viteAppUrlTemplate: import.meta.env.VITE_APP_URL_TEMPLATE,
  viteGtmId: import.meta.env.VITE_GTM_ID,
  viteAppRUSegment: import.meta.env.VITE_APP_RU_SEGMENT,
  viteBillingPath: import.meta.env.VITE_BILLING_PATH,
  viteBillingShowCreditButton: import.meta.env.VITE_BILLING_SHOW_CREDIT_BUTTON,
  viteBuilderHideMainModules: import.meta.env.VITE_BUILDER_HIDE_MAIN_MODULES,
  viteBuilderHideFormBuilder: import.meta.env.VITE_BUILDER_HIDE_FORM_BUILDER,
  viteBuilderHideTelephony: import.meta.env.VITE_BUILDER_HIDE_TELEPHONY,
  viteBuilderHideBpmn: import.meta.env.VITE_BUILDER_HIDE_BPMN,
  viteBuilderHideMarketing: import.meta.env.VITE_BUILDER_HIDE_MARKETING,
  viteBuilderHideFinances: import.meta.env.VITE_BUILDER_HIDE_FINANCES,
  viteIntegrationsShow1C: import.meta.env.VITE_INTEGRATIONS_SHOW_1C,
  viteIntegrationsShowSalesforce: import.meta.env.VITE_INTEGRATIONS_SHOW_SALESFORCE,
  viteIntegrationsShowWazzup: import.meta.env.VITE_INTEGRATIONS_SHOW_WAZZUP,
  viteIntegrationsShowFbMessenger: import.meta.env.VITE_INTEGRATIONS_SHOW_FB_MESSENGER,
  viteIntegrationsShowTwilio: import.meta.env.VITE_INTEGRATIONS_SHOW_TWILIO,
  viteIntegrationsShowPbx: import.meta.env.VITE_INTEGRATIONS_SHOW_PBX,
  viteIntegrationsShowRuPbxProviders: import.meta.env.VITE_INTEGRATIONS_SHOW_RU_PBX_PROVIDERS,
  viteIntegrationsShowMake: import.meta.env.VITE_INTEGRATIONS_SHOW_MAKE,
  viteIntegrationsShowApixDrive: import.meta.env.VITE_INTEGRATIONS_SHOW_APIX_DRIVE,
  viteIntegrationsShowAlbato: import.meta.env.VITE_INTEGRATIONS_SHOW_ALBATO,
  viteVoximplantShowTelephony: import.meta.env.VITE_VOXIMPLANT_SHOW_TELEPHONY,
  viteVoximplantConnectionNode: import.meta.env.VITE_VOXIMPLANT_CONNECTION_NODE,
  viteVoximplantIntegrationGuideType: import.meta.env.VITE_VOXIMPLANT_INTEGRATION_GUIDE_TYPE,
  viteDocumentsShowOrderFields: import.meta.env.VITE_DOCUMENTS_SHOW_ORDER_FIELDS,
  viteNewRelicEnabled: import.meta.env.VITE_NEW_RELIC_ENABLED,
  viteNewRelicAccountId: import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID,
  viteNewRelicLicenseKey: import.meta.env.VITE_NEW_RELIC_LICENSE_KEY,
  viteNewRelicApplicationId: import.meta.env.VITE_NEW_RELIC_APPLICATION_ID,
  viteRequestMyworkInvoiceWorkspaceFormNumberOfUsersFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_NUMBER_OF_USERS_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormPlanFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_PLAN_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormNameFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_NAME_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormItnFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_ITN_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormAddressFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_ADDRESS_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormContactNameFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_CONTACT_NAME_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormPhoneFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_PHONE_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormEmailFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_EMAIL_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormSubdomainFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_SUBDOMAIN_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormInvoiceIdFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_INVOICE_ID_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormTotalPriceFieldId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_TOTAL_PRICE_FIELD_ID,
  viteRequestMyworkInvoiceWorkspaceFormPlanLtdBusinessId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_PLAN_LTD_BUSINESS_ID,
  viteRequestMyworkInvoiceWorkspaceFormPlanLtdAdvancedId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_PLAN_LTD_ADVANCED_ID,
  viteRequestMyworkInvoiceWorkspaceFormPlanYearBusinessId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_PLAN_YEAR_BUSINESS_ID,
  viteRequestMyworkInvoiceWorkspaceFormPlanYearAdvancedId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_PLAN_YEAR_ADVANCED_ID,
  viteRequestMyworkInvoiceWorkspaceFormPlanMonthBusinessId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_PLAN_MONTH_BUSINESS_ID,
  viteRequestMyworkInvoiceWorkspaceFormPlanMonthAdvancedId: import.meta.env
    .VITE_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_PLAN_MONTH_ADVANCED_ID,
  viteSubmitRequestMyworkInvoiceWorkspaceFormUrl: import.meta.env
    .VITE_SUBMIT_REQUEST_MYWORK_INVOICE_WORKSPACE_FORM_URL,
  viteRequestSetupHeadlessFormNameFieldId: import.meta.env
    .VITE_REQUEST_SETUP_HEADLESS_FORM_NAME_FIELD_ID,
  viteRequestSetupHeadlessFormPhoneFieldId: import.meta.env
    .VITE_REQUEST_SETUP_HEADLESS_FORM_PHONE_FIELD_ID,
  viteRequestSetupHeadlessFormEmailFieldId: import.meta.env
    .VITE_REQUEST_SETUP_HEADLESS_FORM_EMAIL_FIELD_ID,
  viteRequestSetupHeadlessFormCommentFieldId: import.meta.env
    .VITE_REQUEST_SETUP_HEADLESS_FORM_COMMENT_FIELD_ID,
  viteRequestSetupHeadlessFormSubdomainFieldId: import.meta.env
    .VITE_REQUEST_SETUP_HEADLESS_FORM_SUBDOMAIN_FIELD_ID,
  viteRequestSetupHeadlessFormUrl: import.meta.env.VITE_REQUEST_SETUP_HEADLESS_FORM_URL,
  viteDirectusPublicBaseUrl: import.meta.env.VITE_DIRECTUS_PUBLIC_BASE_URL,
  viteDirectusStaticToken: import.meta.env.VITE_DIRECTUS_STATIC_TOKEN,
  viteReactQueryDevtoolsEnabled: import.meta.env.VITE_REACT_QUERY_DEVTOOLS_ENABLED,
  viteAutomationHideBpmn: import.meta.env.VITE_AUTOMATION_HIDE_BPMN,
  viteRequestBpmnWorkspaceFormNameFieldId: import.meta.env
    .VITE_REQUEST_BPMN_WORKSPACE_FORM_NAME_FIELD_ID,
  viteRequestBpmnWorkspaceFormPhoneFieldId: import.meta.env
    .VITE_REQUEST_BPMN_WORKSPACE_FORM_PHONE_FIELD_ID,
  viteRequestBpmnWorkspaceFormEmailFieldId: import.meta.env
    .VITE_REQUEST_BPMN_WORKSPACE_FORM_EMAIL_FIELD_ID,
  viteRequestBpmnWorkspaceFormDomainFieldId: import.meta.env
    .VITE_REQUEST_BPMN_WORKSPACE_FORM_DOMAIN_FIELD_ID,
  viteRequestBpmnWorkspaceFormCommentFieldId: import.meta.env
    .VITE_REQUEST_BPMN_WORKSPACE_FORM_COMMENT_FIELD_ID,
  viteSubmitRequestBpmnWorkspaceFormUrl: import.meta.env
    .VITE_SUBMIT_REQUEST_BPMN_WORKSPACE_FORM_URL,
  viteRequestAdditionalStorageWorkspaceFormNameFieldId: import.meta.env
    .VITE_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_NAME_FIELD_ID,
  viteRequestAdditionalStorageWorkspaceFormPhoneFieldId: import.meta.env
    .VITE_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_PHONE_FIELD_ID,
  viteRequestAdditionalStorageWorkspaceFormEmailFieldId: import.meta.env
    .VITE_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_EMAIL_FIELD_ID,
  viteRequestAdditionalStorageWorkspaceFormDomainFieldId: import.meta.env
    .VITE_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_DOMAIN_FIELD_ID,
  viteRequestAdditionalStorageWorkspaceFormCommentFieldId: import.meta.env
    .VITE_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_COMMENT_FIELD_ID,
  viteRequestAdditionalStorageWorkspaceFormStorageFieldId: import.meta.env
    .VITE_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_STORAGE_FIELD_ID,
  viteRequestAdditionalStorageWorkspaceFormTenGbOptionId: import.meta.env
    .VITE_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_TEN_GB_OPTION_ID,
  viteRequestAdditionalStorageWorkspaceFormOneHundredGbOptionId: import.meta.env
    .VITE_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_ONE_HUNDRED_GB_OPTION_ID,
  viteRequestAdditionalStorageWorkspaceFormOneTbOptionId: import.meta.env
    .VITE_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_ONE_TB_OPTION_ID,
  viteSubmitRequestAdditionalStorageWorkspaceFormUrl: import.meta.env
    .VITE_SUBMIT_REQUEST_ADDITIONAL_STORAGE_WORKSPACE_FORM_URL,
});
