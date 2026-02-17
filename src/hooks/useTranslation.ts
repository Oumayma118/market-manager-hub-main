import { useAppSelector } from '@/hooks/useRedux';
import { getTranslations, TranslationKey } from '@/i18n/translations';

export function useT() {
  const language = useAppSelector(state => state.settings.language);
  const t = getTranslations(language);
  return (key: TranslationKey) => t[key];
}
