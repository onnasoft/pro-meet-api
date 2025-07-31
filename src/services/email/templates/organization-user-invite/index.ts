import Handlebars from 'handlebars';
import * as fs from 'fs';

const organizationUserInvite = Handlebars.compile(
  fs.readFileSync(
    'src/services/email/templates/organization-user-invite/template.html',
    'utf-8',
  ),
);

export default organizationUserInvite;
