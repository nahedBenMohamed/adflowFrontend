import { FunctionalTextEditor, type InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

interface Props {
  model: InputModel;
}

const DescriptionBlock = observer((props: Props) => {
  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.description_block',
  });

  const { model } = props;

  return (
    <FunctionalTextEditor
      model={model}
      variant="outlined"
      contentMinHeight="80px"
      placeholder={t('placeholders.description')}
    />
  );
});

DescriptionBlock.displayName = 'DescriptionBlock';
export { DescriptionBlock };
