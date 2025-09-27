import { ExternalSystemCode, LinkIcon, type ExternalEntity } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Fragment, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  AirtableIcon,
  AmocrmIcon,
  BitrixIcon,
  ExcelIcon,
  FacebookIcon,
  FreshsalesIcon,
  HubspotIcon,
  InstagramIcon,
  LinkedinIcon,
  MicrosoftIcon,
  MondayIcon,
  NotionIcon,
  OracleIcon,
  PipedriveIcon,
  SalesforceIcon,
  SapIcon,
  SugarcrmIcon,
  TwitterIcon,
  ZendeskIcon,
  ZohoIcon,
} from '../../../assets';
import { CardBlock } from './components/CardBlock/CardBlock';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 16px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const LinkIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg path {
    transition: var(--transition-200);
  }
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);

    ${LinkIconWrapper} {
      svg path {
        fill: var(--primary-blue);
      }
    }
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;

  padding: 16px;
`;

const FieldName = styled.div`
  max-width: 180px;

  font-weight: 400;
  color: var(--button-text-graphite-secondary-text);
`;

const FieldValue = styled.div`
  font-weight: 400;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  externalEntity: ExternalEntity;
}

const ExternalMiniCard = observer((props: Props) => {
  const { externalEntity } = props;

  const { t } = useTranslation();

  const externalSystem = externalEntity.system;

  const getIcon = (code: ExternalSystemCode): ReactNode => {
    switch (code) {
      case ExternalSystemCode.SALESFORCE:
        return <SalesforceIcon />;

      case ExternalSystemCode.PIPEDRIVE:
        return <PipedriveIcon />;

      case ExternalSystemCode.AMOCRM:
        return <AmocrmIcon />;

      case ExternalSystemCode.AIRTABLE:
        return <AirtableIcon />;

      case ExternalSystemCode.BITRIX:
        return <BitrixIcon />;

      case ExternalSystemCode.EXCEL:
        return <ExcelIcon />;

      case ExternalSystemCode.FACEBOOK:
        return <FacebookIcon />;

      case ExternalSystemCode.FRESHSALES:
        return <FreshsalesIcon />;

      case ExternalSystemCode.HUBSPOT:
        return <HubspotIcon />;

      case ExternalSystemCode.INSTAGRAM:
        return <InstagramIcon />;

      case ExternalSystemCode.LINKEDIN:
        return <LinkedinIcon />;

      case ExternalSystemCode.MICROSOFT:
        return <MicrosoftIcon />;

      case ExternalSystemCode.MONDAY:
        return <MondayIcon />;

      case ExternalSystemCode.NOTION:
        return <NotionIcon />;

      case ExternalSystemCode.ORACLE:
        return <OracleIcon />;

      case ExternalSystemCode.SAP:
        return <SapIcon />;

      case ExternalSystemCode.SUGARCRM:
        return <SugarcrmIcon />;

      case ExternalSystemCode.TWITTER:
        return <TwitterIcon />;

      case ExternalSystemCode.ZENDESK:
        return <ZendeskIcon />;

      case ExternalSystemCode.ZOHO:
        return <ZohoIcon />;

      default:
        return null;
    }
  };

  return (
    <CardBlock>
      <Header>
        <Title href={externalEntity.url} target="_blank">
          <LinkIconWrapper>
            <LinkIcon />
          </LinkIconWrapper>

          {externalSystem && externalSystem.name}
          {!externalSystem && t('external_link')}
        </Title>

        <>{externalSystem && getIcon(externalSystem.code)}</>
      </Header>

      <Content>
        {externalEntity.uiData &&
          externalEntity.uiData
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((v, idx) => (
              <Fragment key={idx}>
                <FieldName>{v.label}</FieldName>
                <FieldValue>{v.value}</FieldValue>
              </Fragment>
            ))}
      </Content>
    </CardBlock>
  );
});

ExternalMiniCard.displayName = 'ExternalMiniCard';
export { ExternalMiniCard };
