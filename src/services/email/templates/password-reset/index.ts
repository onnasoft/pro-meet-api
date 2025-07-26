import Handlebars from 'handlebars';
import * as fs from 'fs';

const passwordReset = Handlebars.compile(
  fs.readFileSync(
    'src/services/email/templates/password-reset/template.html',
    'utf-8',
  ),
);

export default passwordReset;
