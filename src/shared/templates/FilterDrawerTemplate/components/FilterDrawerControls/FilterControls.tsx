import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MyCheckbox, PrimaryButton } from '../../../../lib';
import { ControlsErrorMessage } from '../ControlsErrorMessage/ControlsErrorMessage';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

export interface FilterDrawerControlsProps {
  saveFilterSettings: boolean;
  filterClearing: boolean;
  hasError: boolean;
  handleToggleSaveFilterSettings: () => void;
  onClear: () => void;
}

const FilterControls = observer((props: FilterDrawerControlsProps) => {
  const { saveFilterSettings, filterClearing, hasError, handleToggleSaveFilterSettings, onClear } =
    props;

  const { t } = useTranslation('common', {
    keyPrefix: 'filter_drawer_controls',
  });

  return (
    <Root>
      {hasError && <ControlsErrorMessage />}

      <Content>
        <CheckboxWrapper>
          <MyCheckbox checked={saveFilterSettings} onChange={handleToggleSaveFilterSettings} />
          {t('save_filter_settings')}
        </CheckboxWrapper>

        <PrimaryButton disabled={filterClearing} variant="empty" onClick={onClear}>
          {t('clear')}
        </PrimaryButton>
      </Content>
    </Root>
  );
});

export { FilterControls };
