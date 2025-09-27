import type { SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  SiteFormTextOrientation,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '../../../../../../../../shared';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ButtonSelector = styled.button<{ $active?: boolean }>`
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  transition: var(--transition-200);

  svg circle,
  rect {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg rect {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg circle {
      fill: var(--graphite-graphite-680);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg {
        circle {
          fill: var(--button-text-green-hover);
        }

        rect {
          fill: var(--primary-statuses-white-0);
        }
      }

      &:hover {
        cursor: default;

        svg {
          circle {
            fill: var(--button-text-green-hover);
          }

          rect {
            fill: var(--primary-statuses-white-0);
          }
        }
      }
    `}
`;

interface Props {
  model: SelectModel;
  label?: string;
}

const OrientationRowSelect = observer((props: Props) => {
  const { model, label } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step4.sidebar.header_customization_block',
  });

  const getOnClickHandler = useCallback(
    (orientation: SiteFormTextOrientation) => {
      return () => model.setValue(orientation);
    },
    [model]
  );

  return (
    <Root>
      {label && <Label>{label}</Label>}

      <Content>
        <ButtonSelector
          type="button"
          title={t('text_align_left')}
          $active={model.value === SiteFormTextOrientation.LEFT}
          onClick={getOnClickHandler(SiteFormTextOrientation.LEFT)}
        >
          <TextAlignLeftIcon />
        </ButtonSelector>

        <ButtonSelector
          type="button"
          title={t('text_align_center')}
          $active={model.value === SiteFormTextOrientation.CENTER}
          onClick={getOnClickHandler(SiteFormTextOrientation.CENTER)}
        >
          <TextAlignCenterIcon />
        </ButtonSelector>

        <ButtonSelector
          type="button"
          title={t('text_align_right')}
          $active={model.value === SiteFormTextOrientation.RIGHT}
          onClick={getOnClickHandler(SiteFormTextOrientation.RIGHT)}
        >
          <TextAlignRightIcon />
        </ButtonSelector>
      </Content>
    </Root>
  );
});

export { OrientationRowSelect };
