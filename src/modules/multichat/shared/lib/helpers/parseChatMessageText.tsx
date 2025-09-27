import type { ReactNode } from 'react';

export const parseChatMessageText = (text: string): ReactNode => {
  const urlPattern = /(https?:\/\/\S+)/g;

  const parts = text.split(urlPattern);

  return parts.map((p, idx) =>
    urlPattern.test(p) ? (
      <a key={idx} href={p} target="_blank" rel="noopener noreferrer">
        {p}
      </a>
    ) : (
      p
    )
  );
};
