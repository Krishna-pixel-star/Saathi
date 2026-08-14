import { useUser } from '../context/UserContext';
import { translations } from '../utils/translations';

export function useTranslation() {
  const { preferredLanguage } = useUser();

  const t = (key, variables = {}) => {
    // Default to English if the language or translation is not found
    const dictionary = translations[preferredLanguage] || translations['English'];
    let translatedString = dictionary[key] || translations['English'][key] || key;

    // Replace variables in the string if any (e.g. {name})
    Object.keys(variables).forEach((variableKey) => {
      translatedString = translatedString.replace(`{${variableKey}}`, variables[variableKey]);
    });

    return translatedString;
  };

  return { t };
}
