import { routes } from '@/app';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MailTabIcon, MultichatTabIcon } from '../../assets';
import {
  ArrowBackLink,
  PREV_PAGE_QUERY_PARAM,
  UriCodingUtil,
  useMobile,
  type TabModel,
} from '../../lib';
import { PageTemplateWithSubheader } from '../PageTemplateWithSubheader/PageTemplateWithSubheader';

interface Props {
  Header: ReactNode;
  children: ReactNode;
  marginRight?: number;
  rootWidth?: string;
}

const MailingAndChatPageTemplate = (props: Props) => {
  const { Header, children, marginRight, rootWidth } = props;

  const { t } = useTranslation();

  const isMobile = useMobile();

  const [searchParams] = useSearchParams();

  const prevPageFromParams = searchParams.get(PREV_PAGE_QUERY_PARAM);

  const backLinkURL =
    isMobile && prevPageFromParams ? UriCodingUtil.decode(prevPageFromParams) : null;

  const tabs = useMemo<TabModel[]>(
    () => [
      {
        title: t('mail'),
        href: routes.mail,
        Icon: <MailTabIcon />,
      },
      {
        title: t('multichat'),
        href: routes.multichat(),
        Icon: <MultichatTabIcon />,
      },
    ],
    [t]
  );

  return (
    <PageTemplateWithSubheader
      tabs={tabs}
      marginLeft={0}
      Header={Header}
      rootWidth={rootWidth}
      pageMinWidth={isMobile ? 0 : undefined}
      SubheaderContent={
        backLinkURL && <ArrowBackLink small alignBaseToLeft backLink={backLinkURL} />
      }
      marginRight={marginRight}
    >
      {children}
    </PageTemplateWithSubheader>
  );
};

export { MailingAndChatPageTemplate };
