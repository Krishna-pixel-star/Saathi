import { useUser } from '../context/UserContext';

export function useTranslation() {
  const { t, preferredLanguage } = useUser();
  return { t, preferredLanguage };
}
