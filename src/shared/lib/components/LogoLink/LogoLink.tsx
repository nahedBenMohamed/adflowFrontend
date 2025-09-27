import { generalSettingsStore, routes } from '@/app';
import { LogoPlatformaIcon, LogoPlatformaTextIcon, SkeletonAnimationMixin } from '@/shared';
import { observer } from 'mobx-react-lite';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  LogoAmworkIcon,
  LogoAmworkTextIcon,
  LogoMyworkIcon,
  LogoMyworkTextIcon,
  LogoPromaIcon,
  LogoPromaTextIcon,
} from '../../../assets';
import type { CompanyName } from '../../types';
import { envUtil } from '../../utils';

const LogoWrapper = styled.div<{ $large?: boolean }>`
  height: ${p => (p.$large ? 44 : 32)}px;
  width: ${p => (p.$large ? 200 : 149)}px;

  svg {
    height: ${p => (p.$large ? 44 : 32)}px;
    width: ${p => (p.$large ? 200 : 149)}px;
  }
`;

const CustomLogoImage = styled.img`
  height: 24px;
`;

const LogoSkeleton = styled.div`
  width: 149px;
  height: 24px;

  border-radius: var(--border-radius-element);

  ${SkeletonAnimationMixin}
`;

const TextOnlyLogoWrapper = styled.div`
  height: 26px;
  width: fit-content;

  display: flex;
  align-items: center;
`;

interface Props {
  href?: string;
  large?: boolean;
  textOnly?: boolean;
  showAccountLogo?: boolean;
}

const textOnlyLogosMap: Record<CompanyName, ReactNode> = {
  Proma: <LogoPromaTextIcon />,
  Amwork: <LogoAmworkTextIcon />,
  Mywork: <LogoMyworkTextIcon />,
  Platforma500: <LogoPlatformaTextIcon />,
};

const logosMap: Record<CompanyName, ReactNode> = {
  Proma: <LogoPromaIcon />,
  Amwork: <LogoAmworkIcon />,
  Mywork: <LogoMyworkIcon />,
  Platforma500: <LogoPlatformaIcon />,
};

const LogoLink = observer((props: Props) => {
  const { href, large, textOnly, showAccountLogo } = props;

  const { t } = useTranslation();

  const { account } = generalSettingsStore;

  if (!generalSettingsStore.isLoaded && showAccountLogo)
    return <LogoSkeleton title={t('loading_title')} />;

  return (
    <Link to={href || routes.activities} target={href ? '_blank' : '_self'}>
      {showAccountLogo && account?.logoUrl ? (
        <CustomLogoImage src={`${account.logoUrl}?height=48`} alt={`${account.companyName} logo`} />
      ) : textOnly ? (
        <TextOnlyLogoWrapper>{textOnlyLogosMap[envUtil.appLogo]}</TextOnlyLogoWrapper>
      ) : (
        <LogoWrapper $large={large}>{logosMap[envUtil.appLogo]}</LogoWrapper>
      )}
    </Link>
  );
});

LogoLink.displayName = 'LogoLink';
export { LogoLink };
