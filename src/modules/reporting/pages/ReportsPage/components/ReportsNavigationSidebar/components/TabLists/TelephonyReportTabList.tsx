import { useTranslation } from 'react-i18next';
import { ReportsSection } from '../../../../../../shared';

import { CollapsibleGroup, StyledTab } from './components';

const telephonyReportSections = [
  ReportsSection.TELEPHONY_USERS,
  ReportsSection.TELEPHONY_GROUPS,
  ReportsSection.CALL_HISTORY,
];

const TelephonyReportTabList = () => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  return (
    <CollapsibleGroup title={t('telephony')}>
      {telephonyReportSections.map(s => (
        <StyledTab key={s} value={s}>
          {t(s)}
        </StyledTab>
      ))}
    </CollapsibleGroup>
  );
};

export { TelephonyReportTabList };
