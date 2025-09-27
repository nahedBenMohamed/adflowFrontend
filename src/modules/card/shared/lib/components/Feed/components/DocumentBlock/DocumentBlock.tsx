import { userStore } from '@/app';
import type { FileLink, UtcDate } from '@/shared';
import { useTranslation } from 'react-i18next';
import { BlueFileIcon } from '../../../../../assets';
import { useFeedItemOutline } from '../../../../hooks';
import {
  AttachmentsBlock,
  AuthorBlock,
  DateBlock,
  FeedItem,
  FeedItemLeftBlock,
  FeedItemWrapper,
  ItemInfo,
} from '../FeedItem';

interface Props {
  createdAt: UtcDate;
  fileLink: FileLink;
}

const DocumentBlock = (props: Props) => {
  const { createdAt, fileLink } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.document_block',
  });

  const highlighted = useFeedItemOutline(createdAt);

  const creator = userStore.getById(fileLink.fileInfo.createdBy);

  const fileName = fileLink.fileInfo.fileName;

  return (
    <FeedItemWrapper>
      <FeedItemLeftBlock Icon={<BlueFileIcon />} />

      <FeedItem title={fileName} highlighted={highlighted}>
        <ItemInfo>
          <AuthorBlock user={creator} />
          <DateBlock title={t('creation_date')} date={createdAt} />
        </ItemInfo>

        <AttachmentsBlock fileLinks={[fileLink]} margin="16px 0 0" />
      </FeedItem>
    </FeedItemWrapper>
  );
};

export { DocumentBlock };
