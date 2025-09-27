import { GearIcon, MyCheckbox, MyDropdown, SpanWithEllipsis } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { SendEmailModalSettings } from '../../../../models';

const Root = styled.button<{ $active: boolean }>`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      stroke: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      stroke: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        stroke: var(--button-text-green-active);
      }

      &:hover {
        svg path {
          stroke: var(--button-text-green-active);
        }
      }
    `}
`;

const List = styled.div`
  padding: 8px 0;
`;

const CheckboxLabel = styled.label`
  min-width: 200px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 8px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: #f3fded;
  }
`;

interface Props {
  settings: SendEmailModalSettings;
}

interface SettingsOption {
  label: string;
  value: boolean;
  onSelect: () => void;
}

const SendEmailSettingsDropdown = observer((props: Props) => {
  const { settings } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.modals.send_email_modal.components.send_email_settings_dropdown',
  });

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const options = useMemo<SettingsOption[]>(
    () => [
      {
        label: t('show_copy'),
        value: settings.showCc,
        onSelect: () => (settings.showCc = !settings.showCc),
      },
      {
        label: t('show_hidden_copy'),
        value: settings.showBcc,
        onSelect: () => (settings.showBcc = !settings.showBcc),
      },
    ],
    [settings, t]
  );

  return (
    <MyDropdown
      opened={opened}
      position="bottom-end"
      Button={
        <Root $active={opened}>
          <GearIcon />
        </Root>
      }
      hide={hide}
      show={show}
    >
      <List>
        {options.map(o => (
          <CheckboxLabel key={o.label}>
            <MyCheckbox checked={o.value} onChange={o.onSelect} />

            <SpanWithEllipsis text={o.label} />
          </CheckboxLabel>
        ))}
      </List>
    </MyDropdown>
  );
});

SendEmailSettingsDropdown.displayName = 'SendEmailSettingsDropdown';
export { SendEmailSettingsDropdown };
