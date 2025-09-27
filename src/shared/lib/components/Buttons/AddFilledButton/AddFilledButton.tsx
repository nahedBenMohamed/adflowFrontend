import { memo, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PlusOutlinedIcon } from '../../../../assets';

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }
`;

const Root = styled.button<{ $withLeftMargin?: boolean }>`
  width: fit-content;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);

  padding: 4px 8px;
  border-radius: var(--border-radius-element);
  background: var(--graphite-graphite-20);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--graphite-graphite-840);

    background: #f3fded;

    ${IconWrapper} svg path {
      stroke: var(--graphite-graphite-840);
    }
  }

  &:active {
    color: var(--button-text-graphite-primary-text);

    background: #e6fbda;

    ${IconWrapper} svg path {
      stroke: var(--button-text-graphite-primary-text);
    }
  }

  ${p => p.$withLeftMargin && `margin-left: 22px`};
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  text?: string;
  withLeftMargin?: boolean;
}

const AddFilledButton = memo((props: Props) => {
  const { text, withLeftMargin, ...rest } = props;

  const { t } = useTranslation();

  return (
    <Root $withLeftMargin={withLeftMargin} type="button" {...rest}>
      <IconWrapper>
        <PlusOutlinedIcon />
      </IconWrapper>

      {text ? text : t('buttons.add')}
    </Root>
  );
});

AddFilledButton.displayName = 'AddFilledButton';
export { AddFilledButton };
