import { AppBoundary } from '@/app';
import { LoginLinkPage, LoginPage } from '@/modules/auth';
import { AutomationProcessesPage, ListSectionAutomationProcessesPage } from '@/modules/bpmn';
import {
  BuilderHomePage,
  EtSectionBuilderPage,
  HeadlessSiteFormBuilderPage,
  OnlineBookingSiteFormBuilderPage,
  ProductsSectionBuilderPage,
  SchedulerBuilderPage,
  SiteFormBuilderPage,
} from '@/modules/builder';
import { AddCardPage, CardPage } from '@/modules/card';
import { MailingPage, MailingSettingsPage } from '@/modules/mailing';
import { MultichatPage } from '@/modules/multichat';
import { NotesPage } from '@/modules/notes';
import { PartnerInfoPage } from '@/modules/partner';
import { ProductPage, ProductsPage, ShipmentPage } from '@/modules/products';
import { GoalSettingsPage } from '@/modules/reporting';
import { SchedulerPage } from '@/modules/scheduler';
import {
  EntitiesBoardSettingsPage,
  EntitiesListAutomationPage,
  EntitiesListPage,
  EntitiesPage,
  EverythingPage,
  TasksBoardSettingsPage,
} from '@/modules/section';
import {
  AccountApiAccessPage,
  CommonBillingPage,
  DocumentCreationFieldsPage,
  DocumentTemplatesPage,
  EditDepartmentsPage,
  EditUserPage,
  GeneralSettingsPage,
  GoogleCalendarRedirectPage,
  IntegrationsPage,
  MyworkRequestInvoiceBillingPage,
  StripeBillingPage,
  SuperadminPage,
  UsersSettingsPage,
} from '@/modules/settings';
import { ActivitiesPage, TasksPage, TimeBoardPage } from '@/modules/tasks';
import {
  CallsConfiguringScenariosPage,
  CallsSettingsAccountPage,
  CallsSettingsUsersPage,
  CallsSipRegistrationsPage,
} from '@/modules/telephony';
import {
  BrowserNotSupportedPage,
  EntitiesBoardSettingsTab,
  ForbiddenPage,
  NotFoundPage,
  WithAdminRole,
  WithAuth,
  WithPartnerRole,
  WithSuperadminRole,
  WithViewEntityReportPermission,
  WithViewSchedulerReportPermission,
  withPage,
} from '@/shared';
import { HttpStatusCode } from 'axios';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages';

// https://reactrouter.com/en/6.21.1/routers/create-browser-router
export const createRouter = ({
  isBrowserSupported,
}: {
  isBrowserSupported: boolean;
}): ReturnType<typeof createBrowserRouter> => {
  if (!isBrowserSupported)
    return createBrowserRouter([
      {
        element: <AppBoundary />,
        children: [
          {
            path: '/browser-not-supported',
            element: <BrowserNotSupportedPage />,
          },
          {
            path: '*',
            element: <Navigate to="/browser-not-supported" />,
          },
        ],
      },
    ]);

  return createBrowserRouter([
    {
      // https://reactrouter.com/en/main/components/outlet
      element: <AppBoundary />,
      children: [
        // Home
        {
          path: '/',
          element: WithAuth(HomePage),
        },

        // Login
        {
          path: '/login',
          element: <LoginPage />,
        },
        {
          path: '/login-link',
          element: <LoginLinkPage />,
        },

        // Mail
        {
          path: '/mail',
          element: WithAuth(MailingPage),
        },

        // Multichat
        {
          path: '/chat',
          element: WithAuth(MultichatPage),
        },
        {
          path: '/chat/:chatId',
          element: WithAuth(MultichatPage),
        },
        {
          path: '/chat/:chatId/message/:messageId',
          element: WithAuth(MultichatPage),
        },

        // Notes
        {
          path: '/notes',
          element: WithAuth(NotesPage),
        },

        // Tasks and Activities
        {
          path: '/activities/:tab/:view?/:year?/:month?/:day?',
          element: WithAuth(withPage(ActivitiesPage)),
        },
        {
          path: '/tasks/deadline/:tab/:view?/:year?/:month?/:day?',
          element: WithAuth(withPage(TimeBoardPage)),
        },
        {
          path: '/tasks/b/:boardId/:tab/:view?/:year?/:month?/:day?',
          element: WithAuth(withPage(TasksPage)),
        },
        {
          path: '/tasks/b/:boardId/board-settings',
          element: WithAuth(TasksBoardSettingsPage),
        },

        // Entities list and board
        {
          path: '/et/:entityTypeId/list',
          element: WithAuth(withPage(EntitiesListPage)),
        },
        {
          path: `/et/:entityTypeId/list/${EntitiesBoardSettingsTab.AUTOMATION}`,
          element: WithAdminRole(withPage(EntitiesListAutomationPage)),
        },
        {
          path: `/et/:entityTypeId/list/${EntitiesBoardSettingsTab.AUTOMATION_BPMN}`,
          element: WithAdminRole(withPage(ListSectionAutomationProcessesPage)),
        },
        {
          path: '/et/:entityTypeId/b/:boardId/:tab/:view?',
          element: WithViewEntityReportPermission(withPage(EntitiesPage)),
        },
        {
          path: '/et/:entityTypeId/everything',
          element: WithAuth(withPage(EverythingPage)),
        },
        {
          path: '/et/:entityTypeId/b/:boardId/board-settings/:tab',
          element: WithAdminRole(withPage(EntitiesBoardSettingsPage)),
        },
        {
          path: `/et/:entityTypeId/b/:boardId/board-settings/${EntitiesBoardSettingsTab.AUTOMATION_BPMN}`,
          element: WithAdminRole(withPage(AutomationProcessesPage)),
        },

        // Set sales goals page
        {
          path: '/et/:entityTypeId/goal-settings',
          element: WithAdminRole(withPage(GoalSettingsPage)),
        },

        // Entity card
        {
          path: '/et/:entityTypeId/card/:entityId/:tab/:view?/:year?/:month?/:day?',
          element: WithAuth(CardPage),
        },
        {
          path: '/et/:entityTypeId/card/add',
          element: WithAuth(AddCardPage),
        },

        // Users settings
        {
          path: '/settings/users/list',
          element: WithAdminRole(UsersSettingsPage),
        },
        {
          path: '/settings/users/list/new',
          element: WithAdminRole(EditUserPage),
        },
        {
          path: '/settings/users/groups',
          element: WithAdminRole(EditDepartmentsPage),
        },
        {
          path: '/settings/users/list/:id',
          element: WithAdminRole(EditUserPage),
        },

        // Billing
        {
          path: '/settings/billing/common',
          element: WithAdminRole(CommonBillingPage, false),
        },
        {
          path: '/settings/billing/stripe',
          element: WithAdminRole(StripeBillingPage, false),
        },
        {
          path: '/settings/billing/invoice',
          element: WithAdminRole(MyworkRequestInvoiceBillingPage, false),
        },

        {
          path: '/settings/general',
          element: WithAdminRole(GeneralSettingsPage),
        },
        {
          path: '/settings/api',
          element: WithAdminRole(AccountApiAccessPage),
        },
        {
          path: '/settings/superadmin',
          element: WithSuperadminRole(SuperadminPage),
        },
        {
          // Change carefully, should be synced with backend
          path: '/settings/integrations',
          element: WithAuth(IntegrationsPage),
        },
        // Wazzup wauth – do not change the path
        // https://wazzup24.com/help/api-en/wauth/
        {
          path: '/settings/integrations/wazzup/wauth',
          element: WithAuth(IntegrationsPage),
        },
        {
          path: '/settings/mailing',
          element: WithAuth(MailingSettingsPage),
        },
        {
          // Google calendar backlink leads here – do not change the path
          path: '/settings/integrations/google-calendar',
          element: WithAuth(GoogleCalendarRedirectPage),
        },

        // Documents creation settings
        {
          path: '/settings/documents/templates',
          element: WithAdminRole(DocumentTemplatesPage),
        },
        {
          path: '/settings/documents/fields',
          element: WithAdminRole(DocumentCreationFieldsPage),
        },

        // Calls settings
        {
          path: '/settings/calls/account',
          element: WithAdminRole(CallsSettingsAccountPage),
        },
        {
          path: '/settings/calls/users',
          element: WithAdminRole(CallsSettingsUsersPage),
        },
        {
          path: '/settings/calls/scenarios',
          element: WithAdminRole(CallsConfiguringScenariosPage),
        },
        {
          path: '/settings/calls/sip-registrations',
          element: WithAdminRole(CallsSipRegistrationsPage),
        },

        // Builder
        {
          path: '/builder/:tab',
          element: WithAdminRole(BuilderHomePage),
        },

        // Builder – Entity type
        {
          path: '/builder/et/:moduleId?',
          element: WithAdminRole(EtSectionBuilderPage),
        },

        // Builder – Products
        {
          path: '/builder/products/:moduleId?',
          element: WithAdminRole(ProductsSectionBuilderPage),
        },

        // Builder – Scheduler
        {
          path: '/builder/scheduler/:moduleId?',
          element: WithAdminRole(SchedulerBuilderPage),
        },

        // Builder – Forms
        {
          path: '/builder/site-forms/:moduleId?',
          element: WithAdminRole(SiteFormBuilderPage),
        },
        {
          path: '/builder/site-forms/headless/:moduleId?',
          element: WithAdminRole(HeadlessSiteFormBuilderPage),
        },
        {
          path: '/builder/site-forms/online-booking/:moduleId?',
          element: WithAdminRole(OnlineBookingSiteFormBuilderPage),
        },

        // Partners page
        {
          path: '/partners/:partnerId',
          element: WithPartnerRole(PartnerInfoPage),
        },

        // Products
        {
          path: '/p/:sectionType/:sectionId/product/:productId',
          element: WithAuth(withPage(ProductPage)),
        },
        {
          path: '/p/:sectionType/:sectionId/:tab',
          element: WithAuth(ProductsPage),
        },

        // Shipments
        {
          path: '/p/:sectionType/:sectionId/shipments/:shipmentId',
          element: WithAuth(ShipmentPage),
        },

        // Scheduler
        {
          path: '/scheduler/:scheduleType/:scheduleId/:tab',
          element: WithViewSchedulerReportPermission(withPage(SchedulerPage)),
        },

        // System pages
        {
          path: `/${HttpStatusCode.Forbidden}`,
          element: <ForbiddenPage />,
        },
        {
          path: `/${HttpStatusCode.NotFound}`,
          element: <NotFoundPage />,
        },

        // Wildcard
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ]);
};
