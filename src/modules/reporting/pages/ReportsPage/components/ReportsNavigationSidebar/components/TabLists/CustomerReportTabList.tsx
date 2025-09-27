import { useTranslation } from 'react-i18next';
import { getCustomerReportSections, getLinkedCategories } from '../../../../../../shared';
import { CollapsibleGroup, StyledTab } from './components';

interface Props {
  entityTypeId: number;
}

const CustomerReportTabList = (props: Props) => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.reports_page.components.reports_navigation_sidebar',
  });

  const { entityTypeId } = props;

  const linkedCategories = getLinkedCategories(entityTypeId);
  const customerReportSections = getCustomerReportSections(linkedCategories);

  return (
    customerReportSections.length > 0 && (
      <CollapsibleGroup title={t('customer_reports')}>
        {customerReportSections.map(s => (
          <StyledTab key={s} value={s}>
            {t(s)}
          </StyledTab>
        ))}
      </CollapsibleGroup>
    )
  );
};

export { CustomerReportTabList };
