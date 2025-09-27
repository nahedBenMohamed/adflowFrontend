import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { ChatProviderTransport, useGetChatProviders } from '@/modules/multichat';
import { AddPlaceholderTemplate } from '@/modules/products';
import { MySelect, NoOptionsMessage, type Option, type SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  model: SelectModel;
  setPhoneNumbersAvailable: (value: boolean) => void;
}

const ExternalChatProvidersSelect = observer((props: Props) => {
  const { model, setPhoneNumbersAvailable } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.external_providers_select',
  });

  const { data: providers } = useGetChatProviders();

  const { user: currentUser } = authStore;

  const providerOptions = useMemo<Option<number>[]>(
    () =>
      providers
        ?.filter(p => p.transport !== ChatProviderTransport.AMWORK)
        .map(p => ({
          label: p.title,
          value: p.id,
        })) ?? [],
    [providers]
  );

  const onSelectProvider = useCallback(
    (providerId: Option<number>) => {
      const selectedTransport = providers?.find(p => p.id === providerId.value)?.transport ?? '';

      if (
        ![ChatProviderTransport.WHATSAPP, ChatProviderTransport.TELEGRAM].includes(
          selectedTransport
        )
      ) {
        setPhoneNumbersAvailable(false);
      } else {
        setPhoneNumbersAvailable(true);
      }
    },
    [providers, setPhoneNumbersAvailable]
  );

  return (
    <MySelect
      model={model}
      variant="outlined"
      options={providerOptions}
      handleChangeOption={onSelectProvider}
      noOptionsLabel={
        currentUser?.isAdmin() ? (
          <AddPlaceholderTemplate
            title={t('add_new_provider')}
            link={routes.settingsIntegrations()}
          />
        ) : (
          <NoOptionsMessage>{t('no_available_providers')}</NoOptionsMessage>
        )
      }
    />
  );
});

ExternalChatProvidersSelect.displayName = 'ExternalChatProvidersSelect';
export { ExternalChatProvidersSelect };
