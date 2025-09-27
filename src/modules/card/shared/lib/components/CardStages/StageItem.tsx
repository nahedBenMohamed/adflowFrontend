import { ColorUtil, DoubleRightLegacy, TruncateMixin, type Nullable, type Stage } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled, { css } from 'styled-components';

export const STAGE_ITEM_WIDTH = 179;
export const STAGE_ITEM_MARGIN_RIGHT = 17;

interface RootProps {
  $disabled?: boolean;
  $clickable?: boolean;
}

const Root = styled.div<RootProps>`
  width: ${STAGE_ITEM_WIDTH}px;
  height: 29px;

  display: flex;
  flex-direction: column;

  color: var(--button-text-graphite-priory-text);

  margin-right: ${STAGE_ITEM_MARGIN_RIGHT}px;
  transition: var(--transition-200);

  ${p =>
    p.$disabled &&
    css`
      color: var(--button-text-graphite-secondary-text);

      opacity: 0.75;
    `}

  ${p =>
    p.$clickable &&
    css`
      cursor: pointer;

      &:hover {
        opacity: 1;
      }

      &:active {
        ${p.$disabled && `color: var(--button-text-graphite-primary-text);`};
      }
    `}
`;

const TopLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 2px;
  margin-bottom: 8px;
`;

const StageName = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

  ${TruncateMixin}
`;

const IconWrapper = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  margin-left: 6px;

  svg {
    width: 20px;
    height: 13px;

    transition: var(--transition-200);

    path {
      stroke: ${p => p.$color};
    }
  }
`;

const ColumnHeaderDivider = styled.div<{ $color: string }>`
  height: 4px;
  width: 100%;

  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  ${p => p.$color && `background-color: ${p.$color}`};
`;

interface Props {
  rootId: string;
  stage: Stage;
  active: boolean;
  clickHandler?: Nullable<(stageId: number) => void>;
}

const StageItem = observer((props: Props) => {
  const { rootId, stage, active, clickHandler } = props;

  const clickable = Boolean(clickHandler);
  const color = active
    ? ColorUtil.getProcessedBGColor(stage.color)
    : 'var(--button-text-graphite-secondary-text)';

  const onClick = () => {
    if (clickable) clickHandler?.(stage.id);
  };

  return (
    <Root id={rootId} $disabled={!active} $clickable={clickable} onClick={onClick}>
      <TopLine>
        <StageName>{stage.name}</StageName>
        <IconWrapper $color={color}>
          <DoubleRightLegacy />
        </IconWrapper>
      </TopLine>

      <ColumnHeaderDivider $color={color} />
    </Root>
  );
});

StageItem.displayName = 'StageItem';
export { StageItem };
