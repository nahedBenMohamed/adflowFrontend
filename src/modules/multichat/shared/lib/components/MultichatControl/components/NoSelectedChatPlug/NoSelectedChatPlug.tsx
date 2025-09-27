import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  height: 100%;

  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);

  padding: 4px 10px;
  background: var(--background-blue-20);
  border-radius: var(--border-radius-element);
`;

const NoSelectedChatPlug = () => {
  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.no_selected_chat_plug',
  });

  return (
    <Root>
      <Title>{t('title')}</Title>
    </Root>
  );
};

export { NoSelectedChatPlug };
