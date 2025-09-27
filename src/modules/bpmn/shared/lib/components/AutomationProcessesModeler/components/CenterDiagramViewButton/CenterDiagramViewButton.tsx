import { PrimaryButton } from '@/shared';
import type BpmnModeler from 'bpmn-js/lib/Modeler';
import type Canvas from 'diagram-js/lib/core/Canvas';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CenterDiagramIcon } from '../../../../../assets';

const Root = styled.div`
  position: absolute;
  left: 16px;
  bottom: calc(var(--bpmn-automation-process-save-controls-height) + 16px);
`;

interface Props {
  modeler: BpmnModeler;
}

const CenterDiagramViewButton = memo((props: Props) => {
  const { modeler } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.bpmn_automations_processes_modeler',
  });

  const handleCenterView = useCallback(() => {
    if (modeler) {
      const modelerCanvas = modeler.get<Canvas>('canvas');

      modelerCanvas.zoom('fit-viewport');
    }
  }, [modeler]);

  return (
    <Root>
      <PrimaryButton
        variant="outlined"
        iconProps={{
          Icon: <CenterDiagramIcon />,
          path: {
            pathFill: 'var(--button-text-graphite-secondary-text)',
            pathFillHover: 'var(--button-text-graphite-primary-text)',
          },
        }}
        onClick={handleCenterView}
      >
        {t('center_view')}
      </PrimaryButton>
    </Root>
  );
});

CenterDiagramViewButton.displayName = 'CenterDiagramViewButton';
export { CenterDiagramViewButton };
