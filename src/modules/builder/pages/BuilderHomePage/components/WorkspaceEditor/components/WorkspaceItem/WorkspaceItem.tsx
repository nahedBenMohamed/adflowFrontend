import { iconStore } from '@/app';
import {
  PrimaryButton,
  TruncateMixin,
  WarningModal,
  useModalControl,
  type IconName,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 16px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-element);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;

  ${TruncateMixin}
`;

const IconWrapper = styled.div<{ $moduleColor: string }>`
  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p => p.$moduleColor};
  }
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const Tag = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 0px 6px 1px 6px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--button-text-graphite-secondary-text);
`;

const Controls = styled.div`
  display: flex;

  margin-left: auto;
`;

const OpenModuleButtonWrapper = styled.div`
  margin-left: 8px;
`;

interface Props {
  tag: string;
  name: string;
  editLink: string;
  iconName: IconName;
  moduleColor: string;
  sectionLink?: string;
  onDelete: () => Promise<void>;
}

const WorkspaceItem = observer((props: Props) => {
  const { tag, name, editLink, iconName, moduleColor, sectionLink, onDelete } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.workspace_editor_page',
  });

  const [deleting, setDeleting] = useState(false);

  const deleteModalControl = useModalControl(false);

  const { icon } = iconStore.getByName(iconName);

  const handleDelete = async (): Promise<void> => {
    try {
      setDeleting(true);

      await onDelete?.();

      deleteModalControl.close();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Root>
      <IconWrapper $moduleColor={moduleColor}>{icon}</IconWrapper>
      <Title>{name}</Title>

      <Tag>{tag}</Tag>

      <Controls>
        {Boolean(onDelete) && (
          <PrimaryButton variant="empty-danger" onClick={deleteModalControl.open}>
            {t('delete')}
          </PrimaryButton>
        )}

        <PrimaryButton linkProps={{ to: editLink }}>{t('edit')}</PrimaryButton>

        {sectionLink && (
          <OpenModuleButtonWrapper>
            <PrimaryButton variant="link-outlined" linkProps={{ to: sectionLink }}>
              {t('open_module')}
            </PrimaryButton>
          </OpenModuleButtonWrapper>
        )}
      </Controls>

      <WarningModal
        approveLoading={deleting}
        title={t('warn_title')}
        annotation={t('warn_annotation')}
        isOpened={deleteModalControl.opened}
        onApprove={handleDelete}
        onClose={deleteModalControl.close}
      />
    </Root>
  );
});

WorkspaceItem.displayName = 'WorkspaceItem';
export { WorkspaceItem };
