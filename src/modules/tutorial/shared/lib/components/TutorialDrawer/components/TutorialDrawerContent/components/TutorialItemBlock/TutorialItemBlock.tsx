import { SpanWithEllipsis, TruncateMixin, UtcDate } from '@/shared';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useTutorialItemOutlined } from '../../../../../../hooks';
import type { TutorialItem } from '../../../../../../models';

const Root = styled(Link)<{ $outlined: boolean }>`
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);

  border: none;
  padding: 12px 24px;
  background: var(--graphite-graphite-20);
  border-radius: var(--border-radius-element);
  border-left: 1px solid var(--graphite-graphite-20);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-graphite-priory-text);
  }

  ${p =>
    !p.$outlined &&
    css`
      &:hover {
        background: #f3fded;
        border-color: #f3fded;
      }

      &:active {
        background: #e6fbda;
        border-color: #f3fded;
      }
    `}

  ${p => p.$outlined && `border-left: 4px solid var(--primary-statuses-green-520)`};

  ${TruncateMixin}
`;

interface Props {
  tutorialItem: TutorialItem;
  lastOpenedDate?: string;
}

const TutorialItemBlock = (props: Props) => {
  const {
    tutorialItem: { name, link, createdAt },
    lastOpenedDate,
  } = props;

  const outlined = useTutorialItemOutlined({
    createdAt,
    lastOpenedDate: UtcDate.parseISONullable(lastOpenedDate),
  });

  return (
    <Root to={link} target="_blank" rel="noreferrer noopener" $outlined={outlined}>
      <SpanWithEllipsis text={name} />
    </Root>
  );
};

export { TutorialItemBlock };
