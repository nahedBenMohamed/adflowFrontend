import { DocumentType } from '@/modules/settings';
import { MyCheckboxWithModel, PrimaryButton, type CheckboxModel } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CreateDocumentsHint } from '../CreateDocumentsHint/CreateDocumentsHint';
import { MissingTagsList } from '../MissingTagsList/MissingTagsList';

const CheckboxesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
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

const Controls = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;
`;

interface Props {
  model: CheckboxModel;
  templateChecked: boolean;
  missingTags: string[];
  templateChecking: boolean;
  createDocuments: () => void;
  handleCancel: () => void;
}

const SelectFormatsHint = (props: Props) => {
  const { model, templateChecked, missingTags, templateChecking, createDocuments, handleCancel } =
    props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.create_documents',
  });

  const hasMissingTags = missingTags.length > 0;

  return (
    <CreateDocumentsHint
      titleDanger={hasMissingTags}
      title={hasMissingTags ? t('hints.issues_identified') : t('hints.format_title')}
      annotation={
        hasMissingTags ? t('hints.invalid_tags_annotation') : t('hints.format_annotation')
      }
    >
      {hasMissingTags ? (
        <MissingTagsList missingTags={missingTags} />
      ) : (
        <CheckboxesWrapper>
          <CheckboxWrapper>
            <MyCheckboxWithModel model={model} value={DocumentType.DOCX} />
            {t('hints.docx_format')}
          </CheckboxWrapper>

          <CheckboxWrapper>
            <MyCheckboxWithModel model={model} value={DocumentType.PDF} />
            {t('hints.pdf_format')}
          </CheckboxWrapper>
        </CheckboxesWrapper>
      )}

      <Controls>
        <PrimaryButton variant="empty" onClick={handleCancel}>
          {t('hints.cancel')}
        </PrimaryButton>
        <PrimaryButton
          onClick={createDocuments}
          loading={templateChecking}
          disabled={templateChecking}
        >
          {templateChecked ? t('hints.generate_anyway') : t('hints.generate')}
        </PrimaryButton>
      </Controls>
    </CreateDocumentsHint>
  );
};

export { SelectFormatsHint };
