import { CheckboxIcon } from '@/shared';
import { Transition } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Title = styled.h3`
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  text-align: center;
  color: var(--button-text-graphite-primary-text);
  transition: var(--transition-200);

  @media (max-width: 1800px) {
    font-size: 18px;
    line-height: 24px;
  }
`;

interface RootProps {
  $active?: boolean;
  $color?: CSSProperties['color'];
}

const Root = styled.button<RootProps>`
  position: relative;

  width: 100%;
  min-width: 200px;

  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 0 0;
  gap: 16px;

  padding: 64px 24px;
  border-radius: 16px;
  background: transparent;
  outline: 1px solid ${p => p.$color};
  transition: var(--transition-200);

  @media (max-width: 1800px) {
    padding: 38px 16px;
  }

  &:hover {
    cursor: pointer;

    outline: 1px solid transparent;

    /* two last digits – color transparency */
    background: ${p => p.$color}11;

    ${Title} {
      color: var(--graphite-graphite-840);
    }
  }

  &:disabled {
    pointer-events: none;
  }

  svg {
    transition: ease 300ms;
  }

  ${p =>
    p.$active &&
    css<RootProps>`
      outline: 2px solid ${p => p.$color};

      background: ${p => p.$color};

      &:hover {
        outline: 2px solid ${p => p.$color};
        background: ${p => p.$color};
      }

      ${Title} {
        color: var(--graphite-graphite-840);
      }

      svg {
        .back {
          stroke-width: 1;
          fill: transparent;
          stroke-linejoin: round;
          stroke: var(--graphite-graphite-840);
        }

        .fore {
          fill: var(--graphite-graphite-840);
        }
      }
    `}
`;

// Size – 48px + 2px safe zones
const MainIconWrapper = styled.div`
  width: 52px;
  height: 52px;

  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ColorTag = styled.div<{ $color: CSSProperties['color'] }>`
  position: absolute;
  right: 12px;
  top: 12px;

  display: flex;
  align-items: center;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-statuses-white-0);

  padding: 6px 12px 8px;
  background: ${p => p.$color};
  border-radius: var(--border-radius-block);
`;

const ChosenTagWrapper = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;

  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1800px) {
    gap: 8px;
  }
`;

const ChosenTagIconWrapper = styled.div`
  width: 24px;
  height: 24px;

  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1800px) {
    width: 20px;
    height: 20px;
  }
`;

const ChosenTagTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--graphite-graphite-840);

  @media (max-width: 1800px) {
    font-size: 14px;
    line-height: 20px;
  }
`;

interface Props {
  moduleName: string;
  active?: boolean;
  icon?: ReactNode;
  comingSoon?: boolean;
  color?: CSSProperties['color'];
  tag?: string;
  onSelect: () => void;
}

const BuilderModuleOption = (props: Props) => {
  const { moduleName, active, icon, color, comingSoon, tag, onSelect } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.builder_journey_picker_page.module_names',
  });

  return (
    <Root $active={active} $color={color} disabled={comingSoon} onClick={onSelect}>
      <Transition transition="fade" mounted={Boolean(active)}>
        {transitionStyles => (
          <ChosenTagWrapper style={transitionStyles}>
            <ChosenTagIconWrapper>
              <CheckboxIcon />
            </ChosenTagIconWrapper>

            <ChosenTagTitle>{t('chosen')}</ChosenTagTitle>
          </ChosenTagWrapper>
        )}
      </Transition>

      {icon && <MainIconWrapper>{icon}</MainIconWrapper>}

      <Title>{moduleName}</Title>

      {comingSoon && <ColorTag $color={color}>{t('soon')}</ColorTag>}

      {tag && <ColorTag $color={color}>{tag}</ColorTag>}
    </Root>
  );
};

export { BuilderModuleOption };
