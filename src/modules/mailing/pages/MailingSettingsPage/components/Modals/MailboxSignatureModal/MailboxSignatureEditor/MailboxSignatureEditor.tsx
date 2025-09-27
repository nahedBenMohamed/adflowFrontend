import {
  BooleanModel,
  DeleteButton,
  FormItem,
  FormItemLabel,
  FunctionalTextEditor,
  Hint,
  InputModel,
  MultiselectModel,
  MultiselectWithCheckboxes,
  MyCheckboxWithBooleanModel,
  MyInput,
  PrimaryButton,
  WarningModal,
  envUtil,
  validateForm,
  type Option,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CreateMailboxSignatureDto, UpdateMailboxSignatureDto } from '../../../../../../api';
import type { MailboxSignature } from '../../../../../../shared';
import { EditorApproveButtonSkeleton } from '../EditorApproveButtonSkeleton/EditorApproveButtonSkeleton';
import { MailboxSignatureEditorSkeleton } from '../MailboxSignatureEditorSkeleton/MailboxSignatureEditorSkeleton';

const Root = styled.div`
  width: 100%;
  max-width: 552px;

  display: flex;
  flex-direction: column;
  gap: 24px;

  padding-left: 24px;
  border-left: 1px solid var(--graphite-graphite-80);
`;

const Content = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SaveButtonWrapper = styled.div`
  margin-top: auto;
  margin-left: auto;
`;

const DeleteButtonWrapper = styled.div`
  margin-right: auto;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const CheckboxTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  adding: boolean;
  loading: boolean;
  deleting: boolean;
  mailboxesOptions: Option<number>[];
  activeSignature?: MailboxSignature;
  deleteSignature: () => Promise<void>;
  addSignature: (dto: CreateMailboxSignatureDto) => void;
  updateSignature: (dto: UpdateMailboxSignatureDto) => void;
}

interface InitialForm {
  name: InputModel;
  signature: InputModel;
  sendAsHtml: BooleanModel;
  linkedMailboxes: MultiselectModel<number>;
}

const EDITOR_CONTENT_HEIGHT = '200px';

const MailboxSignatureEditor = observer((props: Props) => {
  const { t } = useTranslation('module.mailing', {
    keyPrefix:
      'mailing.pages.mailing_settings_page.modals.mailbox_signature_modal.mailbox_signature_editor',
  });

  const {
    adding,
    loading,
    deleting,
    mailboxesOptions,
    activeSignature,
    deleteSignature,
    addSignature,
    updateSignature,
  } = props;

  const form = useLocalObservable<InitialForm>(() => ({
    name: InputModel.create(activeSignature?.name).required(),
    signature: InputModel.create(activeSignature?.text).required(),
    sendAsHtml: BooleanModel.create(Boolean(activeSignature?.isHtml)),
    linkedMailboxes: MultiselectModel.create(activeSignature?.linkedMailboxes ?? []).required(),
  }));

  const [deleteWarningOpened, { close: hideDeleteWarning, open: showDeleteWarning }] =
    useDisclosure(false);

  const onSave = () => {
    if (!validateForm(form)) return;

    if (!activeSignature) {
      const dto = new CreateMailboxSignatureDto({
        name: form.name.value,
        text: form.signature.value,
        isHtml: form.sendAsHtml.value,
        linkedMailboxes: form.linkedMailboxes.values,
      });

      addSignature(dto);

      return;
    }

    const dto = new UpdateMailboxSignatureDto({
      name: form.name.value,
      text: form.signature.value,
      isHtml: form.sendAsHtml.value,
      linkedMailboxes: form.linkedMailboxes.values,
    });

    updateSignature(dto);
  };

  const handleApproveDelete = async (): Promise<void> => {
    await deleteSignature();

    hideDeleteWarning();
  };

  const handleChangeView = () => {
    form.signature.value = '';
  };

  return (
    <Root>
      <Content>
        {loading ? (
          <MailboxSignatureEditorSkeleton />
        ) : (
          <>
            <MyInput
              model={form.name}
              variant="outlined"
              placeholder={t('placeholders.signature_name')}
            />

            <FunctionalTextEditor
              showSubControls
              variant="outlined"
              toolbarDefaultVisible
              model={form.signature}
              key={activeSignature?.id}
              invalid={!form.signature.isValid()}
              contentMinHeight={EDITOR_CONTENT_HEIGHT}
              contentMaxHeight={EDITOR_CONTENT_HEIGHT}
              placeholder={t('placeholders.your_signature')}
              showHTMLProps={{ show: form.sendAsHtml.value, minRows: 10, maxRows: 10 }}
            />
          </>
        )}
      </Content>

      <CheckboxWrapper>
        <MyCheckboxWithBooleanModel model={form.sendAsHtml} handleChange={handleChangeView} />

        <CheckboxTitleWrapper>
          {t('save_as_html')}

          <Hint text={t('save_as_html_hint', { company: envUtil.appName })} />
        </CheckboxTitleWrapper>
      </CheckboxWrapper>

      {!loading && (
        <>
          <FormItem gap="8px">
            <FormItemLabel $color="var(--button-text-graphite-primary-text)">
              {t('available_in_mailboxes')}
            </FormItemLabel>

            <MultiselectWithCheckboxes
              withinPortal
              variant="outlined"
              options={mailboxesOptions}
              model={form.linkedMailboxes}
              placeholder={t('placeholders.select_mailboxes')}
            />
          </FormItem>

          <DeleteButtonWrapper>
            <DeleteButton text={t('delete')} onClick={showDeleteWarning} />
          </DeleteButtonWrapper>
        </>
      )}

      <SaveButtonWrapper>
        {loading ? (
          <EditorApproveButtonSkeleton />
        ) : (
          <PrimaryButton loading={adding} disabled={adding} onClick={onSave}>
            {t('save')}
          </PrimaryButton>
        )}
      </SaveButtonWrapper>

      <WarningModal
        icon="trashbin"
        height="fit-content"
        maxHeight="fit-content"
        approveLoading={deleting}
        title={t('warning_title')}
        isOpened={deleteWarningOpened}
        annotation={t('warning_annotation')}
        onClose={hideDeleteWarning}
        onApprove={handleApproveDelete}
      />
    </Root>
  );
});

export { MailboxSignatureEditor };
