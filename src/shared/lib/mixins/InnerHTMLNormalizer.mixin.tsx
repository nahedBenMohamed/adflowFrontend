import { css } from 'styled-components';

export const InnerHTMLNormalizerMixin = css`
  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  word-break: break-word;
  color: var(--button-text-graphite-priory-text);
  font-family: var(--system-font-families);

  p {
    margin: 0;
    line-break: auto;
    letter-spacing: 0;
  }

  /* Link */
  a {
    color: var(--primary-blue);
    text-decoration: none;
    transition: var(--transition-200);

    &:hover {
      color: var(--button-text-blue-hover);
    }

    &:active {
      color: var(--button-text-blue-active);
    }
  }

  /* Headers */
  h1,
  h2,
  h3,
  h4 {
    font-weight: 600;
    line-height: 110%;
    color: var(--button-text-graphite-priory-text);
  }

  h1 {
    font-size: 32px;

    margin: 0 0 18px;
  }

  h2 {
    font-size: 24px;

    margin: 0 0 10px;
  }

  h3 {
    font-size: 18px;

    margin: 0 0 8px;
  }

  h4 {
    font-size: 16px;

    margin: 0 0 6px;
  }

  /* Lists */
  ul,
  ol {
    flex-shrink: 0;

    margin: 4px 0;
    padding-left: 24px;
  }

  ul {
    list-style-type: disc;
  }

  li {
    margin: 0;

    font-size: 14px;
    line-height: 20px;
  }

  /* Blockquote */
  blockquote {
    font-size: 14px;
    line-height: 20px;
    font-style: italic;
    color: var(--button-text-graphite-priory-text);

    margin: 0 8px;
    padding: 4px 8px;
    border-left: 4px solid var(--graphite-graphite-120);
  }

  /* Dashed delimiter */
  hr {
    border: none;

    margin: 8px 0;
    border-top: 1px dashed var(--button-text-graphite-secondary-text);
  }

  /* Code, pre code block */
  code,
  pre {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: var(--button-text-graphite-priory-text);
    font-family: var(--font-family-mono);
  }

  code {
    padding: 0 4px;
    background-color: var(--graphite-graphite-40);
    border: 1px solid var(--graphite-graphite-80);
    border-radius: var(--border-radius-element);
  }

  pre {
    white-space: pre-wrap;

    margin: 8px 0;
    padding: 8px 16px;
    background-color: var(--graphite-graphite-40);
  }

  pre code {
    padding: 0;
    border: none;
    border-radius: 0;
    background-color: transparent;
  }

  /* Miscellaneous */
  u {
    text-decoration: underline;
  }

  s {
    text-decoration: line-through;
  }

  mark {
    color: var(--button-text-graphite-priory-text);

    padding: 0 2px;
    background-color: var(--background-blue-20);
  }

  strong {
    font-weight: 600;
  }

  em {
    font-style: italic;
  }
`;
