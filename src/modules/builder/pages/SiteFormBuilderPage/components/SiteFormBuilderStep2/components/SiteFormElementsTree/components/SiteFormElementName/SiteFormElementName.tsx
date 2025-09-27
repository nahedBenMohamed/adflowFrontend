import { DeleteButton, type InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { GiantUnderlinedInput } from '../../../../../../../../shared';

interface Props {
  model: InputModel;
  onDelete: () => void;
}

const SiteFormElementName = observer((props: Props) => {
  const { model, onDelete } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step2.tree.element_name',
  });

  return (
    <GiantUnderlinedInput
      model={model}
      placeholder={t('placeholder')}
      Icon={<DeleteButton size="medium" onClick={onDelete} />}
    />
  );
});

SiteFormElementName.displayName = 'SiteFormElementName';
export { SiteFormElementName };
