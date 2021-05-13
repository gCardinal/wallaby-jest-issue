import { format } from 'winston';

/**
 * Winston's timestamp format uses fecha behind the scenes, formatting rules can
 * be found in fecha's documentation.
 *
 * @see https://www.npmjs.com/package/fecha
 */
export const timestamp = format.timestamp({
  format: 'YYYY-MM-DD hh:mm:ss.SSS ZZ',
});
