import type { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AddBlueIcon } from '../../../../../assets';
import { TruncateMixin } from '../../../../mixins';
import { SpanWithEllipsis } from '../../../SpanWithEllipsis/SpanWithEllipsis';

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg path {
    transition: var(--transition-200);
  }
`;

const Root = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-blue-default);

  padding: 12px 8px 8px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-blue-hover);

    ${IconWrapper} svg path {
      fill: var(--button-text-blue-hover);
    }
  }

  &:active {
    color: var(--button-text-blue-active);

    ${IconWrapper} svg path {
      fill: var(--button-text-blue-active);
    }
  }

  ${TruncateMixin}
`;

const AddAsNewButton = (props: HTMLAttributes<HTMLButtonElement>) => {
  const { t } = useTranslation();

  return (
    <Root {...props}>
      <IconWrapper>
        <AddBlueIcon />
      </IconWrapper>

      <SpanWithEllipsis text={t('add_as_new')} showTitle={false} />
    </Root>
  );
};

export { AddAsNewButton };
