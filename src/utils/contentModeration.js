import { forbiddenKeywords } from './forbiddenKeywords';

export const containsForbiddenKeywords = (text) => {
  if (!text) {
    return false;
  }

  const lowercasedText = text.toLowerCase();

  for (const keyword of forbiddenKeywords) {
    if (lowercasedText.includes(keyword.toLowerCase())) {
      return true;
    }
  }

  return false;
};
