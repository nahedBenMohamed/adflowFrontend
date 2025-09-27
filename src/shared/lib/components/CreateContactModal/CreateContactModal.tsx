import { boardApiUtil, CreateContactAndLeadDto, entityTypeStore } from '@/app';
import {
  DialogModalSecondary,
  EntityCategory,
  MyCheckbox,
  MySelect,
  SelectModel,
  type Option,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  overflow-y: auto;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 16px 32px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const CheckboxContent = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxCaption = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);
`;

const NavigateWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

interface Props {
  isOpened: boolean;
  onClose: () => void;
  createContact: ({
    dto,
    navigateToCard,
  }: {
    dto: CreateContactAndLeadDto;
    navigateToCard: boolean;
  }) => Promise<void>;
}

interface CreateContactForm {
  createContact: boolean;
  createLead: boolean;
  contactEntityTypeId: SelectModel;
  leadEntityTypeId: SelectModel;
  leadBoardId: SelectModel;
  navigateToCard: boolean;
}

const CreateContactModal = observer((props: Props) => {
  const { isOpened, onClose, createContact } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.modals.create_contact_modal',
  });

  const createContactForm = useLocalObservable<CreateContactForm>(() => ({
    createLead: true,
    createContact: true,
    navigateToCard: true,
    leadBoardId: SelectModel.create().required(),
    leadEntityTypeId: SelectModel.create().required(),
    contactEntityTypeId: SelectModel.create().required(),
  }));

  const contactEntityTypeOptions = entityTypeStore.entityTypes
    .filter(entityType => entityType.entityCategory === EntityCategory.CONTACT)
    .map<Option>(entityType => ({
      label: entityType.name,
      value: entityType.id,
    }));

  const [leadEntityTypeOptions, setLeadEntityTypeOptions] = useState<Option<number>[]>([]);

  useEffect(() => {
    const options = createContactForm.contactEntityTypeId.value
      ? entityTypeStore
          .getById(createContactForm.contactEntityTypeId.value)
          .linkedEntityTypes.map<Option<number>>(et => ({
            value: et.targetId,
            label: entityTypeStore.getById(et.targetId).name,
          }))
      : entityTypeStore.entityTypes
          .filter(et => et.entityCategory === EntityCategory.DEAL)
          .map<Option<number>>(et => ({
            value: et.id,
            label: et.name,
          }));

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setLeadEntityTypeOptions(options);

    createContactForm.leadBoardId.value = null;
    createContactForm.leadEntityTypeId.value = null;
  }, [createContactForm]);

  const handleChangeCreateContactCheckbox = () => {
    if (createContactForm.createContact) createContactForm.contactEntityTypeId.value = null;

    createContactForm.createContact = !createContactForm.createContact;
  };

  const handleChangeCreateLeadCheckbox = () => {
    if (createContactForm.createLead) {
      createContactForm.leadEntityTypeId.value = null;
      createContactForm.leadBoardId.value = null;
    }

    createContactForm.createLead = !createContactForm.createLead;
  };

  const handleChangeNavigateToCardCheckbox = () =>
    (createContactForm.navigateToCard = !createContactForm.navigateToCard);

  const [approving, setApproving] = useState(false);

  const handleApprove = async (): Promise<void> => {
    try {
      setApproving(true);

      if (createContactForm.createContact && !createContactForm.contactEntityTypeId.validate())
        return;

      if (
        createContactForm.createLead &&
        !(createContactForm.leadEntityTypeId.validate() && createContactForm.leadBoardId.validate())
      )
        return;

      const dto = new CreateContactAndLeadDto({
        contactTypeId: createContactForm.contactEntityTypeId.value,
        leadTypeId: createContactForm.leadEntityTypeId.value,
        leadBoardId: createContactForm.leadBoardId.value,
      });

      await createContact({
        dto,
        navigateToCard: createContactForm.navigateToCard,
      });
    } finally {
      setApproving(false);
    }
  };

  const boardsOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(
    createContactForm.leadEntityTypeId.value
  );

  return (
    <DialogModalSecondary
      width="440px"
      maxHeight="384px"
      isOpened={isOpened}
      loading={approving}
      Header={t('title')}
      approveTitle={t('create')}
      approveDisabled={
        (!createContactForm.createContact && !createContactForm.createLead) || approving
      }
      onClose={onClose}
      onApprove={handleApprove}
    >
      <Root>
        <CheckboxWrapper>
          <MyCheckbox
            checked={createContactForm.createContact}
            onChange={handleChangeCreateContactCheckbox}
          />

          <CheckboxContent>
            <CheckboxCaption>{t('create_contact')}</CheckboxCaption>

            {createContactForm.createContact && (
              <MySelect
                withinPortal
                variant="outlined"
                model={createContactForm.contactEntityTypeId}
                options={contactEntityTypeOptions}
                placeholder={t('placeholders.where_contact')}
              />
            )}
          </CheckboxContent>
        </CheckboxWrapper>

        <CheckboxWrapper>
          <MyCheckbox
            checked={createContactForm.createLead}
            onChange={handleChangeCreateLeadCheckbox}
          />

          <CheckboxContent>
            <CheckboxCaption>{t('create_lead')}</CheckboxCaption>

            {createContactForm.createLead && (
              <MySelect
                withinPortal
                variant="outlined"
                options={leadEntityTypeOptions}
                model={createContactForm.leadEntityTypeId}
                placeholder={t('placeholders.where_lead')}
              />
            )}

            {createContactForm.createLead && createContactForm.leadEntityTypeId.value && (
              <MySelect
                withinPortal
                variant="outlined"
                model={createContactForm.leadBoardId}
                placeholder={t('placeholders.board_for_lead')}
                options={boardsOptions}
              />
            )}
          </CheckboxContent>
        </CheckboxWrapper>

        <NavigateWrapper>
          <MyCheckbox
            checked={createContactForm.navigateToCard}
            onChange={handleChangeNavigateToCardCheckbox}
          />

          <CheckboxContent>
            <CheckboxCaption>{t('open_entity')}</CheckboxCaption>
          </CheckboxContent>
        </NavigateWrapper>
      </Root>
    </DialogModalSecondary>
  );
});

CreateContactModal.displayName = 'CreateContactModal';
export { CreateContactModal };
