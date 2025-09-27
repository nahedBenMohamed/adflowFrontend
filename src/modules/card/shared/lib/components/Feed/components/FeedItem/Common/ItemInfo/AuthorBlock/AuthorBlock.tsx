import { AvatarCircle, type User } from '@/shared';
import { useTranslation } from 'react-i18next';
import { InfoBlock } from '../InfoBlock/InfoBlock';

interface Props {
  user: User;
  title?: string;
  isResolvedTask?: boolean;
}

const AuthorBlock = (props: Props) => {
  const { user, title, isResolvedTask } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.common',
  });

  return (
    <InfoBlock
      showTitle
      info={user.fullName}
      title={title || t('author')}
      isResolvedTask={isResolvedTask}
    >
      <AvatarCircle avatar={user.getAvatar()} size="large" />
    </InfoBlock>
  );
};

export { AuthorBlock };
