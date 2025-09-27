import { routes } from '@/app';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { truncateNumber } from '../../helpers';
import { MyTooltip } from '../MyTooltip/MyTooltip/MyTooltip';

const CommonStyles = css<{ $small?: boolean }>`
  height: 22px;
  max-width: 40%;
  width: fit-content;

  display: flex;
  align-items: center;
  flex-shrink: 0;

  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);

  padding: 0 6px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--button-text-graphite-secondary-text);

  ${p =>
    p.$small &&
    css`
      height: 20px;

      padding: 0px 4px;

      font-size: 12px;
      line-height: 14px;
    `}
`;

const RootLink = styled(Link)<{ $small?: boolean }>`
  ${CommonStyles}

  &:hover {
    color: var(--button-text-graphite-priory-text);
  }
`;

const RootBlock = styled.div<{ $small?: boolean }>`
  ${CommonStyles}
`;

interface Props {
  copiedCount: number;
  entityTypeId: number;
  from?: string;
  small?: boolean;
  copiedFrom?: number;
}

const CardCopiedCountTag = memo((props: Props) => {
  const { copiedCount, entityTypeId, from, small, copiedFrom } = props;

  const { t } = useTranslation();

  const count = `#${truncateNumber({ num: copiedCount + 1, precision: 3 })}`;

  return (
    <MyTooltip withinPortal label={t('card_copy')}>
      {copiedFrom ? (
        <RootLink
          $small={small}
          to={routes.card({
            from,
            entityTypeId,
            entityId: copiedFrom,
          })}
        >
          {count}
        </RootLink>
      ) : (
        <RootBlock $small={small}>{count}</RootBlock>
      )}
    </MyTooltip>
  );
});

CardCopiedCountTag.displayName = 'CardCopiedCountTag';
export { CardCopiedCountTag };
