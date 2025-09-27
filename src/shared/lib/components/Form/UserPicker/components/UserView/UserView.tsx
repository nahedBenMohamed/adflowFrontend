import { memo } from 'react';
import styled from 'styled-components';
import { TruncateMixin } from '../../../../../mixins';
import type { User } from '../../../../../models';
import { AvatarCircle, type AvatarSize } from '../../../../AvatarCircle/AvatarCircle';
import { SpanWithEllipsis } from '../../../../SpanWithEllipsis/SpanWithEllipsis';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

const Value = styled.div<{ $size: AvatarSize }>`
  font-size: 14px;
  font-weight: 500;
  line-break: none;
  line-height: 14px;
  color: var(--button-text-graphite-priory-text);

  // to make it same as UserPicker
  ${p => p.$size === 'large' && `padding: 4px 8px;`}

  ${TruncateMixin}
`;

interface Props {
  user: User;
  size?: AvatarSize;
}

const UserView = memo((props: Props) => {
  const { user, size = 'large' } = props;

  return (
    <Root>
      <AvatarCircle avatar={user.getAvatar()} size={size} />

      <Value $size={size}>
        <SpanWithEllipsis text={user.fullName} />
      </Value>
    </Root>
  );
});

UserView.displayName = 'UserView';
export { UserView };
