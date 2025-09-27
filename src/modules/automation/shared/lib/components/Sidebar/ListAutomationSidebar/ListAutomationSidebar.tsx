import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getActionTypeEntityTypeInfos } from '../../../helpers';
import { ActionTypeBlock } from '../ActionTypeBlock/ActionTypeBlock';

const Root = styled.div`
  width: 242px;

  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 16px;

  margin-right: 14px;
`;

const actionTypeEntityTypeInfos = getActionTypeEntityTypeInfos(true);

const ListAutomationSidebar = memo(() => {
  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.sidebar',
  });

  return (
    <Root>
      {actionTypeEntityTypeInfos.map(i => (
        <ActionTypeBlock key={i.type} Icon={i.icon}>
          {t(i.type)}
        </ActionTypeBlock>
      ))}
    </Root>
  );
});

ListAutomationSidebar.displayName = 'ListAutomationSidebar';
export { ListAutomationSidebar };
