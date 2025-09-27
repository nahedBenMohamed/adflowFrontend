import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { CreateButton, PermissionObjectType, type EntityType } from '@/shared';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  boardId: number;
  entityType: EntityType;
  currentPageEncodedUrl: string;
  children?: ReactNode;
}

const SectionHeaderWithBoardsControls = (props: Props) => {
  const { entityType, boardId, currentPageEncodedUrl, children } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common',
  });

  const { user: currentUser } = authStore;

  return (
    <>
      {children}

      {currentUser && currentUser.canCreate(PermissionObjectType.ENTITY_TYPE, entityType.id) && (
        <CreateButton
          linkProps={{
            to: routes.addCard({
              boardId,
              entityTypeId: entityType.id,
              from: currentPageEncodedUrl,
            }),
          }}
          tooltip={t(`create_button_tooltip.${entityType.entityCategory}`)}
        />
      )}
    </>
  );
};

export { SectionHeaderWithBoardsControls };
