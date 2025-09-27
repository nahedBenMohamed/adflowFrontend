import type { FeedStore } from '@/modules/card';
import type { MailThreadInfo } from '@/modules/mailing';
import type { Activity, Task } from '@/modules/tasks';
import type { CallInfo, FeedGroup, FeedItem, FileLink, Note, Option } from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import styled from 'styled-components';
import { FeedItemType } from '../../../../models';
import { CallBlock } from '../CallBlock/CallBlock';
import { DocumentBlock } from '../DocumentBlock/DocumentBlock';
import { ActivityBlock } from '../FeedItem/ActivityBlock/ActivityBlock';
import { MailThreadBlock } from '../MailThreadBlock/MailThreadBlock';
import { NoteBlock } from '../NoteBlock/NoteBlock';
import { TaskBlock } from '../TaskBlock/TaskBlock';

const GroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Props {
  group: FeedGroup;
  feedStore: FeedStore;
  entityEmailOptions: Option<string>[];
}

const FeedItemList = observer((props: Props) => {
  const { feedStore, group, entityEmailOptions } = props;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current && autoAnimate(ref.current);
  }, [ref]);

  const getFeedItemComp = useCallback(
    (feedItem: FeedItem): ReactNode => {
      switch (feedItem.type) {
        case FeedItemType.NOTE:
          const note = feedItem.data as Note;

          return (
            <NoteBlock
              note={note}
              key={feedItem.id}
              updateNote={note => feedStore.updateNote({ note, feedItemId: feedItem.id })}
              onDelete={() =>
                feedStore.deleteNote({
                  entityId: note.entityId,
                  noteId: note.id,
                  feedItemId: feedItem.id,
                })
              }
            />
          );

        case FeedItemType.ACTIVITY: {
          const activity = feedItem.data as Activity;

          return (
            <ActivityBlock
              key={feedItem.id}
              activity={activity}
              updateActivity={feedStore.updateActivity}
              onDelete={() =>
                feedStore.deleteActivity({ activityId: activity.id, feedItemId: feedItem.id })
              }
            />
          );
        }

        case FeedItemType.TASK: {
          const task = feedItem.data as Task;

          return (
            <TaskBlock
              key={feedItem.id}
              task={task}
              syncTask={newState => feedStore.syncTaskState({ newState, feedItemId: feedItem.id })}
              deleteTask={() => feedStore.deleteTask({ taskId: task.id, feedItemId: feedItem.id })}
              updateTask={feedStore.updateTask}
            />
          );
        }

        case FeedItemType.MAIL: {
          const thread = feedItem.data as MailThreadInfo;

          return (
            <MailThreadBlock
              key={feedItem.id}
              mailThread={thread}
              entityEmailOptions={entityEmailOptions}
            />
          );
        }

        case FeedItemType.DOCUMENT: {
          const fileLink = feedItem.data as FileLink;

          return (
            <DocumentBlock key={feedItem.id} createdAt={feedItem.createdAt} fileLink={fileLink} />
          );
        }

        case FeedItemType.CALL: {
          const call = feedItem.data as CallInfo;

          return <CallBlock key={feedItem.id} call={call} updateCall={feedStore.updateCall} />;
        }

        default:
          return null;
      }
    },
    [feedStore, entityEmailOptions]
  );

  return <GroupWrapper ref={ref}>{group.items.map(i => getFeedItemComp(i))}</GroupWrapper>;
});

FeedItemList.displayName = 'FeedItemList';
export { FeedItemList };
