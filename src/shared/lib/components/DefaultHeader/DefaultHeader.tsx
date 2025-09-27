import {
  FadedHorizontalScrollMixin,
  type FadedHorizontalScrollMixinProps,
  useFadedHorizontalScroll,
} from '@/shared';
import { Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { HideScrollbarMixin, TruncateMixin } from '../../mixins';
import { MediaBreakpoints, type TutorialProductType } from '../../models';
import { LogoLink } from '../LogoLink/LogoLink';
import { AccountBlock, HeaderDelimiter } from './components';

const Root = styled.div<FadedHorizontalScrollMixinProps>`
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);

  z-index: var(--header-z-index);

  height: var(--header-height);

  background: var(--primary-statuses-white-0);
  border-bottom: 1px solid var(--graphite-graphite-80);

  overflow: auto hidden;

  ${HideScrollbarMixin}
  ${FadedHorizontalScrollMixin}
`;

interface HeaderContainerProps {
  $grid: boolean;
  $unlimitedCentralContent?: boolean;
}

// to use inside of css, must be binded to var(--header-height) value
export const HEADER_HEIGHT = 56;

const HeaderContainer = styled.header<HeaderContainerProps>`
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: space-between;
  gap: 16px;

  padding: 0 16px;

  @media ${MediaBreakpoints.SM} {
    min-width: max-content;
  }

  ${p =>
    p.$grid &&
    css`
      display: grid;
      grid-template-columns: ${p.$unlimitedCentralContent
        ? `1fr auto 1fr`
        : `minmax(200px, 40%) minmax(184px, 20%) minmax(min-content, 40%)`};
    `}
`;

const LeftBlockWrapper = styled.div`
  max-width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 16px;
`;

const ModuleNameWithIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  overflow: hidden;
`;

const ModuleIconWrapper = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p => p.$color};
  }
`;

const ModuleName = styled.span`
  max-width: 100%;

  font-size: 18px;
  font-weight: 500;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const Content = styled.div`
  flex: 1 0;
  display: flex;
  align-items: center;
  gap: 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  overflow: hidden;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
`;

export interface DefaultHeaderModuleIconProps {
  icon: ReactNode;
  color: string;
}

interface Props {
  moduleName?: string;
  children?: ReactNode;
  Controls?: ReactNode;
  hideNotes?: boolean;
  hideMultichat?: boolean;
  CentralContent?: ReactNode;
  hideControlsDelimiter?: boolean;
  unlimitedCentralContent?: boolean;
  moduleIconProps?: DefaultHeaderModuleIconProps;
  // objectId – either an entityTypeId, scheduleId or productsSectionId
  objectId?: number;
  productType?: TutorialProductType;
}

const DefaultHeader = observer((props: Props) => {
  const {
    moduleName,
    moduleIconProps,
    children,
    Controls,
    CentralContent,
    hideMultichat,
    hideNotes,
    hideControlsDelimiter,
    unlimitedCentralContent,
    objectId,
    productType,
  } = props;

  const { ref, showLeftFade, showRightFade } = useFadedHorizontalScroll();

  return (
    <Tooltip.Group>
      <Root ref={ref} $showLeftFade={showLeftFade} $showRightFade={showRightFade}>
        <HeaderContainer
          $grid={Boolean(CentralContent)}
          $unlimitedCentralContent={unlimitedCentralContent}
        >
          <LeftBlockWrapper>
            <LogoWrapper>
              <LogoLink textOnly showAccountLogo />
              <HeaderDelimiter />
            </LogoWrapper>

            {(moduleName || moduleIconProps) && (
              <ModuleNameWithIconWrapper>
                {moduleIconProps && (
                  <ModuleIconWrapper $color={moduleIconProps.color}>
                    {moduleIconProps.icon}
                  </ModuleIconWrapper>
                )}

                {moduleName && <ModuleName title={moduleName}>{moduleName}</ModuleName>}
              </ModuleNameWithIconWrapper>
            )}

            {children}
          </LeftBlockWrapper>

          {CentralContent && <Content>{CentralContent}</Content>}

          <ControlsWrapper>
            {Controls}

            {Controls && !hideControlsDelimiter && <HeaderDelimiter />}

            <AccountBlock
              objectId={objectId}
              hideNotes={hideNotes}
              productType={productType}
              hideMultichat={hideMultichat}
            />
          </ControlsWrapper>
        </HeaderContainer>
      </Root>
    </Tooltip.Group>
  );
});

DefaultHeader.displayName = 'DefaultHeader';
export { DefaultHeader };
