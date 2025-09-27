import {
  FileUtil,
  type FileLink,
  type FunctionalOptionWithComponent,
  type User,
  type UtcDate,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { VioletPencilIcon } from '../../../../../../../assets';
import { useFeedItemOutline } from '../../../../../../hooks';
import type { EditTextProps } from '../../../../../../models';
import {
  AttachmentsBlock,
  AuthorBlock,
  DateBlock,
  FeedItem,
  FeedItemLeftBlock,
  FeedItemWrapper,
  ItemInfo,
  ResultBlock,
} from '../../../FeedItem';

const DescriptionWrapper = styled.div`
  margin-top: 16px;
`;

interface Props {
  creator: User;
  text: string;
  createdAt: UtcDate;
  fileLinks: FileLink[];
  headerControlsDropdownOptions: FunctionalOptionWithComponent[];
  editTextProps: EditTextProps;
  handleDeleteFileLink: (file: FileLink) => void;
}

const NoteBlockTemplate = observer((props: Props) => {
  const {
    creator,
    text,
    fileLinks,
    createdAt,
    headerControlsDropdownOptions,
    editTextProps,
    handleDeleteFileLink,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.note_block',
  });

  const highlighted = useFeedItemOutline(createdAt);

  const handleDownloadFile = async ({
    url,
    fileName,
  }: {
    url: string;
    fileName: string;
  }): Promise<void> => {
    await FileUtil.downloadFile({ url, fileName });
  };

  return (
    <FeedItemWrapper>
      <FeedItemLeftBlock Icon={<VioletPencilIcon />} />

      <FeedItem
        title={t('block_title')}
        highlighted={highlighted}
        controls={headerControlsDropdownOptions}
      >
        <ItemInfo>
          <AuthorBlock user={creator} />
          <DateBlock title={t('creation_date')} date={createdAt} />
        </ItemInfo>

        {(text || editTextProps.isEditMode) && (
          <DescriptionWrapper>
            <ResultBlock
              noPadding={!editTextProps.isEditMode}
              text={text}
              editTextProps={editTextProps}
            />
          </DescriptionWrapper>
        )}

        {fileLinks.length > 0 && (
          <AttachmentsBlock
            margin="16px 0 0"
            fileLinks={fileLinks}
            onDelete={handleDeleteFileLink}
            handleDownloadFile={handleDownloadFile}
          />
        )}
      </FeedItem>
    </FeedItemWrapper>
  );
});

NoteBlockTemplate.displayName = 'NoteBlockTemplate';
export { NoteBlockTemplate };
