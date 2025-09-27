import { NoSelectMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled, { css } from 'styled-components';
import { StepEllipseIcon } from '../../../../assets';
import type { BuilderNavStep } from '../../../models';

const StepEllipseIconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 32px;
  height: 32px;

  svg path {
    transition: var(--transition-200);
  }
`;

const Title = styled.h4`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);
`;

const Description = styled.p`
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  padding-left: 32px;
`;

interface RootProps {
  $active: boolean;
  $locked: boolean;
  $secondary?: boolean;
}

const Root = styled.button<RootProps>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  text-align: left;

  padding: 12px;
  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  ${p => p.$active && `background-color: var(--graphite-graphite-80)`};

  ${p =>
    p.$locked
      ? css`
          pointer-events: none;

          ${Title}, ${Description} {
            color: var(--button-text-graphite-secondary-text);
          }

          // we specify class in order to override only last path stroke and do not
          // mutate one in the mask in step_ellipse.svg
          .step_ellipsis--last-path {
            stroke: var(--button-text-graphite-secondary-text);
          }

          ${NoSelectMixin}
        `
      : css`
          &:hover {
            cursor: pointer;

            ${!p.$secondary && `box-shadow: inset 0 0 0 2px var(--graphite-graphite-80)`};
          }

          ${p.$secondary &&
          css`
            background-color: var(--primary-statuses-white-0);
            box-shadow:
              0px 0px 2px 0px #eef4fe,
              0px 1px 2px 0px #d0daeb;

            &:hover {
              background: #f3fded;
            }

            ${p.$active &&
            css`
              background: #e6fbda;
              box-shadow: inset 0 0 0 2px var(--primary-statuses-green-520);
            `}
          `};
        `}

  ${p => p.$secondary && `flex: 1`};
`;

const TitleWrapper = styled.div`
  position: relative;

  height: 32px;

  display: flex;
  align-items: center;
  flex-shrink: 0;

  padding-left: 12px;
`;

interface Props {
  active: boolean;
  step: BuilderNavStep;
  secondary?: boolean;
  onSelect: () => void;
}

const NavStepItem = observer((props: Props) => {
  const { active, step, secondary, onSelect } = props;

  const { name, description } = step;

  return (
    <Root
      role="tab"
      $active={active}
      $locked={step.locked}
      $secondary={secondary}
      onClick={onSelect}
    >
      <TitleWrapper>
        <StepEllipseIconWrapper>
          <StepEllipseIcon />
        </StepEllipseIconWrapper>

        <Title>{name}</Title>
      </TitleWrapper>

      <Description>{description}</Description>
    </Root>
  );
});

export { NavStepItem };
