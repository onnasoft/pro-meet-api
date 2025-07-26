import { TemplateDelegate } from 'handlebars';

export interface HTMLTemplate<T = Record<string, unknown>> {
  template: TemplateDelegate;
  translations: T;
}
