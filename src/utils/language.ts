export const languages = ['en', 'es', 'fr', 'jp', 'zh'] as const;
export type Language = (typeof languages)[number];
export const defaultLanguage: Language = 'en';
