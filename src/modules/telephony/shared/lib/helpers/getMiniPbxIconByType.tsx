import type { ReactNode } from 'react';
import {
  BeelineMiniIcon,
  MangoOfficeMiniIcon,
  MegafonMiniIcon,
  MgtsMiniIcon,
  MtsMiniIcon,
  RostelecomMiniIcon,
  Tele2MiniIcon,
  UisMiniIcon,
  UnknownMiniIcon,
  ZadarmaMiniIcon,
} from '../../assets';
import { PbxProviderType } from '../models';

export const getMiniPbxIconByType = (providerType: PbxProviderType): ReactNode => {
  switch (providerType) {
    case PbxProviderType.BEELINE:
      return <BeelineMiniIcon />;

    case PbxProviderType.MTS:
      return <MtsMiniIcon />;

    case PbxProviderType.MGTS:
      return <MgtsMiniIcon />;

    case PbxProviderType.TELE2:
      return <Tele2MiniIcon />;

    case PbxProviderType.MEGAFON:
      return <MegafonMiniIcon />;

    case PbxProviderType.ROSTELECOM:
      return <RostelecomMiniIcon />;

    case PbxProviderType.MANGO_OFFICE:
      return <MangoOfficeMiniIcon />;

    case PbxProviderType.UIS:
      return <UisMiniIcon />;

    case PbxProviderType.ZADARMA:
      return <ZadarmaMiniIcon />;

    default:
      return <UnknownMiniIcon />;
  }
};
