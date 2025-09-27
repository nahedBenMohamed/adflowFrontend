import { envUtil, type PrimaryButtonVariant } from '@/shared';
import { memo } from 'react';
import { TelephonyIntegrationGuideInternational } from '../TelephonyIntegrationGuideInternational/TelephonyIntegrationGuideInternational';
import { TelephonyIntegrationGuideRU } from '../TelephonyIntegrationGuideRU/TelephonyIntegrationGuideRU';

interface Props {
  buttonVariant?: PrimaryButtonVariant;
}

const TelephonyIntegrationGuide = memo((props: Props) => {
  const { buttonVariant = 'link-outlined' } = props;

  return (
    envUtil.voximplantShowTelephony && (
      <>
        {envUtil.voximplantIntegrationGuideType === 'ru' && (
          <TelephonyIntegrationGuideRU buttonVariant={buttonVariant} />
        )}

        {envUtil.voximplantIntegrationGuideType === 'international' && (
          <TelephonyIntegrationGuideInternational buttonVariant={buttonVariant} />
        )}
      </>
    )
  );
});

TelephonyIntegrationGuide.displayName = 'TelephonyIntegrationGuide';
export { TelephonyIntegrationGuide };
