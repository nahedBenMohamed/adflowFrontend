import { entityTypeStore, iconStore } from '@/app';
import { chatApi } from '@/modules/multichat';
import { UpdateGroupChatDto, upsertChatInCache } from '@/modules/multichat/api';
import type { EntityForm } from '@/modules/section';
import {
  batchRequest,
  BooleanModel,
  CheckboxModel,
  DialogModalSecondary,
  Hint,
  MyCheckboxWithBooleanModel,
  MyCheckboxWithModel,
  type Nullable,
  SpanWithEllipsis,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  white-space: pre-wrap;
  color: var(--button-text-graphite-primary-text);

  padding: 16px 24px;
`;

const Content = styled.div`
  width: 100%;
  max-width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 12px;

  overflow: hidden;
`;

const ItemWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  overflow: hidden;
`;

const IconWrapper = styled.div<{ $moduleColor: string }>`
  width: 14px;
  height: 14px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  svg {
    rect,
    circle,
    ellipse,
    path {
      fill: ${p => p.$moduleColor};
    }
  }
`;

const Delimiter = styled.hr`
  width: 100%;
  height: 1px;
  background: var(--graphite-graphite-120);
`;

interface InitialForm {
  entityFormIds: CheckboxModel;
  changeResponsibleInChats: BooleanModel;
}

interface Props {
  isOpened: boolean;
  currentEntityId: number;
  responsibleUserId: number;
  linkedEntityForms: EntityForm[];
  hide: () => void;
}

const ChangeLinkedResponsiblesModal = observer((props: Props) => {
  const { isOpened, currentEntityId, responsibleUserId, linkedEntityForms, hide } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.change_linked_responsibles_modal',
  });

  const form = useLocalObservable<InitialForm>(() => ({
    entityFormIds: CheckboxModel.create([]),
    changeResponsibleInChats: BooleanModel.create(false),
  }));

  const handleApprove = async (): Promise<void> => {
    linkedEntityForms
      .filter(ef => form.entityFormIds.values.includes(ef.id))
      .forEach(ef => ef.responsibleUserId.setValue(responsibleUserId));

    if (form.changeResponsibleInChats.value) {
      const chats = (
        await Promise.all(
          linkedEntityForms
            .filter(ef => form.entityFormIds.values.includes(ef.id))
            .map(ef => chatApi.findFullChats({ filter: { entityId: ef.id } }))
        )
      ).flatMap(ch => ch.chats);

      chats.push(...(await chatApi.findFullChats({ filter: { entityId: currentEntityId } })).chats);

      batchRequest({
        array: chats,
        cb: async (chat): Promise<void> => {
          const participants = chat
            .getInternalUsers()
            .map<Nullable<number>>(u => u.userId)
            .filter(Boolean);

          if (participants.includes(responsibleUserId)) return;

          const dto = UpdateGroupChatDto.create({
            participantIds: [...participants, responsibleUserId],
          });

          const updatedChat = await chatApi.updateGroupChat(chat.id, dto);
          upsertChatInCache(updatedChat);
        },
      });
    }

    hide();
  };

  if (!isOpened || linkedEntityForms.length === 0) return null;

  return (
    <DialogModalSecondary
      hideCancel
      width="400px"
      isOpened={isOpened}
      maxHeight="416px"
      height="fit-content"
      Header={t('header')}
      onClose={hide}
      onApprove={handleApprove}
    >
      <Root>
        {t('annotation')}

        <Content>
          {linkedEntityForms.map(ef => (
            <ItemWrapper key={ef.id}>
              <MyCheckboxWithModel model={form.entityFormIds} value={ef.id} />

              <IconWrapper
                $moduleColor={iconStore.getEntityColorByEntityCategory(
                  entityTypeStore.getById(ef.entityTypeId).entityCategory
                )}
              >
                {iconStore.getByName(entityTypeStore.getById(ef.entityTypeId).section.icon).icon}
              </IconWrapper>

              <SpanWithEllipsis text={ef.name.trimmedValue} />
            </ItemWrapper>
          ))}
        </Content>

        <Delimiter />

        <Content>
          <ItemWrapper>
            <MyCheckboxWithBooleanModel model={form.changeResponsibleInChats} />

            <SpanWithEllipsis text={t('change_responsible_in_chats')} />

            <Hint text={t('chats_hint')} />
          </ItemWrapper>
        </Content>
      </Root>
    </DialogModalSecondary>
  );
});

ChangeLinkedResponsiblesModal.displayName = 'ChangeLinkedResponsiblesModal';
export { ChangeLinkedResponsiblesModal };
