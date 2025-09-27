import { envUtil, MySwitchWithModel, type BooleanModel } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 16px;

  padding: 16px 24px;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px 0px #eef4fe,
    0px 1px 2px 0px #d0daeb;
`;

const Title = styled.div`
  flex: 1;

  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  model: BooleanModel;
}

const PoweredByLogoBlock = (props: Props) => {
  const { model } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar.powered_by_logo_block',
  });

  return (
    <Root>
      <Title>{t('title', { company: envUtil.appName })}</Title>

      <MySwitchWithModel model={model} label={t('switch_label')} />
    </Root>
  );
};

export { PoweredByLogoBlock };
