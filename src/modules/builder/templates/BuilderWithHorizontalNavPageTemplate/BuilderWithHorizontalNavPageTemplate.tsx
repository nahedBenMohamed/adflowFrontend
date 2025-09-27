import { useTypedParams, type Optional } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import styled from 'styled-components';
import { NavStepsList } from '../../shared';
import type { BuilderNavStore } from '../../store';
import {
  BuilderPageTemplate,
  type BuilderPageTemplateProps,
} from '../BuilderPageTemplate/BuilderPageTemplate';

const Root = styled.div`
  position: relative;

  min-height: calc(100dvh - var(--header-with-subheader-height));

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;

  padding: 0 16px 16px;
`;

interface Props extends BuilderPageTemplateProps {
  navStore: BuilderNavStore;
  alwaysShowNavBorderBottom?: boolean;
}

const BuilderWithHorizontalNavPageTemplate = observer((props: Props) => {
  const { navStore, children, alwaysShowNavBorderBottom, ...rest } = props;

  const { moduleId } = useTypedParams<{ moduleId: Optional<number> }>();

  const { unlockAllSteps } = navStore;

  useEffect(() => {
    if (moduleId) unlockAllSteps();
  }, [moduleId, unlockAllSteps]);

  return (
    <BuilderPageTemplate {...rest} rootPadding={0} marginRight={0}>
      <Root>
        <NavStepsList
          horizontal
          store={navStore}
          alwaysShowBorderBottom={alwaysShowNavBorderBottom}
        />

        <Content>{children}</Content>
      </Root>
    </BuilderPageTemplate>
  );
});

export { BuilderWithHorizontalNavPageTemplate };
