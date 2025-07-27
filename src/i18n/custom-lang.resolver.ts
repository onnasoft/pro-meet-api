import { defaultLanguage, languages } from '@/utils/language';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';

const _languages = new Set(languages);

@Injectable()
export class CustomLangResolver implements I18nResolver {
  resolve(context: ExecutionContext): string | Promise<string> {
    const req = context.switchToHttp().getRequest();

    const cookieHeader = req.headers.cookie || '';
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [k, v] = c.split('=');
        return [k, decodeURIComponent(v)];
      }),
    );

    const lang = req.headers['x-lang'] || req.query.lang;
    if (_languages.has(lang)) {
      return lang;
    }

    if (!_languages.has(cookies.language)) {
      return defaultLanguage;
    }

    return cookies.language;
  }
}
