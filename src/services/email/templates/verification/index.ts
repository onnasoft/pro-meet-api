import Handlebars from 'handlebars';
import * as fs from 'fs';

const verification = Handlebars.compile(
  fs.readFileSync(
    'src/services/email/templates/verification/template.html',
    'utf-8',
  ),
);

export default verification;
