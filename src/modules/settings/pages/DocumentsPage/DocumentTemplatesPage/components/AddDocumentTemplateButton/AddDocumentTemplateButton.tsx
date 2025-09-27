import { authStore } from '@/modules/auth';
import { FileUtil, PrimaryButton } from '@/shared';
import { useRef, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CreateDocumentTemplateDto } from '../../../../../api';
import { removeFileExtensionFromName } from '../../../../../shared';

const HiddenInput = styled.input`
  display: none;
`;

interface Props {
  adding: boolean;
  onAddTemplate: (dto: CreateDocumentTemplateDto) => void;
}

const AddDocumentTemplateButton = (props: Props) => {
  const { adding, onAddTemplate } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.templates.document_templates_page',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const currentUser = authStore.user;

  const onSelectFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const firstFile = (target.files as FileList)[0];

    if (!firstFile)
      throw new Error(`File selection failed, nothing was selected, firstFile ${firstFile}`);

    const formData = new FormData();
    formData.append('file', firstFile, encodeURIComponent(firstFile.name));

    const firstFileUploadResult = (await FileUtil.uploadFiles(formData))[0];

    if (!firstFileUploadResult) {
      throw new Error(`File upload failed, nothing was uploaded, formData ${formData}`);
    }

    const fileNameWithoutExtension = removeFileExtensionFromName(firstFile.name);

    const dto = new CreateDocumentTemplateDto({
      name: fileNameWithoutExtension,
      fileId: firstFileUploadResult.id,
      accessibleBy: currentUser ? [currentUser.id] : [],
      entityTypeIds: [],
    });

    onAddTemplate(dto);

    target.value = '';
  };

  const handleInputClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <>
      <PrimaryButton disabled={adding} loading={adding} onClick={handleInputClick}>
        {t('add_document_template')}
      </PrimaryButton>

      <HiddenInput ref={inputRef} type="file" accept=".docx" onChange={onSelectFile} />
    </>
  );
};

export { AddDocumentTemplateButton };
