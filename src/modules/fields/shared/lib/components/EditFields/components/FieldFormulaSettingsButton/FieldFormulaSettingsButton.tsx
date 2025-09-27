import { MyIndicator, MyTooltip, type FieldType, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { EditFormulaIcon } from '../../../../../assets';
import { FieldFormulaSettingsModal } from './components';

const IconWrapper = styled.button<{ $active?: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:not(:disabled):hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:not(:disabled):active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  &:disabled {
    opacity: 0.5;
  }

  ${p =>
    p.$active &&
    css`
      & {
        svg path {
          fill: var(--button-text-green-active);
        }
      }
    `}
`;

interface Props {
  fieldId: number;
  fieldName: string;
  fieldType: FieldType;
  formula: Nullable<string>;
  entityTypeId: Nullable<number>;
  updateFormula: (value: Nullable<string>) => void;
}

const FieldFormulaSettingsButton = (props: Props) => {
  const { fieldId, fieldName, fieldType, formula, entityTypeId, updateFormula } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.field_formula_settings_button',
  });

  const [modalOpened, { close, open }] = useDisclosure(false);

  if (!entityTypeId)
    return (
      <MyTooltip withinPortal label={t('save_first')}>
        <IconWrapper disabled onClick={open}>
          <EditFormulaIcon />
        </IconWrapper>
      </MyTooltip>
    );

  return (
    <>
      <MyIndicator size={10} withBorder offset={2} disabled={!formula}>
        <IconWrapper $active={modalOpened} onClick={open}>
          <EditFormulaIcon />
        </IconWrapper>
      </MyIndicator>

      {modalOpened && (
        <FieldFormulaSettingsModal
          formula={formula}
          fieldId={fieldId}
          opened={modalOpened}
          fieldName={fieldName}
          fieldType={fieldType}
          entityTypeId={entityTypeId}
          onClose={close}
          updateFormula={updateFormula}
        />
      )}
    </>
  );
};

export { FieldFormulaSettingsButton };
