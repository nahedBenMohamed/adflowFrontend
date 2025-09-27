import { appStore } from '@/app';
import {
  DefaultHeader,
  PageTemplateWithSubheader,
  TutorialProductType,
  WholePageLoaderWithLogo,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { HeadlessSiteFormBuilder } from './HeadlessSiteFormBuilder';

const HeadlessSiteFormBuilderPage = observer(() => {
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

  return <HeadlessSiteFormBuilder />;
});

HeadlessSiteFormBuilderPage.displayName = 'HeadlessSiteFormBuilderPage';
export { HeadlessSiteFormBuilderPage };
