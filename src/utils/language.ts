export const languages = ['en', 'es', 'fr', 'zh', 'ja'] as const;
export type Language = (typeof languages)[number];
export const defaultLanguage: Language = 'en';
