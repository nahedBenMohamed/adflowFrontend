import { useTranslation } from 'react-i18next';
import { ReportsSection } from '../../../../../../shared';
import { CollapsibleGroup, StyledTab } from './components';

const comparisonReportSections = [
  ReportsSection.DAYS,
  ReportsSection.WEEKS,
  ReportsSection.MONTHS,
  ReportsSection.QUARTERS,
  ReportsSection.YEARS,
];

const ComparisonReportTabList = () => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  return (
    <CollapsibleGroup title={t('comparison_of_periods')}>
      {comparisonReportSections.map(s => (
        <StyledTab key={s} value={s}>
          {t(s)}
        </StyledTab>
      ))}
    </CollapsibleGroup>
  );
};

export { ComparisonReportTabList };
