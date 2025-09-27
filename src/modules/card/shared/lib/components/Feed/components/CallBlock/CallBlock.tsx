import { userStore } from '@/app';
import { CallDirection, CallStatus, UpdateVoximplantCallDto } from '@/modules/telephony';
import {
  ConvertTimeUtil,
  CreateButton,
  InputModel,
  Player,
  type CallInfo,
  type Optional,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RingingPhoneIcon } from '../../../../../assets';
import { getCallItemIconAndStatus } from '../../../../helpers';
import { useFeedItemOutline } from '../../../../hooks';
import { CallType, type EditTextProps } from '../../../../models';
import {
  AuthorBlock,
  DateBlock,
  FeedItem,
  FeedItemLeftBlock,
  FeedItemTitleTextStyle,
  FeedItemWrapper,
  InfoBlock,
  ItemInfo,
  ResultBlock,
} from '../FeedItem';

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${FeedItemTitleTextStyle}
`;

const Duration = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);

  padding: 4px 12px;
  border-radius: 100px;
  background-color: var(--graphite-graphite-40);
`;

const PlayerWrapper = styled.div`
  margin-top: 16px;
`;

const Bottom = styled.div<{ $column: boolean }>`
  display: flex;
  flex-direction: ${p => (p.$column ? 'column-reverse' : 'row')};
  align-items: ${p => !p.$column && 'center'};

  margin-top: 16px;
`;

const FailedTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);

  padding: 4px 8px;
  margin-left: auto;
  border-radius: var(--border-radius-element);
  background: var(--graphite-graphite-40);
`;

const Dot = styled.div`
  width: 9px;
  height: 9px;

  border-radius: 50%;
  background-color: var(--button-text-graphite-secondary-text);
`;

interface Props {
  call: CallInfo;
  updateCall: ({
    sessionId,
    dto,
  }: {
    sessionId: string;
    dto: UpdateVoximplantCallDto;
  }) => Promise<void>;
}

const callType = ({
  status,
  direction,
  callTooShort,
}: {
  status: CallStatus;
  direction: CallDirection;
  callTooShort: boolean;
}): CallType => {
  switch (true) {
    case status === CallStatus.FAILED && direction === CallDirection.OUTGOING:
    case callTooShort && direction === CallDirection.OUTGOING:
      return CallType.OUTGOING_MISSED;

    case status === CallStatus.MISSED:
    case status === CallStatus.FAILED:
      return CallType.MISSED;

    case direction === CallDirection.INCOMING:
      return CallType.INCOMING;

    case direction === CallDirection.OUTGOING:
    default:
      return CallType.OUTGOING;
  }
};

const CallBlock = observer((props: Props) => {
  const { call, updateCall } = props;

  const {
    userId,
    status,
    duration,
    direction,
    createdAt,
    recordUrl,
    sessionId,
    entityInfo,
    phoneNumber,
  } = call;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed',
  });

  const highlighted = useFeedItemOutline(createdAt);

  const [isEditMode, { open: showEditMode, close: hideEditMode }] = useDisclosure(false);

  const commentModel = useLocalObservable<InputModel>(() =>
    InputModel.create(call.comment ?? undefined)
  );

  const creator = userStore.getById(userId);

  const callTooShort = call.duration ? call.duration < 3 : true;
  const callItemIconAndStatus = getCallItemIconAndStatus(
    callType({ status, direction, callTooShort })
  );

  const showResultBlock = Boolean(call.comment || isEditMode);

  const recordDuration = useMemo<Optional<string>>(() => {
    if (!duration) return;

    const { days, hours, minutes, seconds } = ConvertTimeUtil.getDHMSFromSeconds(duration);

    const d = days ? `${days}${t('call_block.time.d')}` : '';
    const h = hours ? `${hours}${t('call_block.time.h')}` : '';
    const m = minutes ? `${minutes}${t('call_block.time.m')}` : '';
    const s = seconds ? `${seconds}${t('call_block.time.s')}` : '';

    return `${d} ${h} ${m} ${s}`;
  }, [duration, t]);

  const updateComment = useCallback(() => {
    call.comment = commentModel.value;

    updateCall({
      sessionId,
      dto: UpdateVoximplantCallDto.create({ comment: commentModel.value }),
    });

    hideEditMode();
  }, [call, commentModel, sessionId, hideEditMode, updateCall]);

  const editTextProps = useMemo<EditTextProps>(
    () => ({
      isEditMode,
      textModel: commentModel,
      hideEditMode,
      onSave: updateComment,
    }),
    [commentModel, isEditMode, updateComment, hideEditMode]
  );

  const UserBlock = useMemo<ReactNode>(
    () => (
      <AuthorBlock
        user={creator}
        title={t(
          direction === CallDirection.INCOMING ? 'call_block.who_got_call' : 'call_block.who_called'
        )}
      />
    ),
    [creator, direction, t]
  );

  const ContactBlock = useMemo<ReactNode>(
    () => (
      <InfoBlock
        frameVariant="outlined"
        info={entityInfo ? entityInfo.name : phoneNumber}
        infoMeta={entityInfo ? `📞 ${phoneNumber}` : undefined}
        title={t(
          direction === CallDirection.OUTGOING ? 'call_block.who_got_call' : 'call_block.who_called'
        )}
      >
        <RingingPhoneIcon />
      </InfoBlock>
    ),
    [entityInfo, phoneNumber, direction, t]
  );

  return (
    <FeedItemWrapper>
      <FeedItemLeftBlock Icon={callItemIconAndStatus.icon} />

      <FeedItem
        title={
          <Title>
            {t(`call_block.status.${callItemIconAndStatus.status}`)}
            {recordDuration && <Duration>{recordDuration}</Duration>}
          </Title>
        }
        highlighted={highlighted}
      >
        <ItemInfo>
          {direction === CallDirection.INCOMING ? ContactBlock : UserBlock}

          {direction === CallDirection.INCOMING ? UserBlock : ContactBlock}

          <DateBlock title={t('call_block.start_date')} date={createdAt} />
        </ItemInfo>

        {recordUrl && (
          <PlayerWrapper>
            <Player recordUrl={recordUrl} duration={duration} />
          </PlayerWrapper>
        )}

        <Bottom $column={showResultBlock}>
          {showResultBlock ? (
            <ResultBlock
              autoFocus
              bgColor="#f3fded"
              text={call.comment || ''}
              editTextProps={editTextProps}
              handleClick={showEditMode}
            />
          ) : (
            <CreateButton customTitle={t('common.result')} onClick={showEditMode} />
          )}

          {direction === CallDirection.OUTGOING &&
            ([CallStatus.FAILED, CallStatus.CANCELED, CallStatus.MISSED].includes(status) ||
              callTooShort) && (
              <FailedTag>
                <Dot />

                {t('call_block.did_not_get_through')}
              </FailedTag>
            )}
        </Bottom>
      </FeedItem>
    </FeedItemWrapper>
  );
});

CallBlock.displayName = 'CallBlock';
export { CallBlock };
