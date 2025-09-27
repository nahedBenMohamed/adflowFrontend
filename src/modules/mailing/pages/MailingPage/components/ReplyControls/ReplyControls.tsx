import { MyDropdown, MyDropdownList, type Option } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { ForwardIcon, ReplyIcon } from '../../../../shared';

const Root = styled.div<{ $disabled?: boolean }>`
  width: fit-content;

  display: flex;

  box-shadow:
    0px 0px 2px #c3cdde,
    0px 1px 2px #d0daeb;
  border-radius: var(--border-radius-element);

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.6;
    `}
`;

interface ButtonWrapper {
  $active?: boolean;
  $mirrored?: boolean;
}

const ButtonWrapper = styled.button<ButtonWrapper>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 8px 16px;
  transition: var(--transition-200);
  background-color: ${p =>
    p.$active ? 'var(--graphite-graphite-40)' : 'var(--primary-statuses-white-0)'};

  ${p =>
    p.$mirrored
      ? css`
          border-top-right-radius: var(--border-radius-element);
          border-bottom-right-radius: var(--border-radius-element);
        `
      : css`
          border-top-left-radius: var(--border-radius-element);
          border-bottom-left-radius: var(--border-radius-element);
        `}

  &:hover {
    cursor: pointer;

    background-color: ${p =>
      p.$active ? 'var(--graphite-graphite-40)' : 'var(--graphite-graphite-20)'};
  }

  &:active {
    background-color: var(--graphite-graphite-40);
  }
`;

const Delimiter = styled.div`
  width: 1px;

  background-color: var(--graphite-graphite-80);
`;

const ArrowIconWrapper = styled.div`
  width: 16px;
  height: 16px;
`;

interface Props {
  disabled?: boolean;
  onReply: () => void;
  onReplyAll: () => void;
  onForward: () => void;
}

const ReplyControls = (props: Props) => {
  const { disabled, onReply, onReplyAll, onForward } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.reply_controls',
  });

  const [isReplyDropdownOpened, { close, open }] = useDisclosure(false);

  const handleSelectReplyType = useCallback(
    (option: Option<Function>) => {
      option.value();

      close();
    },
    [close]
  );

  const replyOptions = useMemo<Option<Function>[]>(
    () => [
      { label: t('reply'), value: onReply },
      { label: t('reply_all'), value: onReplyAll },
    ],
    [t, onReply, onReplyAll]
  );

  return (
    <Root $disabled={disabled}>
      <MyDropdown
        withinPortal
        opened={isReplyDropdownOpened}
        position="bottom"
        Button={
          <ButtonWrapper $active={isReplyDropdownOpened}>
            <ArrowIconWrapper>
              <ReplyIcon />
            </ArrowIconWrapper>

            {t('reply')}
          </ButtonWrapper>
        }
        hide={close}
        show={open}
      >
        <MyDropdownList options={replyOptions} onSelect={handleSelectReplyType} />
      </MyDropdown>

      <Delimiter />

      <ButtonWrapper $mirrored onClick={onForward}>
        <ArrowIconWrapper>
          <ForwardIcon />
        </ArrowIconWrapper>

        {t('forward')}
      </ButtonWrapper>
    </Root>
  );
};

export { ReplyControls };
