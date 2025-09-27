import { entityTypeStore, userStore } from '@/app';
import {
  DeleteButton,
  DownloadButton,
  ExpandButton,
  FileUtil,
  InputModel,
  MultiselectModel,
  MultiselectWithCheckboxes,
  MyInput,
  ParticipantsSelect,
  UserView,
  WarningModal,
  debounce,
  useDropdownWidth,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import Collapsible from 'react-collapsible';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UpdateDocumentTemplateDto, type DocumentTemplateDto } from '../../../../../api';

const Root = styled.li<{ $controlsVisible: boolean }>`
  flex-direction: column;

  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  padding: 16px 16px 0;

  .workspace__DeleteButton--Root,
  .workspace__DownloadButton--Root {
    opacity: ${p => (p.$controlsVisible ? 1 : 0)};
    scale: ${p => (p.$controlsVisible ? 1 : 0)};
  }

  &:hover {
    .workspace__DeleteButton--Root,
    .workspace__DownloadButton--Root {
      opacity: 1;
      scale: 1;
    }
  }
`;

const PropertyBlock = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;

  ${p => p.$disabled && `pointer-events: none`};
`;

const PropertyBlockTitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const TopBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  color: var(--button-text-graphite-priory-text);

  padding-bottom: 12px;
`;

const BottomBlock = styled.div`
  border-top: 1px solid var(--graphite-graphite-80);
`;

const BottomBlockContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, calc(33% - 16px));
  gap: 24px;

  padding: 12px 0 16px;
`;

interface Props {
  template: DocumentTemplateDto;
  defaultControlsVisible: boolean;
  onDeleteTemplate: () => void;
  onUpdateTemplate: (dto: UpdateDocumentTemplateDto) => Promise<void>;
}

interface InitialForm {
  name: InputModel;
  entityTypeIds: MultiselectModel<number>;
  accessibleBy: MultiselectModel<number>;
}

const DocumentTemplateItem = observer((props: Props) => {
  const { template, defaultControlsVisible, onDeleteTemplate, onUpdateTemplate } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.templates.document_templates_page.ui.document_template_item',
  });

  const [opened, { toggle }] = useDisclosure(true);

  const templateForm = useLocalObservable<InitialForm>(() => ({
    name: InputModel.create(template.name).required(),
    entityTypeIds: MultiselectModel.create<number>(template.entityTypeIds),
    accessibleBy: MultiselectModel.create<number>(template.accessibleBy),
  }));

  const [deleteModalOpened, { close: hideDeleteModal, open: showDeleteModal }] =
    useDisclosure(false);
  const [controlsVisible, { close: hideControls, open: showControls }] =
    useDisclosure(defaultControlsVisible);
  const [fileDownloading, setFileDownloading] = useState(false);

  const [dropdownWidth, ref] = useDropdownWidth();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateTemplate = useCallback(
    debounce(async (): Promise<void> => {
      if (!templateForm.name.validate()) return;

      const dto = new UpdateDocumentTemplateDto({
        name: templateForm.name.value,
        fileId: template.file.fileId,
        accessibleBy: templateForm.accessibleBy.values,
        entityTypeIds: templateForm.entityTypeIds.values,
      });

      await onUpdateTemplate(dto);
    }, 500),
    []
  );

  const handleDownloadFile = async (): Promise<void> => {
    try {
      setFileDownloading(true);

      await FileUtil.downloadFile({
        url: template.file.downloadUrl,
        fileName: template.file.fileName,
      });
    } finally {
      setFileDownloading(false);
    }
  };

  const handleBlur = () => {
    if (!templateForm.name.validate()) templateForm.name.setValue(template.name);

    hideControls();
  };

  return (
    <Root $controlsVisible={controlsVisible}>
      <Collapsible
        triggerDisabled
        trigger={
          <TopBlock>
            <MyInput
              medium
              fontSize="large"
              model={templateForm.name}
              onBlur={handleBlur}
              onFocus={showControls}
              handleChange={debouncedUpdateTemplate}
            />

            <DownloadButton size="small" loading={fileDownloading} onClick={handleDownloadFile} />
            <DeleteButton size="small" onClick={showDeleteModal} />
            <ExpandButton expanded={opened} onClick={toggle} />
          </TopBlock>
        }
        transitionTime={100}
        open={opened}
        onOpen={showControls}
        onClose={hideControls}
      >
        <BottomBlock>
          <BottomBlockContent>
            <PropertyBlock ref={ref}>
              <PropertyBlockTitle>{t('available_in_sections')}</PropertyBlockTitle>

              <MultiselectWithCheckboxes
                variant="empty"
                titleMinWidth={0}
                dropdownMaxWidth="400px"
                width={`${dropdownWidth}px`}
                model={templateForm.entityTypeIds}
                options={entityTypeStore.entityTypesOptions}
                placeholder={t('placeholders.select_sections')}
                handleChange={debouncedUpdateTemplate}
              />
            </PropertyBlock>

            <PropertyBlock>
              <PropertyBlockTitle>{t('creator')}</PropertyBlockTitle>

              <UserView user={userStore.getById(template.createdBy)} />
            </PropertyBlock>

            <PropertyBlock>
              <PropertyBlockTitle>{t('access_rights')}</PropertyBlockTitle>

              <ParticipantsSelect
                model={templateForm.accessibleBy}
                handleChange={debouncedUpdateTemplate}
              />
            </PropertyBlock>
          </BottomBlockContent>
        </BottomBlock>
      </Collapsible>

      {deleteModalOpened && (
        <WarningModal
          icon="trashbin"
          title={t('warning_title')}
          isOpened={deleteModalOpened}
          annotation={t('warning_annotation')}
          onClose={hideDeleteModal}
          onApprove={onDeleteTemplate}
        />
      )}
    </Root>
  );
});

DocumentTemplateItem.displayName = 'DocumentTemplateItem';
export { DocumentTemplateItem };
