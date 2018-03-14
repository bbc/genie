import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import unescape from '../unescape.js';
let func = convert('unescape', unescape, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
