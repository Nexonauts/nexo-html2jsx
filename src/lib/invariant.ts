/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
'use strict';
const validateFormat = process['env']['NODE_ENV'] !== "production" ? (format: string | undefined) => {
  if (format === undefined) {
      throw new Error('invariant(...): Second argument must be a string.');
  }
} : (_format: string | undefined) => {};


/**
* Use invariant() to assert state which your program assumes to be true.
*
* Provide sprintf-style format (only %s is supported) and arguments to provide
* information about what broke and what you were expecting.
*
* The invariant message will be stripped in production, but the invariant will
* remain to ensure logic does not differ in production.
*/
function invariant(condition: boolean, format?: string, ...args: any[]) {
  validateFormat(format);

  if (!condition) {
      let error: Error;

      if (format === undefined) {
          error = new Error('Minified exception occurred; use the non-minified dev environment ' +
              'for the full error message and additional helpful warnings.');
      } else {
          let argIndex = 0;
          error = new Error(format.replace(/%s/g, () => String(args[argIndex++])));
          error.name = 'Invariant Violation';
      }

      (error as any).framesToPop = 1; // Skip invariant's own stack frame.

      throw error;
  }
}

export default invariant;
