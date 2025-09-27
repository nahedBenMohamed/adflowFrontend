import { DropdownListItem, ListItemText } from '@/shared';
import { useTranslation } from 'react-i18next';
import { ImportIcon } from '../../../../../assets';
import { IconWrapper } from '../IconWrapper/IconWrapper';

interface Props {
  onClick: () => void;
}

const ImportEntitiesButton = (props: Props) => {
  const { onClick } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.settings_button',
  });

  return (
    <>
      <DropdownListItem $relative $justify="flex-start" onClick={onClick}>
        <IconWrapper>
          <ImportIcon />
        </IconWrapper>

        <ListItemText>{t('import')}</ListItemText>
      </DropdownListItem>
    </>
  );
};

export { ImportEntitiesButton };
