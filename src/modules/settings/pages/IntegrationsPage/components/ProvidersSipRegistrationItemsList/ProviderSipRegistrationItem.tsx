import type { PbxProviderType } from '@/modules/telephony';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { IntegrationItem } from '../IntegrationItem/IntegrationItem';
import { SipRegistrationGuideModal } from './SipRegistrationGuideModal';

interface Props {
  Icon: ReactNode;
  description: string;
  providerType: PbxProviderType;
  count?: number;
  installTo: string;
  manageTo?: string;
}

const ProviderSipRegistrationItem = (props: Props) => {
  const { Icon, description, providerType, count, installTo, manageTo } = props;

  const [isGuideModalOpened, { open: openGuideModal, close: closeGuideModal }] =
    useDisclosure(false);

  return (
    <>
      <IntegrationItem
        Icon={Icon}
        count={count}
        description={description}
        onManageLinkProps={manageTo ? { to: manageTo } : undefined}
        onInstall={openGuideModal}
      />

      {isGuideModalOpened && (
        <SipRegistrationGuideModal
          installTo={installTo}
          providerType={providerType}
          isOpened={isGuideModalOpened}
          onClose={closeGuideModal}
        />
      )}
    </>
  );
};

export { ProviderSipRegistrationItem };
