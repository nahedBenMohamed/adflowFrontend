import { MySelect, WarningModal, type Option, type SelectModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  padding: 24px 32px 16px;
`;

interface Props {
  isOpened: boolean;
  options: Option<number>[];
  selectedStage: SelectModel;
  onClose: () => void;
  onApprove: () => void;
}

const DeleteStageWarningModal = observer((props: Props) => {
  const { isOpened, options, selectedStage, onClose, onApprove } = props;

  const { t } = useTranslation('page.board-settings', {
    keyPrefix: 'board_settings.delete_stage_warning_modal',
  });

  return (
    <WarningModal
      width="428px"
      maxHeight="416px"
      isOpened={isOpened}
      title={t('warning_title')}
      approveTitle={t('delete')}
      approveDisabled={!selectedStage.value}
      annotation={t('warning_annotation')}
      onClose={onClose}
      onApprove={onApprove}
    >
      <Root>
        <MySelect
          withinPortal
          options={options}
          variant="outlined"
          model={selectedStage}
          placeholder={t('placeholder')}
        />
      </Root>
    </WarningModal>
  );
});

DeleteStageWarningModal.displayName = 'DeleteStageWarningModal';
export { DeleteStageWarningModal };
