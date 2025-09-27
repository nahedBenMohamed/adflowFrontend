import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { PreviewTab } from '../../../../../../../../shared';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  color: var(--button-text-graphite-secondary-text);

  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-graphite-primary-text);
  }

  ${p =>
    p.$active &&
    css`
      font-weight: 700;
      color: var(--button-text-graphite-priory-text);

      text-decoration-line: underline;
      text-decoration-thickness: 1px;
      text-decoration-color: var(--primary-statuses-green-520);
      text-underline-offset: 6px;

      &:hover {
        color: var(--button-text-graphite-priory-text);
      }
    `}
`;

interface Props {
  value: PreviewTab;
  onChange: (value: PreviewTab) => void;
}

const SiteFormContentTabs = (props: Props) => {
  const { value, onChange } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.site_form_builder_page.site_form_builder_step4.preview',
  });

  const getOnClickHandler = useCallback((val: PreviewTab) => () => onChange(val), [onChange]);

  return (
    <Root>
      <Tab
        type="button"
        $active={value === PreviewTab.FORM}
        onClick={getOnClickHandler(PreviewTab.FORM)}
      >
        {t('form')}
      </Tab>

      <Tab
        type="button"
        $active={value === PreviewTab.GRATITUDE}
        onClick={getOnClickHandler(PreviewTab.GRATITUDE)}
      >
        {t('gratitude')}
      </Tab>

      <Tab
        type="button"
        $active={value === PreviewTab.BUTTON}
        onClick={getOnClickHandler(PreviewTab.BUTTON)}
      >
        {t('button')}
      </Tab>
    </Root>
  );
};

export { SiteFormContentTabs };
