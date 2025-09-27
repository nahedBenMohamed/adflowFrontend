import { MyRadio, MyRadioSkeleton, type InputModel } from '@/shared';
import type { SiteFormEntityTypeLinkModel } from '../../../../../../shared';
import { SiteFormBuilderLinkedEntityItemTemplate } from '../SiteFormBuilderLinkedEntityItemTemplate/SiteFormBuilderLinkedEntityItemTemplate';

interface Props {
  model: InputModel;
  loading: boolean;
  entityTypeLink: SiteFormEntityTypeLinkModel;
  handleChange?: () => void;
}

const SiteFormBuilderLinkedEntityItemRadio = (props: Props) => {
  const { model, loading, entityTypeLink, handleChange } = props;

  return (
    <SiteFormBuilderLinkedEntityItemTemplate
      entityTypeLink={entityTypeLink}
      Control={
        loading ? (
          <MyRadioSkeleton bigger />
        ) : (
          <MyRadio
            bigger
            model={model}
            value={String(entityTypeLink.entityTypeId)}
            handleChange={handleChange}
          />
        )
      }
    />
  );
};

export { SiteFormBuilderLinkedEntityItemRadio };
