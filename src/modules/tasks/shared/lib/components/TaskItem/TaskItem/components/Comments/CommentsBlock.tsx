import { authStore } from '@/modules/auth';
import autoAnimate from '@formkit/auto-animate';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useIntersectionObserver } from 'usehooks-ts';
import type { CreateTaskCommentDto, UpdateTaskCommentDto } from '../../../../../../../api';
import type { TaskComment } from '../../../../../models';
import { AddComment } from './AddComment';
import { CommentItem } from './CommentItem';

const Root = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const CommentsList = styled.ul`
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LoadMoreObserver = styled.div`
  position: absolute;
  bottom: 0;

  width: 100%;
  height: 5px;
`;

interface Props {
  comments: TaskComment[];
  loadMore: () => void;
  onAdd: (dto: CreateTaskCommentDto) => Promise<void>;
  onDelete: (commentId: number) => void;
  onUpdate: (commentId: number, dto: UpdateTaskCommentDto) => void;
  onLike: (commentId: number) => void;
  onUnlike: (commentId: number) => void;
}

const CommentsBlock = observer((props: Props) => {
  const { comments, loadMore, onAdd, onUpdate, onDelete, onLike, onUnlike } = props;
  const currentUser = authStore.user;

  const listRef = useRef<HTMLUListElement>(null);

  const { isIntersecting, ref: lastElement } = useIntersectionObserver({});

  useEffect(() => {
    if (isIntersecting) loadMore();
  }, [isIntersecting, loadMore]);

  useEffect(() => {
    listRef.current && autoAnimate(listRef.current);
  }, [listRef]);

  if (!currentUser) return null;

  return (
    <Root>
      <AddComment currentUser={currentUser} onAdd={onAdd} />

      <CommentsList ref={listRef}>
        {comments.map(c => (
          <CommentItem
            key={c.id}
            comment={c}
            currentUser={currentUser}
            onLike={onLike}
            onUnlike={onUnlike}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}

        <LoadMoreObserver ref={lastElement} />
      </CommentsList>
    </Root>
  );
});

CommentsBlock.displayName = 'CommentsBlock';
export { CommentsBlock };
