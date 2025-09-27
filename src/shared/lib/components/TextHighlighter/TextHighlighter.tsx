import styled, { css, type CSSProperties } from 'styled-components';
import { TruncateMixin } from '../../mixins';
import type { Nullable } from '../../types';

const Root = styled.div<{ $truncate?: boolean }>`
  ${p =>
    p.$truncate &&
    css`
      ${TruncateMixin}
    `}
`;

interface HighlightStringProps {
  $textColor?: CSSProperties['color'];
  $bgColor?: CSSProperties['backgroundColor'];
}

const HighlightedString = styled.span<HighlightStringProps>`
  color: ${p => p.$textColor ?? 'var(--button-text-graphite-priory-text)'};

  background-color: ${p => p.$bgColor ?? 'var(--secondary-yellow-240)'};
`;

interface Props {
  str: string;
  filter: Nullable<string>;
  hlTextColor?: CSSProperties['color'];
  hlBgColor?: CSSProperties['backgroundColor'];
  truncate?: boolean;
}

const TextHighlighter = (props: Props) => {
  const { filter, str, hlTextColor, hlBgColor, truncate } = props;

  if (!filter)
    return (
      <Root $truncate={truncate} title={truncate ? str : undefined}>
        {str}
      </Root>
    );

  // replace is being used to escape special characters which can break the regexp,
  // e.g. "+" in the phone number
  const regexp = new RegExp(filter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi');
  const matchValue = str.match(regexp);

  if (matchValue) {
    return (
      <Root $truncate={truncate} title={truncate ? str : undefined}>
        {str.split(regexp).map((s, idx, arr) => {
          if (idx < arr.length - 1) {
            const overlap = matchValue.shift();

            return (
              <span key={idx}>
                {s}

                <HighlightedString $textColor={hlTextColor} $bgColor={hlBgColor}>
                  {overlap}
                </HighlightedString>
              </span>
            );
          }

          return s;
        })}
      </Root>
    );
  }

  return <Root>{str}</Root>;
};

export { TextHighlighter };
