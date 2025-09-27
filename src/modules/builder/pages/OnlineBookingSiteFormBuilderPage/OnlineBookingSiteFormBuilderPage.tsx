import { appStore } from '@/app';
import {
  DefaultHeader,
  PageTemplateWithSubheader,
  TutorialProductType,
  WholePageLoaderWithLogo,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { OnlineBookingSiteFormBuilder } from './OnlineBookingSiteFormBuilder';

const OnlineBookingSiteFormBuilderPage = observer(() => {
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

  return <OnlineBookingSiteFormBuilder />;
});

OnlineBookingSiteFormBuilderPage.displayName = 'OnlineBookingSiteFormBuilderPage';
export { OnlineBookingSiteFormBuilderPage };
