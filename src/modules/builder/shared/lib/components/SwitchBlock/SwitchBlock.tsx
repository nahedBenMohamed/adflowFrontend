import { Hint, MySwitchWithModel, type BooleanModel } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.label<{ $justifyStart?: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  ${p => p.$justifyStart && `justify-content: flex-start`};
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  text: string;
  model: BooleanModel;
  hint?: string;
  justifyStart?: boolean;
}

const SwitchBlock = (props: Props) => {
  const { text, model, hint, justifyStart } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar',
  });

  return (
    <Root $justifyStart={justifyStart}>
      <TitleWrapper>
        <Title>{text}</Title>

        {hint && <Hint text={hint} />}
      </TitleWrapper>

      <MySwitchWithModel model={model} label={t('switch_label')} />
    </Root>
  );
};

export { SwitchBlock };
