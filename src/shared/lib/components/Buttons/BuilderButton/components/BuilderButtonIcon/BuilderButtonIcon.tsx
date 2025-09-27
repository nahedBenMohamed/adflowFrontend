import { envUtil } from '@/shared/lib/utils';
import type { ReactNode, Ref } from 'react';
import styled from 'styled-components';
import { LogoFlowerIcon, LogoPromaMinifiedInvertedIcon } from '../../../../../../assets';
import type { CompanyName } from '../../../../../types';

const Root = styled.div`
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const logosMap: Record<CompanyName, ReactNode> = {
  Amwork: <LogoFlowerIcon />,
  Mywork: <LogoFlowerIcon />,
  Platforma500: <LogoFlowerIcon />,
  Proma: <LogoPromaMinifiedInvertedIcon />,
};

interface Props {
  ref?: Ref<HTMLDivElement>;
}

const BuilderButtonIcon = (props: Props) => {
  const { ref } = props;

  return <Root ref={ref}>{logosMap[envUtil.appLogo]}</Root>;
};

export { BuilderButtonIcon };
