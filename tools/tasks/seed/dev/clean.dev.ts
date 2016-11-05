import * as rmfr from 'rmfr';
import { join, resolve  } from 'path';

import Config from '../../../config';

export = (done: any) => {

  let files = join(resolve( './' + Config.CLIENT_APP_PATH), '**', '*.+(js|map|css)');

  rmfr(files, {glob: true})
    .then(() => {
    console.log(files, ' has been removed successfully.');
    done();
  })
    .catch(console.error);
};
