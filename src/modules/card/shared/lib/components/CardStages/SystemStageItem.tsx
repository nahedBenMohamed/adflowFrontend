import { ColorUtil, TruncateMixin, type Nullable, type Stage } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled, { css } from 'styled-components';

interface RootProps {
  $gray: boolean;
  $bgColor: string;
  $active: boolean;
  $textColor: string;
  $clickable?: boolean;
}

const Root = styled.button<RootProps>`
  padding: 7px 16px;

  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
  color: ${p => p.$textColor};

  background-color: ${p => p.$bgColor};
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  ${p =>
    p.$active &&
    css`
      filter: brightness(115%);
    `}

  ${p =>
    p.$gray &&
    css`
      color: var(--button-text-graphite-secondary-text);

      background-color: var(--graphite-graphite-80);
    `}
  
  ${p =>
    p.$clickable &&
    css`
      cursor: pointer;

      &:hover {
        filter: ${p.$gray && `brightness(120%)`};
      }
    `}

  ${TruncateMixin}
`;

interface Props {
  stage: Stage;
  active: boolean;
  currentStage: Stage;
  clickHandler?: Nullable<(stageId: number) => void>;
}

const SystemStageItem = observer((props: Props) => {
  const { stage, active, currentStage, clickHandler } = props;

  const clickable = Boolean(clickHandler);

  const onClick = () => {
    if (clickable) clickHandler?.(stage.id);
  };

  const checkedBgColor = ColorUtil.getProcessedBGColor(stage.color);
  const textColor = ColorUtil.getTextContrastColorByBgColorHex(checkedBgColor);

  return (
    <Root
      $active={active}
      $clickable={clickable}
      $bgColor={stage.color}
      $textColor={textColor}
      $gray={currentStage.isSystem && stage.id !== currentStage.id}
      onClick={onClick}
    >
      {stage.name}
    </Root>
  );
});

SystemStageItem.displayName = 'SystemStageItem';
export { SystemStageItem };
