import { useTranslation } from 'react-i18next';
import { PipelineReportType } from '../../../../../../shared';

interface Props {
  type: PipelineReportType;
}

const DashboardTypeTooltip = (props: Props) => {
  const { type } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.dashboard_page.filter.dashboard_type_tooltip',
  });

  return (
    <ul>
      <li>{t(`${type}.text`)}</li>
      <li>{t(`${type}.list_1`)}</li>
      <li>{t(`${type}.list_2`)}</li>
      <li>{t(`${type}.list_3`)}</li>

      {![PipelineReportType.OPEN, PipelineReportType.CLOSED, PipelineReportType.CREATED].includes(
        type
      ) && <li>{t(`${type}.list_4`)}</li>}
    </ul>
  );
};

export { DashboardTypeTooltip };
