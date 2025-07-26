import Handlebars from 'handlebars';
import * as fs from 'fs';

const welcome = Handlebars.compile(
  fs.readFileSync(
    'src/services/email/templates/welcome/template.html',
    'utf-8',
  ),
);

export default welcome;
