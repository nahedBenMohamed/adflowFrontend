import { TruncateMixin } from '@/shared';
import { memo, type ReactNode } from 'react';
import styled from 'styled-components';
import {
  AnalyticsBlockPalette,
  type AnalyticsColors,
  type AnalyticsUnit,
} from '../../../../../../shared';
import { ResolveIconSwitch } from '../ResolveIconSwitch/ResolveIconSwitch';

const Root = styled.div<{ $withoutShadow?: boolean }>`
  width: 300px;
  height: 94px;

  display: flex;
  align-items: center;
  gap: 16px;

  color: var(--button-text-graphite-priory-text);

  padding: 16px;
  background-color: var(--primary-statuses-white-0);
  box-shadow: ${p => !p.$withoutShadow && `0px 1px 2px 0px #d0daeb, 0px 0px 2px 0px #eef4fe`};
  border-radius: var(--border-radius-block);
`;

const Indicator = styled.div<{ $bgColor: AnalyticsColors }>`
  width: 64px;
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  background: ${p => AnalyticsBlockPalette[p.$bgColor]};
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-block);
`;

const Content = styled.div`
  max-width: 188px;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

const Title = styled.h3<{ $color: AnalyticsColors }>`
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;

  background: ${p => AnalyticsBlockPalette[p.$color]};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Body = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

interface Props extends AnalyticsUnit {
  children: ReactNode;
  withoutShadow?: boolean;
}

const Unit = memo((props: Props) => {
  const { title, color, icon, children, withoutShadow } = props;

  return (
    <Root $withoutShadow={withoutShadow}>
      <Indicator $bgColor={color}>
        <ResolveIconSwitch icon={icon} />
      </Indicator>

      <Content>
        <Title $color={color}>{title}</Title>
        <Body>{children}</Body>
      </Content>
    </Root>
  );
});

Unit.displayName = 'Unit';
export { Unit };
