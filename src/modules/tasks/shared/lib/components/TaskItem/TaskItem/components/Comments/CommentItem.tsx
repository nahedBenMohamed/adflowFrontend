import { userStore } from '@/app';
import {
  AvatarCircle,
  BlockFileList,
  DeleteButton,
  FileUtil,
  FunctionalTextEditor,
  InnerHTMLNormalizerMixin,
  InputModel,
  PencilButton,
  ShowMoreButton,
  type FileLink,
  type User,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import DOMPurify from 'dompurify';
import { convert } from 'html-to-text';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UpdateTaskCommentDto } from '../../../../../../../api';
import { ActiveLikeIcon, InactiveLikeIcon } from '../../../../../../assets';
import type { TaskComment } from '../../../../../models';

const ICONS_WRAPPER_CLASS = 'workspace__CommentItemRoot--Body__IconsWrapper';

const CommentItemRoot = styled.li<{ $controlsVisible: boolean }>`
  display: flex;
  flex-shrink: 0;
  gap: 8px;

  // to prevent conflicts with buttons view in the BlockFileList (there is a usage of the DeleteButton too)
  .${ICONS_WRAPPER_CLASS} {
    .workspace__DeleteButton--Root,
    .workspace__PencilButton--Root {
      opacity: ${p => (p.$controlsVisible ? 1 : 0)};
      scale: ${p => (p.$controlsVisible ? 1 : 0)};
    }
  }

  &:hover {
    .${ICONS_WRAPPER_CLASS} {
      .workspace__DeleteButton--Root,
      .workspace__PencilButton--Root {
        opacity: 1;
        scale: 1;
      }
    }
  }
`;

const Body = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding-top: 4px;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const Time = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-secondary-text);
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  margin-left: auto;
`;

const LikeIconWrapper = styled.button`
  width: fit-content;
  height: 16px;

  display: flex;
  align-items: center;
  gap: 2px;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }
`;

const LikeCount = styled.span`
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  color: var(--button-text-graphite-primary-text);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Text = styled.div<{ $expanded: boolean }>`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${p => p.$expanded && `-webkit-line-clamp: unset`};

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  ${InnerHTMLNormalizerMixin}
`;

interface FileListWrapperProps {
  $hasText: boolean;
  $expanded: boolean;
}

const FileListWrapper = styled.div<FileListWrapperProps>`
  max-height: ${p => (p.$expanded ? 'unset' : '68px')};

  padding-top: 10px;
  overflow: ${p => (p.$expanded ? 'unset' : 'hidden')};
  border-top: 1px solid ${p => (p.$hasText ? 'var(--graphite-graphite-40)' : 'transparent')};
`;

const ShowMoreButtonWrapper = styled.div`
  margin-left: auto;
`;

interface Props {
  comment: TaskComment;
  currentUser: User;
  onUpdate: (commentId: number, dto: UpdateTaskCommentDto) => void;
  onDelete: (commentId: number) => void;
  onLike: (commentId: number) => void;
  onUnlike: (commentId: number) => void;
}

const CommentItem = observer((props: Props) => {
  const { comment, currentUser, onDelete, onUpdate, onLike, onUnlike } = props;
  const { createdAt, createdBy, text, fileLinks } = comment;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.task_item',
  });

  const user = userStore.getById(createdBy);
  const { fullName } = user;
  const currentUserId = currentUser.id;

  const textRef = useRef<HTMLDivElement>(null);
  const [isTextExpandable, setIsTextExpandable] = useState(false);
  const [areFilesExpandable, setAreFilesExpandable] = useState(fileLinks.length > 2);
  const [isTextExpanded, { toggle: toggleTextExpanded }] = useDisclosure(false);
  const newLocal = useDisclosure(false);
  const [areFilesExpanded, { toggle: toggleFilesExpanded }] = newLocal;
  const [isLiked, setIsLiked] = useState(comment.likedUserIds.includes(currentUserId));

  const [isEditMode, { toggle: toggleEditMode }] = useDisclosure(false);
  const textModel = useLocalObservable(() => InputModel.create(text).required());

  useEffect(() => {
    if (textRef.current)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setIsTextExpandable(textRef.current.scrollHeight > textRef.current.clientHeight);
  }, [text]);

  useEffect(() => {
    if (!isEditMode) textModel.setValue(text);
  }, [isEditMode, text, textModel]);

  const onFileDelete = (file: FileLink) => {
    comment.fileLinks = comment.fileLinks.filter(f => f.fileInfo.fileId !== file.fileInfo.fileId);
    FileUtil.deleteFileLink(file.id);

    if (comment.fileLinks.length <= 2) setAreFilesExpandable(false);
  };

  const handleExpand = () => {
    if (isTextExpandable) toggleTextExpanded();

    if (areFilesExpandable) toggleFilesExpanded();
  };

  const handleUpdate = () => {
    if (textModel.isValid()) {
      if (textModel.value === text) {
        toggleEditMode();

        return;
      }

      comment.text = textModel.value;
      const dto = new UpdateTaskCommentDto(textModel.value);

      onUpdate(comment.id, dto);
      toggleEditMode();
    }
  };

  const handleDelete = () => {
    onDelete(comment.id);
  };

  const handleLike = () => {
    comment.likedUserIds.push(currentUserId);
    setIsLiked(true);

    onLike(comment.id);
  };

  const handleUnlike = () => {
    comment.likedUserIds = comment.likedUserIds.filter(id => id !== currentUserId);
    setIsLiked(false);

    onUnlike(comment.id);
  };

  const likesCount = comment.likedUserIds.length;
  const canMutate = currentUserId === createdBy || currentUser.isAdmin;

  const parsedCommentText = convert(text);

  return (
    <CommentItemRoot $controlsVisible={isEditMode}>
      <AvatarCircle avatar={user.getAvatar()} />

      <Body>
        <Header>
          <Name>{fullName}</Name>
          <Time>
            {t('date', { date: createdAt.displayShort(), time: createdAt.displayTime() })}
          </Time>

          <IconsWrapper className={ICONS_WRAPPER_CLASS}>
            {canMutate && (
              <>
                <DeleteButton size="small" onClick={handleDelete} />
                <PencilButton size="small" active={isEditMode} onClick={toggleEditMode} />
              </>
            )}

            <LikeIconWrapper onClick={isLiked ? handleUnlike : handleLike}>
              {isLiked ? <ActiveLikeIcon /> : <InactiveLikeIcon />}

              {likesCount > 0 && <LikeCount>{likesCount}</LikeCount>}
            </LikeIconWrapper>
          </IconsWrapper>
        </Header>

        <Content>
          {isEditMode ? (
            <FunctionalTextEditor
              model={textModel}
              rightButtonProps={{
                loading: false,
                iconType: 'save',
                visible: textModel.trimmedValue !== text,
                onClick: handleUpdate,
              }}
            />
          ) : (
            parsedCommentText.length > 0 && (
              <Text
                ref={textRef}
                $expanded={isTextExpanded}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(text),
                }}
              />
            )
          )}

          {fileLinks.length > 0 && (
            <FileListWrapper $expanded={areFilesExpanded} $hasText={parsedCommentText.length > 0}>
              <BlockFileList fileLinks={fileLinks} onDelete={canMutate ? onFileDelete : () => {}} />
            </FileListWrapper>
          )}

          {(isTextExpandable || areFilesExpandable) && (
            <ShowMoreButtonWrapper>
              <ShowMoreButton
                disabled={isEditMode}
                active={isTextExpanded || areFilesExpanded}
                onClick={handleExpand}
              />
            </ShowMoreButtonWrapper>
          )}
        </Content>
      </Body>
    </CommentItemRoot>
  );
});

CommentItem.displayName = 'CommentItem';
export { CommentItem };
