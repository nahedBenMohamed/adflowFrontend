import { appStore, routes } from '@/app';
import {
  DefaultHeader,
  PageTemplateWithSubheader,
  TutorialProductType,
  WholePageLoaderWithLogo,
  type TabModel,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { BuilderPageRoot, BuilderTabIcon, BuilderTabs, WorkspaceTabIcon } from '../../shared';

export interface BuilderPageTemplateProps {
  children: ReactNode;
  loading?: boolean;
  rootPadding?: CSSProperties['padding'];
  marginRight?: CSSProperties['marginRight'];
}

const BuilderPageTemplate = observer((props: BuilderPageTemplateProps) => {
  const { children, loading, rootPadding, marginRight } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.components.common',
  });

  const { pathname } = useLocation();

  const tabs = useMemo<TabModel[]>(
    () => [
      {
        Icon: <BuilderTabIcon />,
        title: t('workspace_builder'),
        href: routes.builder(BuilderTabs.JOURNEY),
        active:
          pathname.includes(routes.builderBase) &&
          pathname !== routes.builder(BuilderTabs.WORKSPACE),
      },
      {
        Icon: <WorkspaceTabIcon />,
        title: t('your_workspace'),
        href: routes.builder(BuilderTabs.WORKSPACE),
      },
    ],
    [pathname, t]
  );

  return (
    <PageTemplateWithSubheader
      tabs={tabs}
      marginLeft={0}
      marginRight={marginRight}
      Header={
        <DefaultHeader
          moduleName={t('workspace_builder')}
          productType={TutorialProductType.BUILDER}
        />
      }
    >
      <BuilderPageRoot $loading={loading} $padding={rootPadding}>
        {appStore.isLoaded ? (
          children
        ) : (
          <WholePageLoaderWithLogo ensureSubheaderWithOffset extraOffset="32px" />
        )}
      </BuilderPageRoot>
    </PageTemplateWithSubheader>
  );
});

export { BuilderPageTemplate };
