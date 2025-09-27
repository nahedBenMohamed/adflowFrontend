import type { BooleanModel, InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GiantOutlinedInput, SwitchBlock } from '../../../../../../../../shared';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  title: string;
  enabled: BooleanModel;
  model: InputModel;
}

const SizeCustomizationElementTemplate = observer((props: Props) => {
  const { title, enabled, model } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar.size_customization_element_template',
  });

  return (
    <Root>
      <SwitchBlock text={title} model={enabled} />

      <GiantOutlinedInput
        smaller
        model={model}
        padding="8px 16px"
        disabled={!enabled.value}
        placeholder={t('placeholders.input')}
      />
    </Root>
  );
});

SizeCustomizationElementTemplate.displayName = 'SizeCustomizationElementTemplate';
export { SizeCustomizationElementTemplate };
