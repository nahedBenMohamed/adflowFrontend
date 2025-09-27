import { useTranslation } from 'react-i18next';
import { ReportsSection } from '../../../../../../shared';
import { CollapsibleGroup, StyledTab } from './components';

const generalReportSections = [ReportsSection.USERS, ReportsSection.RATING, ReportsSection.GROUPS];

const GeneralReportTabList = () => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  return (
    <CollapsibleGroup title={t('general_report')}>
      {generalReportSections.map(s => (
        <StyledTab key={s} value={s}>
          {t(s)}
        </StyledTab>
      ))}
    </CollapsibleGroup>
  );
};

export { GeneralReportTabList };
