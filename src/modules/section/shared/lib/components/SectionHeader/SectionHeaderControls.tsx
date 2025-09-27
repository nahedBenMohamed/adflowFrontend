import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { CreateButton, PermissionObjectType, type EntityType } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

interface Props {
  et: EntityType;
}

const SectionHeaderControls = observer((props: Props) => {
  const { et } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common',
  });

  const { user: currentUser } = authStore;

  if (!currentUser?.canCreate(PermissionObjectType.ENTITY_TYPE, et.id)) return null;

  return (
    <CreateButton
      linkProps={{ to: routes.addCard({ entityTypeId: et.id }) }}
      tooltip={t(`create_button_tooltip.${et.entityCategory}`)}
    />
  );
});

SectionHeaderControls.displayName = 'SectionHeaderControls';
export { SectionHeaderControls };
