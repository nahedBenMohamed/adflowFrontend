import { MySwitchWithModel, SpanWithEllipsis, TruncateMixin, type BooleanModel } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.label`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props {
  title: string;
  model: BooleanModel;
  disabled?: boolean;
}

const ShowInFormControl = (props: Props) => {
  const { title, model, disabled } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step3.show_in_form_control',
  });

  return (
    <Root>
      <SpanWithEllipsis text={title} />

      <MySwitchWithModel model={model} label={t('yes')} disabled={disabled} />
    </Root>
  );
};

export { ShowInFormControl };
