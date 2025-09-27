import { useDisclosure } from '@mantine/hooks';
import styled from 'styled-components';
import {
  SiteFormBuilderPageStepRoot,
  type SiteFormDesignFormData,
  SiteFormView,
} from '../../../../shared';
import { SiteFormClientPreview, SiteFormCustomizationSidebar } from './components';

const Root = styled(SiteFormBuilderPageStepRoot)`
  display: flex;
  gap: 48px;

  padding: 32px 48px;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
`;

interface Props {
  previewUrl: string;
  siteFormDesignFormData: SiteFormDesignFormData;
}

const SiteFormBuilderStep4 = (props: Props) => {
  const { previewUrl, siteFormDesignFormData } = props;

  const [previewOpened, { close: closePreview }] = useDisclosure(false);

  return (
    <Root>
      {!previewOpened && (
        <SiteFormCustomizationSidebar siteFormDesignFormData={siteFormDesignFormData} />
      )}

      <SiteFormClientPreview
        previewUrl={previewUrl}
        previewOpened={previewOpened}
        hideIframe={siteFormDesignFormData.formLayoutFormData.view.value === SiteFormView.MODAL}
        closePreview={closePreview}
      />
    </Root>
  );
};

export { SiteFormBuilderStep4 };
