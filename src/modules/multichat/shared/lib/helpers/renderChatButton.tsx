import { CreateRoundButton } from '@/shared';
import type { ReactNode } from 'react';
import { CreateAmworkChatButton } from '../components';
import { ChatProviderType, type ChatProvider } from '../models';

export const renderChatButton = (provider?: ChatProvider): ReactNode => {
  if (!provider) return <CreateRoundButton disabled />;

  switch (provider.type) {
    case ChatProviderType.AMWORK:
      return <CreateAmworkChatButton provider={provider} />;

    default:
      return <CreateRoundButton disabled />;
  }
};
