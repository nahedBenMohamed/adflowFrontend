import { AvatarUtil, type User } from '@/shared';
import { memo } from 'react';
import styled from 'styled-components';

const MAX_IDX = 4;
const IMAGE_SIZE = 24;

const IMAGE_RES_MULTIPLIER = 4;
const IMAGE_SIZE_WITH_RES = IMAGE_SIZE * IMAGE_RES_MULTIPLIER;

const AvatarsContainer = styled.div`
  position: relative;

  height: 26px;
`;

const createCSS = () => {
  // make sure one avatar is slightly overlapped by the next one,
  // to get rid of code duplication we use a loop to generate css
  let css = '';

  for (let i = 1; i <= MAX_IDX + 1; i++) {
    css += `
      &:nth-child(${i}) {
        top: 0;
        left: calc(18px * ${i - 1});

        &:hover {
          z-index: 10;
        }

        ${
          i === MAX_IDX + 1 &&
          `
          font-weight: 400;
          font-size: 9px;
          color: var(--button-text-graphite-primary-text);

          box-shadow: inset 0 0 0 1px var(--button-text-graphite-primary-text);
          background-color: var(--primary-statuses-white-0);
        `
        }
      }
    `;
  }

  return css;
};

interface AvatarProps {
  $bgColor?: string;
  $usersLeft?: number;
}

const Avatar = styled.div<AvatarProps>`
  position: absolute;

  // 24px + 2px top and bottom white border
  width: 26px;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  border: 1px solid var(--primary-statuses-white-0);
  background: ${p => (p.$bgColor ? p.$bgColor : `var(--button-text-graphite-secondary-text)`)};

  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  color: var(--primary-statuses-white-0);

  ${createCSS()}
`;

interface Props {
  participants: User[];
}

const generateMoreCount = (length: number): string => {
  const count = length - MAX_IDX;

  return count < 100 ? '+' + count : '+99';
};

const generateMoreTitle = (participants: User[]): string =>
  participants
    .slice(MAX_IDX, participants.length)
    .map(p => p.fullName)
    .join('\n');

const ParticipantsBlock = memo((props: Props) => {
  const { participants } = props;

  return (
    <AvatarsContainer>
      {participants.map((p, idx) => {
        if (idx < MAX_IDX) {
          const { avatarUrl } = p.getAvatar();
          const initials = AvatarUtil.extractInitials(p.firstName, p.lastName);
          const initialsAvatarBgColor = AvatarUtil.getInitialsBackground(initials);

          return avatarUrl ? (
            <Avatar
              key={p.id}
              as="img"
              title={p.fullName}
              alt={`${p.firstName} avatar`}
              src={`${avatarUrl}?width=${IMAGE_SIZE_WITH_RES}&height=${IMAGE_SIZE_WITH_RES}`}
            />
          ) : (
            <Avatar key={p.id} title={p.fullName} $bgColor={initialsAvatarBgColor}>
              {initials}
            </Avatar>
          );
        }

        if (idx === MAX_IDX)
          return (
            <Avatar key={p.id} title={generateMoreTitle(participants)}>
              {generateMoreCount(participants.length)}
            </Avatar>
          );

        return null;
      })}
    </AvatarsContainer>
  );
});

ParticipantsBlock.displayName = 'ParticipantsBlock';
export { ParticipantsBlock };
