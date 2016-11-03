import * as gulp from 'gulp';
import { protractor } from 'gulp-protractor';
import { ProtractorDevServer } from '../../utils';

import {
  BROWSER_PATH
} from '../../config';

export = (done: any) => {
  new ProtractorDevServer()
    .server()
    .then((server: any) => {

      var src = './' + BROWSER_PATH + '/**/*.e2e-spec.js';

      gulp

      /**
       * ts-node transpiles files at run tine in
       * memory, so gulp will still find js files
       * though not written to file system.
       */
        .src(src)
        .pipe(protractor({ configFile: 'protractor.conf.js' }))
        .on('error', (error: string) => { throw error; })
        .on('end', () => { server.close(done); });
    });
};
