import { MyCheckboxSkeleton, MyCheckboxWithModel, type CheckboxModel } from '@/shared';
import type { SiteFormEntityTypeLinkModel } from '../../../../../../shared';
import { SiteFormBuilderLinkedEntityItemTemplate } from '../SiteFormBuilderLinkedEntityItemTemplate/SiteFormBuilderLinkedEntityItemTemplate';

interface Props {
  loading: boolean;
  model: CheckboxModel;
  entityTypeLink: SiteFormEntityTypeLinkModel;
}

const SiteFormBuilderLinkedEntityItemCheckbox = (props: Props) => {
  const { loading, model, entityTypeLink } = props;

  return (
    <SiteFormBuilderLinkedEntityItemTemplate
      entityTypeLink={entityTypeLink}
      Control={
        loading ? (
          <MyCheckboxSkeleton bigger />
        ) : (
          <MyCheckboxWithModel model={model} variant="bigger" value={entityTypeLink.entityTypeId} />
        )
      }
    />
  );
};

export { SiteFormBuilderLinkedEntityItemCheckbox };
