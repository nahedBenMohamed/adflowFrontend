import { ChatProviderStatus } from '@/modules/multichat';
import { Hint, SpanWithEllipsis } from '@/shared';
import type { TFunction } from 'i18next';
import type { ReactNode } from 'react';

export const getStatusNameWithHint = ({
  status,
  t,
}: {
  status: ChatProviderStatus;
  t: TFunction;
}): ReactNode => {
  switch (status) {
    case ChatProviderStatus.ACTIVE:
      return (
        <>
          <SpanWithEllipsis text={t('active')} />
          <Hint text={t('active_hint')} />
        </>
      );

    case ChatProviderStatus.INACTIVE:
      return (
        <>
          <SpanWithEllipsis text={t('inactive')} />
          <Hint text={t('inactive_hint')} />
        </>
      );

    case ChatProviderStatus.DELETED:
      return (
        <>
          <SpanWithEllipsis text={t('deleted')} />
          <Hint text={t('deleted_hint')} />
        </>
      );

    case ChatProviderStatus.DRAFT:
      return (
        <>
          <SpanWithEllipsis text={t('draft')} />
          <Hint text={t('draft_hint')} />
        </>
      );

    default:
      return null;
  }
};
