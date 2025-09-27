import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CreateAutomationButton } from '../../../AutomationProcessesModeler/components';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  padding: 40px 8px;
`;

const EmptyAnnotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const EmptyAnnotationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  entityTypeId: number;
}

const NoAutomationProcessesBlock = (props: Props) => {
  const { entityTypeId } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.bpmn_automations_table.no_bpmn_automations_block',
  });

  return (
    <Root>
      <EmptyAnnotation>{t('annotation1')}</EmptyAnnotation>

      <EmptyAnnotationWrapper>
        <EmptyAnnotation>{t('annotation2')}</EmptyAnnotation>

        <CreateAutomationButton entityTypeId={entityTypeId} />

        <EmptyAnnotation>{t('annotation3')}</EmptyAnnotation>
      </EmptyAnnotationWrapper>
    </Root>
  );
};

export { NoAutomationProcessesBlock };
