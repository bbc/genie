import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import identity from '../identity.js';
let func = convert('identity', identity, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
