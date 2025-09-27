import { routes, stageApiUtil } from '@/app';
import {
  CardCopiedCountTag,
  DefaultLoader,
  SpanWithEllipsis,
  TargetIcon,
  TextHighlighter,
  TruncateMixin,
} from '@/shared';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import type { EntitySearchModel } from '../../../../../../models';

interface LinkWrapperProps {
  $focused: boolean;
  $withStage: boolean;
}

const Root = styled(Link)<LinkWrapperProps>`
  display: flex;

  color: var(--button-text-graphite-priory-text);

  padding: 6px 32px;
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-graphite-priory-text);

    background-color: #f3fded;
  }

  &:active {
    color: var(--button-text-graphite-priory-text);

    background-color: #e6fbda;
  }

  ${p =>
    p.$withStage &&
    css`
      display: grid;
      grid-template-columns: 55% 1fr 20px;
      gap: 24px;

      @media (max-width: 992px) {
        gap: 16px;
      }
    `}

  ${p => p.$focused && `background-color: #e6fbda`};

  ${TruncateMixin}
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  ${TruncateMixin}
`;

const BoardIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StageIndicatorWrapper = styled(BoardIconWrapper)<{ $bgColor: string }>`
  span {
    width: 14px;
    height: 14px;

    border-radius: 50%;
    background-color: ${p => p.$bgColor};
  }
`;

const StageWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  &:hover {
    cursor: pointer;
  }

  ${TruncateMixin}
`;

const IconWrapper = styled.div`
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 16px;
    height: 16px;

    path {
      fill: var(--primary-statuses-green-520);
    }
  }
`;

interface Props {
  filter: string;
  isFocused: boolean;
  entity: EntitySearchModel;
}

export const SEARCH_ITEM_DATA_ACTIVE = 'data-active';

const EntitySearchItem = (props: Props) => {
  const {
    filter,
    isFocused,
    entity: { stageId, boardId, copiedCount, copiedFrom, name, id, entityTypeId, focused },
  } = props;

  const { data: stage, isLoading: isStageLoading } = stageApiUtil.useGetStage({ stageId, boardId });

  return (
    <li>
      <Root
        $focused={isFocused}
        $withStage={Boolean(stage)}
        {...{ [SEARCH_ITEM_DATA_ACTIVE]: isFocused }}
        to={routes.card({ entityTypeId, entityId: id })}
      >
        <TitleWrapper>
          <TextHighlighter truncate filter={filter} str={name} />

          {copiedCount && copiedFrom && (
            <CardCopiedCountTag copiedCount={copiedCount} entityTypeId={copiedFrom} />
          )}
        </TitleWrapper>

        {isStageLoading && (
          <StageWrapper>
            <StageIndicatorWrapper $bgColor="var(--button-text-graphite-primary-text)">
              <span />
            </StageIndicatorWrapper>

            <DefaultLoader height="20px" />
          </StageWrapper>
        )}

        {!isStageLoading && stage && (
          <StageWrapper>
            <StageIndicatorWrapper $bgColor={stage.color}>
              <span />
            </StageIndicatorWrapper>

            <SpanWithEllipsis text={stage.name} />
          </StageWrapper>
        )}

        {focused && (
          <IconWrapper>
            <TargetIcon />
          </IconWrapper>
        )}
      </Root>
    </li>
  );
};

export { EntitySearchItem };
