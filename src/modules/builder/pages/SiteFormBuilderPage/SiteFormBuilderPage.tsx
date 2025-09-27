import { appStore } from '@/app';
import {
  DefaultHeader,
  PageTemplateWithSubheader,
  TutorialProductType,
  WholePageLoaderWithLogo,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { SiteFormBuilder } from './SiteFormBuilder';

const SiteFormBuilderPage = observer(() => {
  if (!appStore.isLoaded)
    return (
      <PageTemplateWithSubheader
        tabs={[]}
        marginLeft={0}
        Header={<DefaultHeader productType={TutorialProductType.BUILDER} />}
      >
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      </PageTemplateWithSubheader>
    );

  return <SiteFormBuilder />;
});

SiteFormBuilderPage.displayName = 'SiteFormBuilderPage';
export { SiteFormBuilderPage };
