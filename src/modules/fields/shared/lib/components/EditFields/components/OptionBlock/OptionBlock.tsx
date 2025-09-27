import {
  ColorPicker,
  ColorUtil,
  DeleteButton,
  InputModel,
  MyInputWithLimitedLength,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { FieldOption } from '../../../../../../shared';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TitleWrapper = styled.div`
  width: 100%;

  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  colorful: boolean;
  option: FieldOption;
  onDeleteOption: () => void;
  onChangeLabel: ({ id, label }: { id: number; label: string }) => void;
  onChangeColor: ({ id, color }: { id: number; color: string }) => void;
}

export const OPTION_MAX_LENGTH = 50;

const OptionBlock = observer((props: Props) => {
  const { option, colorful, onChangeLabel, onChangeColor, onDeleteOption } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.edit_fields.select_options',
  });

  const labelModel = InputModel.create(option.label).required();

  const handleLabelChange = useCallback(
    () => onChangeLabel({ id: option.id, label: labelModel.value }),
    [labelModel.value, option.id, onChangeLabel]
  );

  const handleColorChange = useCallback(
    (color: string) => onChangeColor({ id: option.id, color }),
    [option.id, onChangeColor]
  );

  return (
    <Root>
      <TitleWrapper>
        {colorful && (
          <ColorPicker
            position="bottom"
            withinPortal={false}
            color={option.color ?? ColorUtil.getDefaultBgColor()}
            onChange={handleColorChange}
          />
        )}

        <MyInputWithLimitedLength
          width="100%"
          variant="outlined"
          model={labelModel}
          maxLength={OPTION_MAX_LENGTH}
          hint={t('max_length', { length: OPTION_MAX_LENGTH })}
          handleChange={handleLabelChange}
        />
      </TitleWrapper>

      <DeleteButton size="medium" onClick={onDeleteOption} />
    </Root>
  );
});

export { OptionBlock };
