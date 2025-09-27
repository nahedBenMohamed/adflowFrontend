import { useMultichatContext, type ChatProviderTransport } from '@/modules/multichat';
import { MyTooltip } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getMessengerTagIcon } from '../../helpers';

const Root = styled.button`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  chatId: number;
  providerId: number;
  providerTransport: ChatProviderTransport;
}

const MessengerTag = memo((props: Props) => {
  const { chatId, providerId, providerTransport: providerType } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card',
  });

  const { show } = useMultichatContext();

  const handleOpenChat = () => show({ activeChatId: chatId, activeProviderId: providerId });

  return (
    <MyTooltip withinPortal label={t('open_chat')}>
      <Root type="button" onClick={handleOpenChat}>
        {getMessengerTagIcon(providerType)}
      </Root>
    </MyTooltip>
  );
});

MessengerTag.displayName = 'MessengerTag';
export { MessengerTag };
