import { useDocumentTitle } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { envUtil } from '../utils';

export const useTitle = ({
  titleTranslationKey,
  dynamicTitle,
}: {
  titleTranslationKey?: string;
  dynamicTitle?: string;
}) => {
  const { t } = useTranslation('common', {
    keyPrefix: 'page_title',
  });

  const newTitle = titleTranslationKey ? t(titleTranslationKey) : dynamicTitle;

  useDocumentTitle(newTitle ? `${newTitle} | ${envUtil.appName}` : envUtil.appName);
};
