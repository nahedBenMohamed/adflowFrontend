import { MyDropdown, MyDropdownList, type Option } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ForwardIcon, ReplyIcon } from '../../../../../../../assets';

const Root = styled.div`
  display: flex;
`;

interface ButtonWrapper {
  $active?: boolean;
  $mirrored?: boolean;
}

const ButtonWrapper = styled.button<ButtonWrapper>`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px 16px;
  border-radius: ${p => (p.$mirrored ? `0px 100px 100px 0px` : `100px 0px 0px 100px`)};
  border: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    color: var(--graphite-graphite-840);

    border: 1px solid #eff5eb;
    background-color: #eff5eb;

    svg path {
      stroke: var(--button-text-green-active);
    }
  }

  &:active {
    color: var(--button-text-graphite-primary-text);

    border: 1px solid #e6fbda;
    background-color: #e6fbda;

    svg path {
      stroke: var(--button-text-green-hover);
    }
  }
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

interface Props {
  onReply: () => void;
  onReplyAll: () => void;
  onForward: () => void;
}

const ReplyControls = (props: Props) => {
  const { onReply, onReplyAll, onForward } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.reply_controls',
  });

  const [isReplyDropdownOpened, { close: hideReplyDropdown, open: showReplyDropdown }] =
    useDisclosure(false);

  const handleSelectReplyType = (option: Option<Function>) => {
    option.value();
    hideReplyDropdown();
  };

  const replyOptions: Option<Function>[] = [
    { label: t('reply'), value: onReply },
    { label: t('reply_all'), value: onReplyAll },
  ];

  return (
    <Root>
      <MyDropdown
        withinPortal
        opened={isReplyDropdownOpened}
        position="bottom"
        Button={
          <ButtonWrapper type="button" $active={isReplyDropdownOpened}>
            <IconWrapper>
              <ReplyIcon />
            </IconWrapper>

            {t('reply')}
          </ButtonWrapper>
        }
        hide={hideReplyDropdown}
        show={showReplyDropdown}
      >
        <MyDropdownList options={replyOptions} onSelect={handleSelectReplyType} />
      </MyDropdown>

      <ButtonWrapper type="button" $mirrored onClick={onForward}>
        <IconWrapper>
          <ForwardIcon />
        </IconWrapper>

        {t('forward')}
      </ButtonWrapper>
    </Root>
  );
};

export { ReplyControls };
