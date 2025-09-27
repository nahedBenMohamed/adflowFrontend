import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AdvancedSettingsIcon } from '../../../../../../../../shared';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  margin-top: 24px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: var(--button-text-graphite-primary-text);
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Delimiter = styled.hr`
  width: 100%;
  border-top: 1px solid var(--graphite-graphite-120);
`;

const AdvancedSettingsDelimiter = () => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar',
  });

  return (
    <Root>
      <Title>
        <IconWrapper>
          <AdvancedSettingsIcon />
        </IconWrapper>

        {t('advanced_settings')}
      </Title>

      <Delimiter />
    </Root>
  );
};

export { AdvancedSettingsDelimiter };
