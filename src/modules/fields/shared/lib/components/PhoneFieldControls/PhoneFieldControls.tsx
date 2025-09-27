import { generalSettingsStore, SettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  FieldLinkWrapper,
  type GenerateExternalChatLinkHandler,
  generateTelegramExternalLink,
  generateWhatsAppExternalLink,
  PhoneCallIcon,
  sanitizeAndModifyPhoneNumber,
  TelegramIcon,
  TelegramLinkWrapper,
  TimezoneLoaderWrapper,
  TimezoneWrapper,
  useCardFieldHelperContext,
  useMakeCallContext,
  WhatsAppIcon,
  WhatsAppLinkWrapper,
} from '@/modules/fields';
import {
  chatApi,
  type ChatProvider,
  ChatProviderTransport,
  useMultichatContext,
} from '@/modules/multichat';
import {
  CallFromNumber,
  CallFromSipRegId,
  useGetVoximplantPhoneNumbers,
  useGetVoximplantSIPRegistrations,
  useTelephonyContext,
  VOXIMPLANT_NUMBERS_SETTINGS_KEY,
  voximplantConnectorStore,
  VoximplantNumbersSettings,
} from '@/modules/telephony';
import {
  EntityInfo,
  envUtil,
  generateCountryCodeFromLanguage,
  Language,
  MiniLoader,
  MyDropdown,
  MyDropdownItemRoot,
  MyDropdownList,
  MyDropdownListRoot,
  MyTooltip,
  type Nullable,
  type Option,
  UtcDate,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { isPossiblePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { observer } from 'mobx-react-lite';
import { getLocalInfo } from 'phone-number-to-timezone';
import { type MouseEvent, type ReactNode, useCallback, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useGetCreateExternalChatHandler } from '../../hooks';
import type { PhoneUserInfo } from '../../models';
import { TimezoneHint } from '../TimezoneHint/TimezoneHint';
import { ConditionalPopover } from './ConditionalPopover';

type OpenProvidersDropdownHandler = (availableProviders: ChatProvider[]) => void;

interface Props {
  phone: string;
  isPhoneUserInfoLoading: boolean;
  tableView?: boolean;
  phoneUserInfo?: PhoneUserInfo;
}

const PhoneFieldControls = observer((props: Props) => {
  const { phone, isPhoneUserInfoLoading, tableView, phoneUserInfo } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.field_value',
  });

  const { settings: voximplantNumbersSettings } =
    SettingsStore.getSettingsStore<VoximplantNumbersSettings>(VOXIMPLANT_NUMBERS_SETTINGS_KEY);

  const { user: currentUser } = authStore;
  const accessibleUserId = currentUser?.id;
  const { accountSettings } = generalSettingsStore;

  const isRULocale = accountSettings?.language === Language.RUSSIAN;

  const helperContext = useCardFieldHelperContext();
  const makeCallContextValue = useMakeCallContext();
  const { show: showMultichatModal } = useMultichatContext();
  const { show: showTelephonyModal } = useTelephonyContext();

  const {
    loggedIn,
    connectedToVoximplant,
    isLoaded: isVoximplantConnectorStoreLoaded,
    setEntityInfo,
    setLinkedEntityInfo,
    startOutgoingCallFromNumber,
    startOutgoingCallFromSipRegistration,
  } = voximplantConnectorStore;

  const { data: voximplantPhoneNumbers, isLoading: areVoximplantPhoneNumbersLoading } =
    useGetVoximplantPhoneNumbers({ accessibleUserId });
  const { data: voximplantSipRegistrations, isLoading: areVoximplantSipRegistrationsLoading } =
    useGetVoximplantSIPRegistrations({ accessibleUserId });

  const [isNumbersDropdownOpened, { open: openNumbersDropdown, close: hideNumbersDropdown }] =
    useDisclosure(false);

  const voximplantPhoneNumbersOptions = useMemo<Option<CallFromNumber | CallFromSipRegId>[]>(() => {
    const voximplantPhoneNumbersOptions =
      voximplantPhoneNumbers
        // to prevent legacy errors (cases where phoneNumber is an empty string)
        ?.filter(n => n.phoneNumber)
        .map(n => ({ label: n.phoneNumber, value: new CallFromNumber(n.phoneNumber) })) ?? [];

    const voximplantSipRegistrationsOptions: Option<CallFromSipRegId>[] = [];

    if (voximplantSipRegistrations)
      voximplantSipRegistrations.forEach(r =>
        voximplantSipRegistrationsOptions.push({
          label: r.name,
          value: new CallFromSipRegId(r.externalId),
        })
      );

    return [...voximplantPhoneNumbersOptions, ...voximplantSipRegistrationsOptions];
  }, [voximplantPhoneNumbers, voximplantSipRegistrations]);

  const firstVoximplantCallFromOption = useMemo<
    Nullable<Option<CallFromNumber | CallFromSipRegId>>
  >(() => voximplantPhoneNumbersOptions[0] ?? null, [voximplantPhoneNumbersOptions]);

  const isTelephonyActive = connectedToVoximplant && loggedIn;

  const [availableProviders, setAvailableProviders] = useState<ChatProvider[]>([]);

  const [whatsAppChatOpening, setWhatsAppChatOpening] = useState(false);
  const [
    whatsAppProvidersDropdownOpened,
    { open: openWhatsAppProvidersDropdown, close: closeWhatsAppProvidersDropdown },
  ] = useDisclosure(false);

  const [telegramChatOpening, setTelegramChatOpening] = useState(false);
  const [
    telegramProvidersDropdownOpened,
    { open: openTelegramProvidersDropdown, close: closeTelegramProvidersDropdown },
  ] = useDisclosure(false);

  const [chatUnavailableTooltipShown, setChatUnavailableTooltipShown] = useState(false);

  const getTimezone = useCallback((phoneNumber: string): Nullable<string> => {
    const zoneInfo = getLocalInfo(phoneNumber);

    return zoneInfo?.time ? String(zoneInfo.time.display) : null;
  }, []);

  const getStartCallHandler = useCallback(
    (phoneNumber: string) => (callFromNumberOption: Option<CallFromNumber | CallFromSipRegId>) => {
      if (!makeCallContextValue) return;

      if (voximplantConnectorStore.callState.call) {
        console.error(
          `Failed to start outgoing call, call already exists ${voximplantConnectorStore.callState.call.id()}, there must be only one active call at a time`
        );

        return;
      }

      flushSync(() => {
        hideNumbersDropdown();
      });

      const { entity, linkedEntity } = makeCallContextValue;

      if (entity) {
        setEntityInfo(EntityInfo.fromEntity({ entity, hasAccess: true }));

        if (linkedEntity)
          setLinkedEntityInfo(EntityInfo.fromEntity({ entity: linkedEntity, hasAccess: true }));
      }

      if (helperContext?.reloadFeed)
        voximplantConnectorStore.setReloadFeedFn(helperContext.reloadFeed);

      if (callFromNumberOption.value instanceof CallFromNumber) {
        startOutgoingCallFromNumber({
          callFromNumber: callFromNumberOption.value.number,
          callToNumber: sanitizeAndModifyPhoneNumber({ phoneNumber, isRULocale }),
          handlers: {
            onInfoReceived: showTelephonyModal,
          },
        });
      } else if (callFromNumberOption.value instanceof CallFromSipRegId) {
        startOutgoingCallFromSipRegistration({
          callFromSipRegExternalId: callFromNumberOption.value.sipRegId,
          callToNumber: sanitizeAndModifyPhoneNumber({ phoneNumber, isRULocale }),
          handlers: {
            onInfoReceived: showTelephonyModal,
          },
        });
      } else {
        throw new Error(
          `Failed to start outgoing call from PhoneField, neither callFromNumber nor sipRegId is specified: ${callFromNumberOption.value}`
        );
      }

      // to ensure that lastCallFromNumber is set after numbers dropdown was closed, for ui purposes
      setTimeout(() => {
        if (callFromNumberOption.value instanceof CallFromNumber) {
          voximplantNumbersSettings.lastCallFromNumber = callFromNumberOption.value.number;
          voximplantNumbersSettings.lastCallFromSipRegId = null;

          return;
        }

        if (callFromNumberOption.value instanceof CallFromSipRegId) {
          voximplantNumbersSettings.lastCallFromSipRegId = callFromNumberOption.value.sipRegId;
          voximplantNumbersSettings.lastCallFromNumber = null;
        }
      }, 250);
    },
    [
      isRULocale,
      helperContext,
      makeCallContextValue,
      voximplantNumbersSettings,
      setEntityInfo,
      showTelephonyModal,
      setLinkedEntityInfo,
      hideNumbersDropdown,
      startOutgoingCallFromNumber,
      startOutgoingCallFromSipRegistration,
    ]
  );

  const handleOpenWhatsAppProvidersDropdown = useCallback<OpenProvidersDropdownHandler>(
    availableWhatsAppProviders => {
      setAvailableProviders(availableWhatsAppProviders);

      openWhatsAppProvidersDropdown();
    },
    [openWhatsAppProvidersDropdown]
  );

  const handleOpenTelegramProvidersDropdown = useCallback<OpenProvidersDropdownHandler>(
    availableTelegramProviders => {
      setAvailableProviders(availableTelegramProviders);

      openTelegramProvidersDropdown();
    },
    [openTelegramProvidersDropdown]
  );

  const handleCloseWhatsAppProvidersDropdown = useCallback(() => {
    setAvailableProviders([]);

    closeWhatsAppProvidersDropdown();
  }, [closeWhatsAppProvidersDropdown]);

  const handleCloseTelegramProvidersDropdown = useCallback(() => {
    setAvailableProviders([]);

    closeTelegramProvidersDropdown();
  }, [closeTelegramProvidersDropdown]);

  const createExternalChatHandler = useGetCreateExternalChatHandler(
    handleCloseWhatsAppProvidersDropdown
  );

  const getOpenChatHandler = useCallback(
    ({
      phoneNumber,
      transport,
      setChatOpening,
      handleOpenDropdown,
      generateExternalChatLink,
    }: {
      phoneNumber: string;
      transport: ChatProviderTransport;
      setChatOpening: (opening: boolean) => void;
      handleOpenDropdown: OpenProvidersDropdownHandler;
      generateExternalChatLink: GenerateExternalChatLinkHandler;
    }) =>
      async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.stopPropagation();

        phoneNumber = sanitizeAndModifyPhoneNumber({ phoneNumber, isRULocale });

        const handleOpenExternalChat = () =>
          window.open(
            generateExternalChatLink({ phoneNumber, isRULocale }),
            '_blank',
            'noopener,noreferrer'
          );

        if (helperContext && helperContext.entityId && currentUser) {
          const { providers } = helperContext;

          const availableProviders = providers?.filter(p => p.transport === transport);

          try {
            setChatOpening(true);

            const chat = (
              await chatApi.findEntityChats({
                transport,
                phoneNumber,
                entityId: helperContext.entityId,
              })
            )[0];

            // if we found existing chat -> open it
            if (chat) {
              if (chat.hasAccess) {
                showMultichatModal({
                  activeChatId: chat.id,
                  activeProviderId: chat.providerId,
                });

                setChatUnavailableTooltipShown(false);
              } else {
                setChatUnavailableTooltipShown(true);
              }

              return;
            } else if (
              availableProviders &&
              availableProviders.length === 1 &&
              availableProviders[0]
            ) {
              // if we didn't find chat and we have one provider -> create chat with it
              createExternalChatHandler({
                phoneNumber,
                provider: availableProviders[0],
              })();
            } else if (availableProviders && availableProviders.length > 1) {
              // if we didn't find chat but we have multiple providers -> open dropdown
              // where user can choose chat provider for chat creation
              handleOpenDropdown(availableProviders);
            } else {
              // if we didn't find chat and we don't have any providers -> open external chat
              handleOpenExternalChat();
            }
          } catch (e) {
            throw new Error(
              `Error while finding entity ${helperContext.entityId} chat for phoneNumber ${phoneNumber} or creating external chat: ${e}`
            );
          } finally {
            setChatOpening(false);
          }
        } else {
          // if we don't have helperContext or currentUser -> open external chat
          handleOpenExternalChat();
        }
      },
    [isRULocale, currentUser, helperContext, createExternalChatHandler, showMultichatModal]
  );

  const handleOpenWhatsAppChat = getOpenChatHandler({
    phoneNumber: phone,
    transport: ChatProviderTransport.WHATSAPP,
    setChatOpening: setWhatsAppChatOpening,
    handleOpenDropdown: handleOpenWhatsAppProvidersDropdown,
    generateExternalChatLink: generateWhatsAppExternalLink,
  });

  const handleOpenTelegramChat = getOpenChatHandler({
    phoneNumber: phone,
    transport: ChatProviderTransport.TELEGRAM,
    setChatOpening: setTelegramChatOpening,
    handleOpenDropdown: handleOpenTelegramProvidersDropdown,
    generateExternalChatLink: generateTelegramExternalLink,
  });

  const timezone = getTimezone(phone);

  const ProvidersList = useMemo<ReactNode>(
    () =>
      availableProviders.length ? (
        <MyDropdownListRoot $maxHeight="256px">
          {availableProviders.map(p => (
            <MyDropdownItemRoot
              key={p.id}
              onClick={createExternalChatHandler({
                provider: p,
                phoneNumber: phone,
              })}
            >
              {p.title}
            </MyDropdownItemRoot>
          ))}
        </MyDropdownListRoot>
      ) : null,
    [phone, availableProviders, createExternalChatHandler]
  );

  return (
    <>
      {accountSettings &&
      (isPossiblePhoneNumber(phone, {
        defaultCountry: generateCountryCodeFromLanguage(accountSettings.language),
      }) ||
        isValidPhoneNumber(`+${phone}`)) ? (
        <>
          {/* If phone number is valid local RU number or valid international number – we allow to call it and create external chat with it ... */}
          {makeCallContextValue &&
            envUtil.voximplantShowTelephony &&
            isTelephonyActive &&
            isVoximplantConnectorStoreLoaded &&
            voximplantPhoneNumbers && (
              <>
                {voximplantPhoneNumbersOptions.length === 1 && firstVoximplantCallFromOption ? (
                  <FieldLinkWrapper
                    as="button"
                    type="button"
                    title={
                      // there can be only one active call at a time
                      voximplantConnectorStore.callState.call
                        ? t('already_have_an_active_call')
                        : undefined
                    }
                    disabled={Boolean(voximplantConnectorStore.callState.call)}
                    onClick={
                      voximplantConnectorStore.callState.call
                        ? undefined
                        : () => getStartCallHandler(phone)(firstVoximplantCallFromOption)
                    }
                  >
                    <PhoneCallIcon />
                  </FieldLinkWrapper>
                ) : (
                  <MyDropdown
                    withinPortal
                    position="bottom-start"
                    opened={
                      voximplantConnectorStore.callState.call ? false : isNumbersDropdownOpened
                    }
                    Button={
                      <FieldLinkWrapper
                        as="button"
                        type="button"
                        $primaryActive={isNumbersDropdownOpened}
                        disabled={Boolean(voximplantConnectorStore.callState.call)}
                        title={
                          voximplantConnectorStore.callState.call
                            ? undefined
                            : t('already_have_an_active_call')
                        }
                      >
                        <PhoneCallIcon />
                      </FieldLinkWrapper>
                    }
                    show={openNumbersDropdown}
                    hide={hideNumbersDropdown}
                  >
                    <MyDropdownList
                      maxHeight="300px"
                      options={voximplantPhoneNumbersOptions}
                      optionsMeta={
                        voximplantNumbersSettings.lastCallFromNumber ||
                        voximplantNumbersSettings.lastCallFromSipRegId
                          ? [
                              {
                                meta: t('recent'),
                                value: voximplantNumbersSettings.lastCallFromNumber
                                  ? new CallFromNumber(voximplantNumbersSettings.lastCallFromNumber)
                                  : voximplantNumbersSettings.lastCallFromSipRegId
                                    ? new CallFromSipRegId(
                                        voximplantNumbersSettings.lastCallFromSipRegId
                                      )
                                    : null,
                              },
                            ]
                          : undefined
                      }
                      noOptionsMessage={t('no_available_phone_numbers')}
                      optionsLoading={
                        areVoximplantPhoneNumbersLoading || areVoximplantSipRegistrationsLoading
                      }
                      onSelect={
                        voximplantConnectorStore.callState.call
                          ? () => {}
                          : getStartCallHandler(phone)
                      }
                    />
                  </MyDropdown>
                )}
              </>
            )}

          {!tableView && (
            <>
              {!envUtil.voximplantShowTelephony && (
                <FieldLinkWrapper to={`tel:${phone}`}>
                  <PhoneCallIcon />
                </FieldLinkWrapper>
              )}

              <ConditionalPopover
                popoverOpened={whatsAppProvidersDropdownOpened}
                tooltipShown={chatUnavailableTooltipShown}
                tooltipLabel={t('chat_unavailable')}
                Target={
                  <WhatsAppLinkWrapper
                    as="button"
                    type="button"
                    $loading={whatsAppChatOpening}
                    $secondaryActive={whatsAppProvidersDropdownOpened}
                    onClick={handleOpenWhatsAppChat}
                  >
                    <WhatsAppIcon />
                  </WhatsAppLinkWrapper>
                }
                PopoverChildren={ProvidersList}
                hidePopover={handleCloseWhatsAppProvidersDropdown}
              />

              <ConditionalPopover
                popoverOpened={telegramProvidersDropdownOpened}
                tooltipShown={chatUnavailableTooltipShown}
                tooltipLabel={t('chat_unavailable')}
                Target={
                  <TelegramLinkWrapper
                    as="button"
                    type="button"
                    $loading={telegramChatOpening}
                    onClick={handleOpenTelegramChat}
                  >
                    <TelegramIcon />
                  </TelegramLinkWrapper>
                }
                PopoverChildren={ProvidersList}
                hidePopover={handleCloseTelegramProvidersDropdown}
              />
            </>
          )}
        </>
      ) : (
        //  ... else we don't allow to call, but we still can try to redirect to WhatsApp, Telegram application, or to the phone number link
        !tableView && (
          <>
            {!envUtil.voximplantShowTelephony && (
              <FieldLinkWrapper to={`tel:${phone}`}>
                <PhoneCallIcon />
              </FieldLinkWrapper>
            )}

            <WhatsAppLinkWrapper
              target="_blank"
              rel="noopener noreferrer"
              to={generateWhatsAppExternalLink({ phoneNumber: phone, isRULocale })}
            >
              <WhatsAppIcon />
            </WhatsAppLinkWrapper>

            <TelegramLinkWrapper
              target="_blank"
              rel="noopener noreferrer"
              to={generateTelegramExternalLink({ phoneNumber: phone, isRULocale })}
            >
              <TelegramIcon />
            </TelegramLinkWrapper>
          </>
        )
      )}

      {envUtil.voximplantShowTelephony &&
        !isTelephonyActive &&
        isVoximplantConnectorStoreLoaded &&
        !voximplantPhoneNumbers && (
          <MyTooltip withinPortal label={t('connect_telephony')}>
            <FieldLinkWrapper as="button" type="button" disabled>
              <PhoneCallIcon />
            </FieldLinkWrapper>
          </MyTooltip>
        )}

      {isPhoneUserInfoLoading ? (
        <TimezoneLoaderWrapper $tableView={tableView}>
          <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
        </TimezoneLoaderWrapper>
      ) : (
        (timezone || phoneUserInfo) && (
          <MyTooltip
            multiline
            maxWidth={320}
            label={<TimezoneHint phoneUserInfo={phoneUserInfo ?? null} />}
          >
            <TimezoneWrapper $tableView={tableView}>
              {phoneUserInfo && phoneUserInfo.utcOffset
                ? UtcDate.nowWithoutUnix()
                    .addHoursWithoutUnix(phoneUserInfo.utcOffset)
                    .formatWithoutUnix('HH:mm')
                : timezone}
            </TimezoneWrapper>
          </MyTooltip>
        )
      )}
    </>
  );
});

PhoneFieldControls.displayName = 'PhoneFieldControls';
export { PhoneFieldControls };
