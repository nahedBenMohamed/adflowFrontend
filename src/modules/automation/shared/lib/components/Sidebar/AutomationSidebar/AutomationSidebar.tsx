import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getActionTypeEntityTypeInfos } from '../../../helpers';
import { Block } from '../../Block/Block';
import { ActionTypeBlock } from '../ActionTypeBlock/ActionTypeBlock';

const Root = styled.div`
  width: 242px;

  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 16px;

  margin-right: 14px;
`;

const HeaderAutomationBlock = styled(Block)`
  height: 38px;

  padding: 8px 12px;
`;

const actionTypeEntityTypeInfos = getActionTypeEntityTypeInfos();

const AutomationSidebar = memo(() => {
  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.sidebar',
  });

  return (
    <Root>
      <HeaderAutomationBlock>{t('title')}</HeaderAutomationBlock>

      {actionTypeEntityTypeInfos.map(i => (
        <ActionTypeBlock key={i.type} Icon={i.icon}>
          {t(i.type)}
        </ActionTypeBlock>
      ))}
    </Root>
  );
});

AutomationSidebar.displayName = 'AutomationSidebar';
export { AutomationSidebar };
