// This page should not use any not widely supported css features like flexbox gap, etc.

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { LogoLink, envUtil, useTitle } from '../../../lib';

const Root = styled.div`
  height: 100dvh;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 160px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  color: var(--button-text-graphite-priory-text);

  margin-top: 2rem;
`;

const Annotation = styled.p`
  max-width: 800px;

  font-size: 1.2rem;
  text-align: center;
  line-height: 1.75rem;
  color: var(--button-text-graphite-primary-text);

  margin-top: 1rem;
`;

const List = styled.ul`
  list-style: disc;
  margin-top: 1rem;
`;

const ListItem = styled.li`
  font-size: 1.2rem;
  line-height: 1.75rem;
  color: var(--button-text-graphite-primary-text);
`;

const StyledLink = styled(Link)`
  color: var(--primary-blue);
  text-decoration: underline;
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

type BrowserUpdateInfo = {
  name: string;
  link: string;
};

const browsers: BrowserUpdateInfo[] = [
  {
    name: 'Chrome',
    link: 'https://www.google.com/chrome/update',
  },
  {
    name: 'Firefox',
    link: 'https://support.mozilla.org/kb/update-firefox-latest-release',
  },
  {
    name: 'Safari',
    link: 'https://support.apple.com/102665',
  },
  {
    name: 'Opera',
    link: 'https://www.opera.com/download',
  },
];

const BrowserNotSupportedPage = () => {
  const { t } = useTranslation();

  useTitle({ titleTranslationKey: 'system.browser_not_supported.page_title' });

  return (
    <Root>
      <LogoLink />

      <Title>{t('browser_not_supported_title')}</Title>

      <Annotation>
        {t('browser_not_supported_annotation', {
          company: envUtil.appName,
        })}
      </Annotation>

      <List>
        {browsers.map(b => (
          <ListItem key={b.name}>
            <b>{b.name}</b> –{' '}
            <StyledLink to={b.link} target="_blank">
              {b.link}
            </StyledLink>
          </ListItem>
        ))}
      </List>
    </Root>
  );
};

export { BrowserNotSupportedPage };
